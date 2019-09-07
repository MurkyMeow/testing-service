<template>
  <div>
    <header>
      <div class="title">Testing system</div>
      <nav>
        <Button>Регистрация</Button>
        <Button>Вход</Button>
      </nav>
    </header>
    <nuxt/>
  </div>
</template>
<style lang="scss">
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #202020;
  margin: 0;
  padding: 0;
  min-height: 100vh;
  background: #c4d4e2;
}
</style>
<style lang="scss" scoped>
header {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  background: #e3f1fe;
  border-bottom: 1px solid rgba(0, 0, 0, .5);
}
.title {
  font-size: 20px;
  font-weight: bold;
}
nav {
  margin-left: auto;
  & button:not(:last-child) {
    margin-right: 10px;
  }
}
</style>
<script lang="ts">
import Vue from 'vue';
import Button from '@/components/button.vue';

export default Vue.extend({
  components: {
    Button,
  },
});
</script>
