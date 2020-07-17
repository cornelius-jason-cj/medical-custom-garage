const Invoice = require('../models/invoice');
const Profit = require('../models/profit');
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const hbs = require('handlebars')


exports.getSecret = function(req, res) {
  return res.json({secret: 'I am a secret message'})
}

exports.getInvoice = function(req, res) {
  Invoice.find({})
    .exec((errors, items) => {
      
      if (errors) {
        return res.status(422).send({errors});
      }

      return res.json(items);
    })
}

exports.getProfit = function(req, res) {
  Profit.find({})
    .exec((errors, items) => {
      
      if (errors) {
        return res.status(422).send({errors});
      }

      return res.json(items);
    })
}

exports.postInvoice = async function(req, res) {

  const data = req.body;
  data.total = data.total.replace(new RegExp('\\'+(1111).toLocaleString().replace(/1/g,''),'g'),'');
  data.modal = data.modal.replace(new RegExp('\\'+(1111).toLocaleString().replace(/1/g,''),'g'),'');
  let totalBelanja = parseInt(data.total) - parseInt(data.downPaymentAmount)
  let totalKeuntungan = totalBelanja - parseInt(data.modal)
  Object.assign(data,{totalBelanja, totalKeuntungan});

  if(data.downPaymentAmount != 0) {
    let removeDP = data.items.map((item) => {return item.itemName}).indexOf('Down Payment')
    data.items.splice(removeDP,1)
  }

  let lastIndex = data.items.length
  let currentPage = 1
  let totalPage = Math.ceil(lastIndex / 12)

  process.chdir('./server')
  
  const compileHtml = async function (templateName, data) {
    
    const filePath = path.join(process.cwd(), 'templates', `${templateName}.hbs`);
    const html = await fs.readFile(filePath, 'utf-8');

    return hbs.compile(html)(data);
  };

  hbs.registerHelper("inc", (value, options) => {
    return parseInt(value) + 1;
  })

  hbs.registerHelper("customerName", (value) => {
    return value.data.root.customerName
  })

  hbs.registerHelper("sisahPembayaran", (value) => {
    let sisahPembayaran = value.data.root.total
    return new Intl.NumberFormat().format(sisahPembayaran)
  })

  hbs.registerHelper("totalBelanja", (value) => {
    return value.data.root.totalBelanja.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  })

  hbs.registerHelper("totalDP", (value) => {
    return value.data.root.downPaymentAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  })

  hbs.registerHelper("margin", () => {
    let marginStart

    switch (lastIndex % 12) {
      case 0:
        marginStart = 48;
        break;
      case 1:
        marginStart = 240;
        break;
      case 2:
        marginStart = 222;
        break;
      case 3:
        marginStart = 204;
        break;
      case 4:
        marginStart = 186;
        break;
      case 5:
        marginStart = 168;
        break;
      case 6:
        marginStart = 150;
        break;
      case 7:
        marginStart = 132;
        break;
      case 8:
        marginStart = 114;
        break;
      case 9:
        marginStart = 96;
        break;
      case 10:
        marginStart = 78;
        break;
      case 11:
        marginStart = 58;
        break;
    }

    return marginStart+'px'
  })

  hbs.registerHelper("showData", (options) => {
    let index = options.data.index;
    let nth = options.hash.nth;

    if (index < nth || ( index > nth && index % nth != 0)) {
      return options.fn(this)
    }

  })

  hbs.registerHelper("dataLimit", (options) => {
    let index = options.data.index;
    let nth = options.hash.nth;

    if (index != 0 && index % nth === 0) {
      currentPage += 1
      return options.fn(this)
    }
  })

  hbs.registerHelper("lastData", (options) => {
    let index = options.data.index;
    let lastIndex = options.data.root.items.length;
    
    if ( (currentPage === totalPage || totalPage === 0 ) && index === lastIndex-1) {
      return options.fn(this)
    }
  })
  

  try {
    let fileName = 'INV'+data.invoiceNumber+'-'+data.customerName+'-'+data.createdAt;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const header = await compileHtml('invoiceHeader', data);
    const content = await compileHtml('invoiceContent', data);
    const footer = await compileHtml('invoiceFooter');
    await page.setContent(content);
    await page.emulateMedia('screen');
    await page.addStyleTag({
      'content': '@page {size: A5 landscape;}'
    })
    await page.pdf({
      width:'21cm',
      height:'14cm',
      path:`invoiceList/${fileName}.pdf`,
      displayHeaderFooter: true,
      headerTemplate: header,
      footerTemplate: footer,
      printBackground: true,
      margin: {
        top:146,
        bottom:46
      }
    })
    await browser.close();
    
    process.chdir('../')

    data.total = data.totalBelanja.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    data.modal = data.modal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    data.keuntungan = data.totalKeuntungan.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

    new Invoice({invoiceNumber: fileName, total: data.total, modal: data.modal, keuntungan: data.keuntungan}).save((err) => {
      if (err) return console.error(err);

      return res.status(201).send('Create Invoice Success');
    })

  }catch (err) {
    console.log('error', err)
  }
}
  
exports.updateInvoice = async function(req, res) {
  console.log('masuk ke update invoice')
  console.log("req.body", req.body)
  const {id} = req.params;
  
  let paymentStatus = req.body.paymentStatus
  let { profitId, profit, modal, belanjaTambahan, totalKeuntunganSebelumnya, totalModalSebelumnya, totalBelanjaSebelumnya } = req.body
  
  if ( paymentStatus === 'Belum Lunas') {
    console.log('masuk ke Belum Lunas')
    
    profit = profit.replace(new RegExp('\\'+(1111).toLocaleString().replace(/1/g,''),'g'),'');
    totalKeuntunganSebelumnya = totalKeuntunganSebelumnya.replace(new RegExp('\\'+(1111).toLocaleString().replace(/1/g,''),'g'),'');
    totalProfitAmount = parseInt(profit) + parseInt(totalKeuntunganSebelumnya)
    
    modal = modal.replace(new RegExp('\\'+(1111).toLocaleString().replace(/1/g,''),'g'),'');
    totalModalSebelumnya = totalModalSebelumnya.replace(new RegExp('\\'+(1111).toLocaleString().replace(/1/g,''),'g'),'');
    totalModalAmount = parseInt(modal) + parseInt(totalModalSebelumnya)

    belanjaTambahan = belanjaTambahan.replace(new RegExp('\\'+(1111).toLocaleString().replace(/1/g,''),'g'),'');
    totalBelanjaSebelumnya = totalBelanjaSebelumnya.replace(new RegExp('\\'+(1111).toLocaleString().replace(/1/g,''),'g'),'');
    totalBelanjaTambahanAmount = parseInt(belanjaTambahan) + parseInt(totalBelanjaSebelumnya)

    if (!profitId) {
      console.log('masuk ke !profitId')
      await new Profit({profitAmount: totalProfitAmount, modalAmount: totalModalAmount, belanjaTambahanAmount: totalBelanjaTambahanAmount}).save((err) => {
        if (err) return console.error(err);
      })
      Invoice.updateOne({"_id":id}, {paymentStatus: 'Lunas'}, (err, result) => {
        if (err) return console.error(err);
        return res.status(201).send('Update Successful')
      });
    }

    if (profitId) {
      console.log('masuk ke profitId')
      await Profit.updateOne({"_id":profitId},{profitAmount: totalProfitAmount, modalAmount: totalModalAmount, belanjaTambahanAmount: totalBelanjaTambahanAmount},(err, result) => {
        if(err) return console.error(err);
      })
      Invoice.updateOne({"_id":id}, {paymentStatus: 'Lunas'}, (err, result) => {
        if (err) return console.error(err);
        return res.status(201).send('Update Successful')
      });
    }
  }

  if ( paymentStatus === 'Lunas') {
    
    profit = profit.replace(new RegExp('\\'+(1111).toLocaleString().replace(/1/g,''),'g'),'');
    totalKeuntunganSebelumnya = totalKeuntunganSebelumnya.replace(new RegExp('\\'+(1111).toLocaleString().replace(/1/g,''),'g'),'');
    totalProfitAmount = parseInt(totalKeuntunganSebelumnya) - parseInt(profit) 
    
    modal = modal.replace(new RegExp('\\'+(1111).toLocaleString().replace(/1/g,''),'g'),'');
    totalModalSebelumnya = totalModalSebelumnya.replace(new RegExp('\\'+(1111).toLocaleString().replace(/1/g,''),'g'),'');
    totalModalAmount = parseInt(totalModalSebelumnya) - parseInt(modal)
    
    belanjaTambahan = belanjaTambahan.replace(new RegExp('\\'+(1111).toLocaleString().replace(/1/g,''),'g'),'');
    totalBelanjaSebelumnya = totalBelanjaSebelumnya.replace(new RegExp('\\'+(1111).toLocaleString().replace(/1/g,''),'g'),'');
    totalBelanjaTambahanAmount = parseInt(totalBelanjaSebelumnya) - parseInt(belanjaTambahan)

    await Profit.updateOne({"_id":profitId},{profitAmount: totalProfitAmount, modalAmount: totalModalAmount, belanjaTambahanAmount: totalBelanjaTambahanAmount},(err, result) => {
      if(err) return console.error(err);
    })
    Invoice.updateOne({"_id":id}, {paymentStatus: 'Belum Lunas'}, (err, result) => {
      if (err) return console.error(err);
      return res.status(201).send('Update Successful')
    });
  }

}