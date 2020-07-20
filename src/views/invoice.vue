<template>
<div>
  <TheNavbar/>
  <div id="invoice-box">
    <v-form id="invoice-form-print">
      <template>
        <div>
          <h3>FAKTUR PENJUALAN - MEDICAL CUSTOM GARAGE</h3>
          <p>Jl. H. Mansyur No 42, Gondrong, Kec. Cipondoh, Tangerang</p>
          <p>Telp: 0822-6198-6823</p>    
        </div>
      </template>

      <template>
        <div class="invoice-information">
          <v-row>
            <v-col cols = "4">
              <v-text-field
                v-model="invoice_information.invoiceNumber"
                label="Invoice Number">
              </v-text-field>
            </v-col>
            <v-col cols = "4"></v-col>
            <v-col cols = "4">
              <v-text-field
                v-model="invoice_information.operator"
                label="Operator">
              </v-text-field>
            </v-col>
            
          </v-row>

          <v-row>
            <v-col cols = "4">
              <v-text-field
                v-model="invoice_information.customerName"
                label="Customer Name">
              </v-text-field>
            </v-col>
            <v-col cols = "4"></v-col>
            <v-col cols = "4">
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="date"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="date"
                    labeeventl="Select Date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    ></v-text-field>
                </template>
                <v-date-picker v-model="date" no-title>
                  <v-spacer></v-spacer>
                  <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                  <v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols = "4">
              <v-text-field
                v-model="invoice_information.customerAddress"
                label="Address">
              </v-text-field>
              <v-text-field
                v-model="invoice_information.customerPhone"
                label="Phone">
              </v-text-field>
            </v-col>
            <v-col cols= "4"></v-col>
            <v-col cols = "4">
              <h3>Total Invoice <h1>{{ formatPrice(invoice_total) }}</h1></h3>
            </v-col>
          </v-row>
        </div>
      </template>

      <v-divider
        class="mx-4"
        inset
        vertical
      ></v-divider>

      <template>
        <div class="invoice-data">
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th></th>
                  <th>Barcode</th>
                  <th>Item Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(invoice_product, k) in invoice_products"
                  :key="k"
                  class="invoice-data-table"
                >
                  <td scope="row">
                    <v-icon @click="deleteRow(k,invoice_product)">mdi-delete</v-icon>
                  </td>

                  <td>
                    <v-text-field
                    v-model="invoice_product.barcode"
                    readonly
                    >{{ invoice_product.barcode }}</v-text-field>
                  </td>

                  <td>
                    <v-text-field
                    v-if="invoice_product.downPayment === true"
                    v-model="invoice_product.itemName"
                    readonly
                    >{{ invoice_product.itemName }}</v-text-field>

                    <v-text-field
                    v-else-if="invoice_product.jasa === true"
                    v-model="invoice_product.itemName"
                    readonly
                    >{{ invoice_product.itemName }}</v-text-field>

                    <v-select
                    v-else
                    :items="itemName"
                    placeholder="Item Name"
                    v-model="invoice_product.itemName"
                    @change="autoFillOtherField(invoice_product)"
                    />
                  </td>

                  <td>
                    <v-text-field
                      v-if="invoice_product.downPayment === true"
                      placeholder="Down Payment Amount"
                      class="form-control text-right"
                      v-model="invoice_product.downPaymentAmount" 
                      @change="calculateLineTotal(invoice_product)"
                    ></v-text-field>

                    <v-text-field
                      v-else-if="invoice_product.jasa === true"
                      placeholder="Jasa Amount"
                      class="form-control text-right"
                      v-model="invoice_product.jasaAmount" 
                      @change="calculateLineTotal(invoice_product)"
                    ></v-text-field>

                    <v-text-field
                      v-else
                      readonly
                      placeholder="Autofill"
                      class="form-control text-right"
                      v-model="invoice_product.sellingPrice" 
                      @change="calculateLineTotal(invoice_product)"
                    ></v-text-field>

                  </td>

                  <td>
                    <v-text-field
                      v-if="invoice_product.downPayment === true || invoice_product.jasa === true"
                      readonly
                      class="form-control text-right"
                      type="number"
                      max="1"
                      v-model="invoice_product.quantity" 
                      @change="calculateLineTotal(invoice_product)"
                    ></v-text-field>
                    <v-text-field
                      v-else
                      class="form-control text-right"
                      type="number"
                      min="1"
                      v-model="invoice_product.quantity" 
                      @change="calculateLineTotal(invoice_product)"
                      placeholder="input Quantity"
                    ></v-text-field>
                  </td>

                  <!-- <td>
                    <input label="Input Quantity" class="form-control text-right" type="number" min="0" step="1" v-model="invoice_product.quantity" @change="calculateLineTotal(invoice_product)">
                  </td> -->

                  <td>
                    <input readonly class="form-control text-right" type="number" step="1" v-model="invoice_product.line_total">
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>
      </template>
    </v-form>
    
    <template>
      <div class="invoice-button">
        <v-card
          class="d-flex justify-space-between mb-6"
          flat
          tile
        >
          <v-btn
            color="primary"
            @click="addNewRow"
            outlined
            tile
          >
            add New Row
          </v-btn>

          <v-btn
            color="primary"
            @click="addDP"
            outlined
            tile
          >
            add DP
          </v-btn>

          <v-btn
            color="primary"
            @click="addJasa"
            outlined
            tile
          >
            add Jasa
          </v-btn>

          <v-btn
            color="primary"
            @click="printInvoice()"
          >
            Print this Page
          </v-btn> 
        </v-card>
      </div>
    </template>
  </div>
</div>
</template>

<script>
import TheNavbar from '@/components/TheNavbar'
import axios from 'axios'

  export default {
    components: {
      TheNavbar,
    },
    data () {
      return {
        date: new Date().toISOString().substr(0,10),
        menu: false,
        invoice_subtotal:0,
        invoice_total:0,
        invoice_tax:0,
        invoice_modal:0,
        itemName:[],
        stockItems:[],
        downPaymentAmount:0,
        jasaAmount:0,
        invoice_information:{
          customerName:'',
          customerAddress:'',
          customerPhone:'',
          invoiceNumber:'',
          operator:'',
        },
        invoice_products: [{
          barcode: '',
          itemName: '',
          sellingPrice: '',
          purchasePrice: '',
          quantity:'',
          line_total: 0,
          line_modal:0,
          downPayment: '',
          jasa:'',
          downPaymentAmount:'',
          jasaAmount:'',
        }],
      }
    },
    created () {
      this.initialize()
    },
    methods: {
      initialize () {
        axios.get('/api/items')
        .then(res => {
          this.stockItems = res.data

          this.itemName = res.data.map(({itemName}) => itemName)
        })
      },
      formatPrice(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      },
      addNewRow() {
        this.invoice_products.push({
          barcode: '',
          itemName: '',
          sellingPrice: '',
          quantity:'',
          line_total: 0,
          downPayment: false,
          jasa: false,
        })
      },
      addDP() {
        this.invoice_products.push({
          barcode: '00000000',
          itemName: 'Down Payment',
          sellingPrice: '',
          quantity:1,
          line_total: 0,
          downPayment: true,
          jasa:false
        })
      },
      addJasa() {
        this.invoice_products.push({
          barcode: '00000001',
          itemName: 'Jasa',
          sellingPrice: '',
          quantity:1,
          line_total: 0,
          downPayment:false,
          jasa: true
        })
      },
      deleteRow (index, invoice_product) {
        var idx = this.invoice_products.indexOf(invoice_product);
        if (idx > -1) {
          this.invoice_products.splice(idx, 1);
        }
        this.caculateTotal ();
      },
      autoFillOtherField(invoice_product) {
        let data = this.stockItems.filter((data) => data.itemName === invoice_product.itemName)
        invoice_product.barcode = data[0].barcode
        invoice_product.sellingPrice = data[0].sellingPrice
        invoice_product.purchasePrice = data[0].purchasePrice
      },
      calculateLineTotal(invoice_product) {
        let total, modal

        if(invoice_product.downPaymentAmount) {
          total = parseInt(invoice_product.downPaymentAmount) * parseInt(invoice_product.quantity);
          total = -Math.abs(total)
          this.downPaymentAmount = total
        } 
        else if(invoice_product.jasaAmount) {
          total = parseInt(invoice_product.jasaAmount) * parseInt(invoice_product.quantity);
          total = Math.abs(total)
          this.jasaAmount = total
        }
        else {
          invoice_product.sellingPrice = invoice_product.sellingPrice.replace(new RegExp('\\'+(1111).toLocaleString().replace(/1/g,''),'g'),'');
          invoice_product.purchasePrice = invoice_product.purchasePrice.replace(new RegExp('\\'+(1111).toLocaleString().replace(/1/g,''),'g'),'');
          total = parseInt(invoice_product.sellingPrice) * parseInt(invoice_product.quantity);
          modal = parseInt(invoice_product.purchasePrice) * parseInt(invoice_product.quantity);
        }
        if(!isNaN(total)) {
          invoice_product.line_total = total
          invoice_product.line_modal = modal
        }

        this.caculateTotal();
      },
      caculateTotal() {
        let subtotal, total, subModal, modal;
      
        subtotal = this.invoice_products.reduce((sum, product) => {
          let lineTotal = product.line_total

          if(lineTotal){
            return sum + lineTotal
            }
        }, 0);

        subModal = this.invoice_products.reduce((sum, product) => {
          let lineModal = product.line_modal

          if(!lineModal){
            return sum + 0
          }else {
            return sum + lineModal
          }
        }, 0);

        this.invoice_subtotal = subtotal
        total = (subtotal * (this.invoice_tax / 100)) + subtotal;
        modal = subModal

        if(!isNaN(total)) {
          this.invoice_total = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          this.invoice_modal = modal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        } else {
          this.invoice_total = '0.00'
        }
      },
      printInvoice(){
        axios.post('/api/invoice', {
          invoiceNumber: this.invoice_information.invoiceNumber,
          customerName: this.invoice_information.customerName,
          customerAddress: this.invoice_information.customerAddress,
          operator: this.invoice_information.operator,
          items: this.invoice_products,
          total: this.invoice_total,
          modal: this.invoice_modal,
          downPaymentAmount: this.downPaymentAmount,
          jasaAmount: this.jasaAmount,
          createdAt: this.date
        })
        let fileName = 'INV'+this.invoice_information.invoiceNumber+'-'+this.invoice_information.customerName+'-'+this.date+'.pdf';
        setTimeout(() => {
          window.open(`http://127.0.0.1:8887/invoiceList/${fileName}`)
          // window.open(`../../server/invoiceList/${fileName}`)
        }, 1000)
      }
    }
  }
</script>


<style scoped>
#invoice-box {
  margin: auto;
  padding: 10px 25px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  color: #555;
}

p {
  padding: 0;
  margin: 0;
}

.invoice-information {
  margin: 20px 0 0 14px;
}

.invoice-information .col {
  padding: 0;
  margin: 0;
}

.invoice-information .v-text-field {
  padding: 0;
  margin: 0;
}

.invoice-button {
  margin: 50px 0 0 0;
}


</style>