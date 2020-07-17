<template>
<div>
  <v-navigation-drawer
    v-model="drawer"
    app
    color="blue"
    dark
  >
    <v-list dense>
      <router-link to="/home">
        <v-list-item link>
            <v-list-item-action>
              <img src="../assets/home_white.png">
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
      </router-link>
      
      <router-link to="/invoice">
        <v-list-item link>
        <v-list-item-action>
          <img src="../assets/receipt_white.png">
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>Invoice</v-list-item-title>
        </v-list-item-content>
        </v-list-item>
      </router-link>
      
      <router-link to="/stockItems">
        <v-list-item link>
          <v-list-item-action>
            <img src="../assets/storage_white.png">
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Stock Items</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </router-link>
    </v-list>
  </v-navigation-drawer>  
  
  <v-app-bar
    app
    color="blue"
    dark
  >
    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    <!-- <v-toolbar-title>Welcome {{user.username}}</v-toolbar-title> -->
    <v-toolbar-title>Custom Medical Apps</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn color="white" text @click.prevent="logout">Log Out</v-btn>
  </v-app-bar> 
</div>
</template>

<script>
// import {mapGetters} from 'vuex'
export default {
  name: 'App',
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
  }),
  methods: {
    logout () {
      this.$store.dispatch('auth/logout')
      .then(() =>  this.$router.push('/'))
      .catch((err) => console.log(err))
    }
  }
};
</script>

<style scoped>
.v-list-item {
  padding: 20px 0;
  font-size: 22px;
  margin: 0 0 0 10px;
}

.v-list-item--dense .v-list-item__title, .v-list-item--dense .v-list-item__subtitle, .v-list--dense .v-list-item .v-list-item__title, .v-list--dense .v-list-item .v-list-item__subtitle {
  font-size: 16px;
  line-height: 1rem;
}

.v-application a {
  text-decoration: none;
}

</style>