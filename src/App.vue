<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  background: #262626;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
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
.container-fluid {
  padding-left: 15px;
  padding-right: 15px;
}
.row {
  display: flex;
  margin-left: -15px;
  margin-right: -15px;
  margin-bottom: 15px;
}
.col {
  padding-left: 15px;
  padding-right: 15px;
}

@for $i from 1 through 12 {
  .col-#{$i} {
    width: $i / 12 * 100%;
    @extend .col;
  }
}

@media screen and (max-width: 1024px) {
  .row {
    display: block;
  }
  .col-4 {
    width: 100%;
    margin-bottom: 15px;
  }
  .col-6 {
    width: 100%;
    margin-bottom: 15px;
  }
}
</style>
