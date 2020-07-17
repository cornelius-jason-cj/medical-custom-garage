<template>
  <v-data-table
    :headers="headers"
    :items="spareparts"
    sort-by="barcode"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Stock Items</v-toolbar-title>
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
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>
</template>

<script>
  export default {
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
        { text: 'Qty', value: 'quantity' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      spareparts: [],
      editedIndex: -1,
      editedItem: {
        barcode: '',
        itemName: '',
        purchasePrice: '0',
        sellingPrice: '0',
        quantity: '0',
      },
      defaultItem: {
        barcode: '',
        itemName: '',
        purchasePrice: '0',
        sellingPrice: '0',
        quantity: '0',
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
        this.spareparts = [
          {
            barcode:'1029384751',
            itemName: 'Spare Part A',
            purchasePrice: 45000,
            sellingPrice: 75000,
            quantity: 24,
          },
          {
            barcode:'1029384752',
            itemName: 'Spare Part B',
            purchasePrice: 15000,
            sellingPrice: 20000,
            quantity: 34,
          },
                    {
            barcode:'1029384753',
            itemName: 'Spare Part C',
            purchasePrice: 90000,
            sellingPrice: 120000,
            quantity: 14,
          },
          {
            barcode:'1029384754',
            itemName: 'Spare Part D',
            purchasePrice: 150000,
            sellingPrice: 210000,
            quantity: 104,
          },
          {
            barcode:'1029384755',
            itemName: 'Spare Part E',
            purchasePrice: 6700,
            sellingPrice: 9000,
            quantity: 240,
          },
          {
            barcode:'1029384756',
            itemName: 'Spare Part F',
            purchasePrice: 64000,
            sellingPrice: 95000,
            quantity: 77,
          },
                    {
            barcode:'1029384757',
            itemName: 'Spare Part G',
            purchasePrice: 32000,
            sellingPrice: 45000,
            quantity: 18,
          },
          {
            barcode:'1029384758',
            itemName: 'Spare Part H',
            purchasePrice: 15900,
            sellingPrice: 22000,
            quantity: 39,
          },
                    {
            barcode:'1029384759',
            itemName: 'Spare Part I',
            purchasePrice: 19000,
            sellingPrice: 25000,
            quantity: 220,
          },
          {
            barcode:'1029384760',
            itemName: 'Spare Part J',
            purchasePrice: 99500,
            sellingPrice: 135000,
            quantity: 88,
          },
                    {
            barcode:'1029384761',
            itemName: 'Spare Part K',
            purchasePrice: 11000,
            sellingPrice: 15000,
            quantity: 100,
          },
          {
            barcode:'1029384762',
            itemName: 'Spare Part L',
            purchasePrice: 78100,
            sellingPrice: 90000,
            quantity: 99,
          },
                    {
            barcode:'1029384763',
            itemName: 'Spare Part M',
            purchasePrice: 15000,
            sellingPrice: 25000,
            quantity: 55,
          },
          {
            barcode:'1029384764',
            itemName: 'Spare Part N',
            purchasePrice: 65000,
            sellingPrice: 130000,
            quantity: 124,
          },
        ]
      },

      editItem (item) {
        this.editedIndex = this.spareparts.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        const index = this.spareparts.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.spareparts.splice(index, 1)
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.spareparts[this.editedIndex], this.editedItem)
        } else {
          this.spareparts.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>