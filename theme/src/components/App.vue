<template>
  <Layout>
    <template #layout-top>
      <Alert />
    </template>
  </Layout>
</template>

<script setup lang="ts" name="App">
import Theme from 'vitepress/theme'
import Alert from "./Alert.vue";

const {Layout} = Theme
</script>

<script>

</script>