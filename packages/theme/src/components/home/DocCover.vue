<template>
  <img v-if="cover && !hiddenCover" class="blog-doc-cover" :src="realCover" alt="">
</template>

<script setup lang="ts">
import {useData} from "vitepress";
import {computed} from "vue";
import {useBlogConfig,useCurrentArticle} from "@dy/vitepress-theme";

const {frontmatter}=useData()
const cover=computed(()=>frontmatter.value.cover)
const currentArticle=useCurrentArticle()
const realCover=computed<string>(()=>import.meta.env.DEV?cover.value:currentArticle.value?.meta?.cover)

const {article}=useBlogConfig()
const hiddenCover=computed(()=>frontmatter.value?.hiddenCover ?? article?.hiddenCover ?? false)
</script>

<style scoped lang="scss">
img.blog-doc-cover {
  width: 100%;
  object-fit: cover;
  max-height: none;
  margin-top: 20px;
}
</style>