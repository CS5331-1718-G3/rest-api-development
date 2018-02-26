<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style lang="scss">
@import '~bulma/sass/utilities/_all';

// Customise Bulma variables here.
// e.g. $menu-item-color: $grey;

@import '~bulma/bulma.sass';

html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
