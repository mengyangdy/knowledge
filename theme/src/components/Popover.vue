<template>
  <div class="theme-blog-popover" v-show="show" data-pagefind-ignore="all">
    <div class="header">
      <div class="title-wrapper">
        <el-icon size="20px">
          <Flag/>
        </el-icon>
        <span class="title">{{ popoverProps?.title }}</span>
      </div>
      <el-icon @click="show = false" class="close-icon" size="20px">
        <CircleCloseFilled/>
      </el-icon>
    </div>
    <div class="body content" v-if="bodyContent.length">
      <PopoverValue v-for="(ee,vv) in bodyContent" :key="vv" :item="ee">
        {{ ee.type !== 'image' ? vv.content : '' }}
      </PopoverValue>
      <hr v-if="footerContent.length"/>
    </div>
    <div class="footer content">
      <PopoverValue v-for="(ee,vv) in footerContent" :key="vv" :item="ee">
        {{ ee.type !== 'image' ? ee.content : '' }}
      </PopoverValue>
    </div>
  </div>
  <div class="theme-blog-popover-close" v-show="!show && (popoverProps?.reopen ?? true) && popoverProps?.title"
       @click="show=true">
    <el-icon size="20px">
      <Flag/>
    </el-icon>
  </div>
</template>

<script setup lang="ts">
import {ElIcon, ELButton} from "element-plus";
import {Flog, CircleCloseFilled} from '@element-plus/icons-vue'
import {computed, onMounted, ref, h} from "vue";
import type {BlogPopover} from "../composables/config";
import {parseStringStyle} from '@vue/shared'
import {useBlogConfig} from "../composables/config/blog";


const {popover: popoverProps} = useBlogConfig()
const show = ref(false)
const bodyContent = computed(() => {
  return popoverProps?.body || []
})
const footerContent = computed(() => {
  return popoverProps?.footer || []
})

const PopoverValue =(props:{key:number;item:BlogPopover.Value},{slots}:any)=>{
  const {key,item}=props
  if () {

  }
}

  onMounted(() => {
    if (!popoverProps?.title) return
    const storageKey = 'theme-blog-popover'
    const oldValue = localStorage.getItem(storageKey)
    const newValue = JSON.stringify(popoverProps)
    localStorage.setItem(storageKey, newValue)

    if (Number(popoverProps?.duration ?? '') >= 0) {
      show.value = true
      if (popoverProps?.duration) {
        setTimeout(() => {
          show.value = false
        }, popoverProps?.duration)
      }
    }
    if (oldValue !== newValue && popoverProps?.duration === -1) {
      show.value = true
    }
  })
</script>

<style scoped>

</style>