<template>
  <ul data-pagefind-igbore="all">
    <li v-for="item in currentWikiData" :key="item.route">
      <ListItem :route="item.route"
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
      <NPagination v-if="wikiList.length >= pageSize" v-model:page="currentPage" :item-count="filterData.length" show-quick-jumper @update:page="handleUpdatePageNum">
        <template #goto>
          跳转至
        </template>
      </NPagination>
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
import ListItem from "./ListItem.vue";

const {theme,frontmatter}=useData<Theme.Config>()
const globalAuthor=computed(()=>theme.value.blog?.author || '')
const docs=useArticles()
const activeTag=useActiveTag()
const activeTagLabel = computed(() => activeTag.value.label)

const wikiList=computed(()=>{
  const topList=docs.value.filter(v=>!v.meta.hidden && !!v.meta.top)
  topList.sort((a,b)=>{
    const aTop=a?.meta?.top
    const bTop=b?.meta.top
    return Number(aTop) -Number(bTop)
  })
  const data=docs.value.filter(v=>v.meta.date && v.meta.title && !v.meta.top && !v.meta.hidden)
  data.sort((a,b)=>+new Date(b.meta.date) - +new Date(a.meta.date))
  return topList.concat(data)
})

const filterData=computed(()=>{
  if (!activeTagLabel.value) return wikiList.value

  return wikiList.value.filter(v=>v.meta?.tag?.includes(activeTagLabel.value))
})

const {home}=useBlogConfig()
const pageSize=computed(()=>frontmatter.value.blog?.pageSize || home?.pageSize || 10)
const currentPage=useCurrentPageNum()
const currentWikiData=computed(()=>{
  const startIndex=(currentPage.value -1) * pageSize.value
  const endIndex=startIndex+pageSize.value
  return filterData.value.slice(startIndex,endIndex)
})

const router=useRouter()
const location=useBrowserLocation()
const queryPageNumKey='pageNum'
function handleUpdatePageNum(current:number){
  if (currentPage.value === current) return
  currentPage.value=current
  const {searchParams}=new URL(window.location.href!)
  searchParams.delete(queryPageNumKey)
  searchParams.append(queryPageNumKey,String(current))
  router.go(`${location.value.origin}${router.route.path}?${searchParams.toString()}`)
}

watch(location,()=>{
  if (location.value.href){
    const {searchParams}=new URL(location.value.href)
    if (searchParams.has(queryPageNumKey)){
      currentPage.value=Number(searchParams.get(queryPageNumKey))
    }else{
      currentPage.value=1
    }
  }
},{
  immediate:true
})
</script>

<style scoped lang="scss">
.pagination-wrapper{
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>