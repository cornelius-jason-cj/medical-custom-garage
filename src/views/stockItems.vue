<template>
<div>
<TheNavbar/>
  <v-data-table
    :headers="headers"
    :items="spareparts"
    :search="search"
    sort-by="barcode"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Stock Items</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >New Item</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field v-model="editedItem.barcode" label="Barcode"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-text-field v-model="editedItem.itemName" label="Item Name"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.purchasePrice" label="Harga Beli"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.sellingPrice" label="Harga Jual"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.quantity" label="Qty"></v-text-field>
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
      </v-toolbar>
    </template>
    <template v-slot:item.quantity="{ item }">
      <v-chip :color="getColor(item.quantity)" dark>{{ item.quantity }}</v-chip>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <p class="error" v-if="error">{{ error }}</p>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>
</div>
</template>

<script>

import TheNavbar from '@/components/TheNavbar'
import axios from 'axios'

  export default {
    components: {
      TheNavbar,
    },
    data: () => ({
      dialog: false,
      headers: [
        {
          text: 'Barcode',
          align: 'start',
          sortable: false,
          value: 'barcode',
        },
        { text: 'Item Name', value: 'itemName' },
        { text: 'Harga Beli', value: 'purchasePrice' },
        { text: 'Harga Jual', value: 'sellingPrice' },
        { text: 'Harga Untung', value: 'profitPrice' },
        { text: 'Qty', value: 'quantity' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      spareparts: [],
      error:'',
      search:'',
      editedIndex: -1,
      editedItem: {
        barcode: '',
        itemName: '',
        purchasePrice: 0,
        sellingPrice: 0,
        quantity: 0,
      },
      defaultItem: {
        barcode: '',
        itemName: '',
        purchasePrice: 0,
        sellingPrice: 0,
        quantity: 0,
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },
    created () {
      this.initialize()
    },
    methods: {
      initialize () {
          axios.get('http://localhost:5000/api/items')
          .then(res => {
            this.spareparts = res.data
          })
      },
      getColor (quantity) {
        if (quantity > 500 ) return 'green'
        else if (quantity > 100 ) return 'orange'
        else return 'red' 
      }, 
      editItem (item) {
        this.editedIndex = this.spareparts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        const id = item._id
        confirm('Are you sure you want to delete this item?')
        axios.delete(`http://localhost:5000/api/items/${id}`)
        this.initialize()
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
        if (this.editedIndex > -1) {
          Object.assign(this.spareparts[this.editedIndex], this.editedItem)
          const id = this.editedItem._id
          axios.put(`http://localhost:5000/api/items/${id}`, {
            barcode: this.editedItem.barcode,
            itemName: this.editedItem.itemName,
            purchasePrice: this.editedItem.purchasePrice,
            sellingPrice: this.editedItem.sellingPrice,
            quantity: this.editedItem.quantity
          })
        } else {
          axios.post('http://localhost:5000/api/items', {
            barcode: this.editedItem.barcode,
            itemName: this.editedItem.itemName,
            purchasePrice: this.editedItem.purchasePrice,
            sellingPrice: this.editedItem.sellingPrice,
            quantity: this.editedItem.quantity
          })
        }
        this.close()
      },
    },
  }
</script>