<template>
  <Layout>
    <template #layout-top>
      <MyAlert />
      <MyPopover />
    </template>
    <template #doc-before>
      <ClientOnly>
        <MyArticleAnalyze />
      </ClientOnly>
      <!--图片预览-->
      <MyImagePreview />
    </template>
    <!--自定义搜索，替代Algolia-->
    <template #nav-bar-content-before>
      <MySearch />
    </template>
  </Layout>
</template>

<script setup lang="ts" name="App">
import Theme from 'vitepress/theme'
import MyAlert from "./MyAlert.vue";
import MyPopover from "./MyPopover.vue";
import MyArticleAnalyze from "./MyArticleAnalyze.vue";
import MyImagePreview from "./MyImagePreview.vue";

const {Layout} = Theme
</script>

<script>

</script>