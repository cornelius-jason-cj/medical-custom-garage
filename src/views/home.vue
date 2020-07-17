<template>
<div>
<TheNavbar/>
  <v-container fluid>
    <v-row
    >
      <v-col cols = "4">
        <v-card
          color = #B3E5FC
          height = 140px
        >
          <v-card-title
          v-if=" this.profitList.length === 0"
          >
            0
          </v-card-title>
          <v-card-title
          v-else
          >
            {{ formatPrice(this.profitList[0].profitAmount) }}
          </v-card-title>
          <v-card-text>Profit</v-card-text>
        </v-card>
      </v-col>

      <v-col cols = "4">
        <v-card 
          color = #B3E5FC
          height = 140px
        >
          <v-card-title
          v-if=" this.profitList.length === 0"
          >
            0
          </v-card-title>
          <v-card-title
          v-else
          >
          {{ formatPrice(this.profitList[0].modalAmount) }}</v-card-title>
          <v-card-text>Modal</v-card-text>
        </v-card>
      </v-col>

      <v-col cols = "4">
        <v-card 
          color = #B3E5FC
          height = 140px
        >
        <v-card-title>
          {{ formatPrice(this.$store.state.totalBelanja) }}</v-card-title>
        <v-card-text>Belanja Tambahan</v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-card>
    <v-card-title>
      <v-text-field
      v-model="search"
      append-icon="mdi-magnify"
      label="Search"
      single-line
      hide-details
      >
      </v-text-field>
      <v-spacer></v-spacer>
      <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >Belanja Barang</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Belanja Barang</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field v-model="editedItem.itemName" label="Nama Barang"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field v-model="editedItem.purchasePrice" label="Harga Beli"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </v-card-title>

    <v-row>
      <v-col cols="8" sm="8" md="8">
        <v-data-table
          :headers="headersInvoice"
          :items="invoiceList"
          :search="search"
          class="elevation-1"
        >

        <template v-slot:item.total="{ item }">
            {{ formatPrice(item.total) }}
        </template>

        <template v-slot:item.paymentStatus="{ item }">
          <v-chip
            :color="getColor(item.paymentStatus)" dark
            @click="editPayment(item)"
          >
            {{ item.paymentStatus }}
          </v-chip>
        </template>
        </v-data-table>
      </v-col>

      <v-col cols="4" sm="4" md="4">
        <v-data-table
          :headers="headersBelanja"
          :items="belanjaList"
          :search="search"
          class="elevation-1"
        >
        
        <template v-slot:item.purchasePrice="{ item }">
          {{ formatPrice(item.purchasePrice) }}
        </template>

        </v-data-table>
      </v-col>
    </v-row>

  </v-card>
</div>
</template>

<script>

import TheNavbar from '@/components/TheNavbar'
import axios from 'axios'
  export default {
    components: {
    TheNavbar
    },
    data () {
      return {
        dialog: false,
        search: '',
        headersInvoice: [
          {
            text: 'Invoice Number',
            align: 'start',
            sortable: false,
            value: 'invoiceNumber',
          },
          { text: 'Total', value: 'total' },
          { text: 'Status', value: 'paymentStatus' }
        ],
        headersBelanja: [
          {
            text: 'Nama Barang',
            align: 'start',
            sortable: false,
            value: 'itemName',
          },
          { text: 'Harga', value: 'purchasePrice' },
        ],
        totalBelanjaTambahanAmount: 0,
        paymentStatus: 'Belum Lunas',
        profitId:'',
        editedIndex: -1,
        editedItem: {
          itemName: '',
          purchasePrice: 0,
        },
        defaultItem: {
          itemName: '',
          purchasePrice: 0,
        },
      }
    },
    computed: {
      invoiceList () {
        return this.$store.state.invoiceList
      },
      profitList () {
        return this.$store.state.profitList
      },
      belanjaList () {
        return this.$store.state.belanjaList
      },
    },
    created () {
      this.initialize()
    },
    methods: {
      initialize () {
        this.$store.dispatch('fetchInvoiceList')
        this.$store.dispatch('fetchProfitList')
        this.$store.dispatch('fetchBelanjaList')
      },
      formatPrice(value) {
        if (value === null || value === 0) {
          return '0'
        }else if (value < 1000){
          return 'Rp ' + value
        }else {
          return 'Rp ' + value.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        }
      },
      getColor (paymentStatus) {
        if (paymentStatus === 'Lunas') return 'green'
        else return 'red'
      },
      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
        this.initialize()
      },
      save () {
        axios.post('http://localhost:5000/api/belanja', {
          itemName: this.editedItem.itemName,
          purchasePrice: this.editedItem.purchasePrice
        })
        this.close()
      },
      editPayment (item) {
        this.editedIndex = this.invoiceList.indexOf(item)
        this.editedItem = Object.assign({}, item)
        const id = this.editedItem._id
        const newPaymentStatus = this.editedItem.paymentStatus
        const profitId = this.profitList.length === 0 ? null : this.profitList[0]._id
        const totalKeuntunganSebelumnya = this.profitList.length === 0 ? '0' : this.profitList[0].profitAmount
        const totalModalSebelumnya = this.profitList.length === 0 ? '0' : this.profitList[0].modalAmount

        if (confirm(`Apakah anda ingin mengganti status menjadi ${newPaymentStatus}?`)){
          axios.put(`http://localhost:5000/api/invoice/${id}`, {
            profitId,
            profit : this.editedItem.keuntungan,
            modal: this.editedItem.modal,
            totalKeuntunganSebelumnya,
            totalModalSebelumnya,
            paymentStatus: newPaymentStatus
          })
        }
        setTimeout(() => {
          this.initialize()
        }, 1000)
      }
    }
  }
</script>

<style scoped>

.v-card__title {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    font-size: 2em;
    font-weight: 500;
    letter-spacing: 0.009375rem;
    line-height: normal;
    word-break: break-all;
    height: 110px;
}


</style>