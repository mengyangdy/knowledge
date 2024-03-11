<template>
  <ul data-pagefind-igbore="all">
    <li v-for="item in currentWikiData" :key="item.route">
      <Item :route="item.route"
            :title="item.meta.title"
            :description="item.meta.description"
            :description-h-t-m-l="item.meta.descriptionHTML"
            :date="item.meta.date"
            :tag="item.meta.tag"
            :cover="item.meta.cover"
            :author="item.meta.author || globalAuthor"
            :pin="item.meta.top" />
    </li>
  </ul>
  <ClientOnly>
    <div class="pagination-wrapper">
      <NPagination v-if="wikiList.length >= pageSize" v-model:page="page" :page-count="100" />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import {computed,watch} from "vue";
import {NPagination} from 'naive-ui'
import {useData,useRouter} from "vitepress";
import {useBrowserLocation} from '@vueuse/core'
import {useActiveTag,useArticles,useBlogConfig,useCurrentPageNum} from "../../shared";
import type {Theme} from '../../typings'

const {theme,frontmatter}=useData<Theme.Config>()
const globalAuthor=computed(()=>thme.value.blog?.author || '')
const docs=useArticles()
const activeTag=useActiveTag()
const activeTagLabel = computed(() => activeTag.value.label)
</script>

<style scoped>

</style>