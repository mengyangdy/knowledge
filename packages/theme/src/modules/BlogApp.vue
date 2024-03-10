<template>
  <Layout>
    <template #layout-top>
      <slot name="layout-top" />
    </template>
    <template #doc-before>

    </template>
    <template #nav-bar-content-before>

    </template>
    <template #home-hero-before>

    </template>
    <template #sidebar-nav-after>

    </template>
    <template #doc-after>

    </template>
    <template #layout-bottom>

    </template>
  </Layout>
</template>

<script setup lang="ts" name="BlogApp">
import Theme from 'vitepress/theme'
import {useData} from "vitepress";
import {computed} from "vue";

const {frontmatter}=useData()
const layout=computed(()=>frontmatter.value.layout)
const isBlogTheme=useBlogThemeMode()
const {Layout}=Theme
</script>

<style scoped>

</style>