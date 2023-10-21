<template>
  <img
    v-if="cover && !hiddenCover"
    class="blog-doc-cover"
    :src="cover"
  />
</template>

<script setup lang="ts">
import { useData } from 'vitepress'
import { computed } from 'vue'
import { useBlogConfig } from '../composables/config/blog'

const { frontmatter } = useData()
const cover = computed(() => frontmatter.value.cover)
const { article } = useBlogConfig()
const hiddenCover = computed(() => frontmatter.value?.hiddenCover ?? article?.hiddenCover ?? false)
</script>

<style scoped lang="scss">
img.blog-doc-cover.blog-doc-cover.blog-doc-cover {
  width: 100%;
  object-fit: cover;
  max-height: none;
  margin-top: 20px;
}
</style>
