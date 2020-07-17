<template>
  <v-data-table
    :headers="headers"
    :items="spareparts"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>Assignment</v-toolbar-title>
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
            >Add New</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field v-model="editedItem.customerName" label="Nama Customer"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field v-model="editedItem.customerDP" label="Jumlah DP"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="12" md="12">
                    <v-select
                      v-model="editedItem.notes"
                      :items="listSpareparts"
                      label="List Spare Part yang di pakai"
                      multiple
                      chips
                      hint=""
                      persistent-hint
                    ></v-select>
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
          text: 'Nama Customer',
          align: 'start',
          sortable: false,
          value: 'customerName',
        },
        { text: 'DP', value: 'customerDP' },
        { text: 'Notes', value: 'notes' },
        { text: 'Actions', value: 'actions', sortable: false },
      ],
      listSpareparts:[
        'Spare Part A','Spare Part B','Spare Part C','Spare Part D','Spare Part E',
        'Spare Part F','Spare Part G','Spare Part H','Spare Part I','Spare Part J',
        'Spare Part K','Spare Part L','Spare Part M','Spare Part N'
        ],
      spareparts: [],
      editedIndex: -1,
      editedItem: {
        customerName: '',
        customerDP: '',
        notes: [],
      },
      defaultItem: {
        customerName: '',
        customerDP: '',
        notes: [],
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
            customerName:'Cornelius',
            customerDP: '2000000',
            notes: ['Spare Part A','Spare Part C','Spare Part D'],
          },
          {
            customerName:'Jason',
            customerDP: '500000',
            notes: ['Spare Part B','Spare Part G'],
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