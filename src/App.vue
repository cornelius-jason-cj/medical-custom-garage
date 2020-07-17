<template>
  <div id="app">
    <v-app id="inspire">
    <v-main>
      <router-view/>
    </v-main>
    <!-- <Footer/> -->
    </v-app>
  </div>
</template>

<script>

export default {
  name: 'App',
  props: {
    source: String
  },
  data: () => ({
    drawer: null,
  }),
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
