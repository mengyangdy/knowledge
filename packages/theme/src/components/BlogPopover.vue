<template>
  <div v-show="show" class="theme-blog-popover" data-pagefind-ignore="all">
    <div class="header">
      <div class="title-wrapper">
        <img src="https://api.iconify.design/icon-park-solid:volume-notice.svg" alt="">
        <span class="title">{{ popoverProps?.title }}</span>
      </div>
      <div>
        <img src="https://api.iconify.design/material-symbols:close-rounded.svg" alt="">
      </div>
    </div>
    <div v-if="bodyContent.length" class="body content">
      <PopoverValue v-for="(v,index) in bodyContent" :key="index" :item="v">
        {{v.type !== 'image' ?v.content:''}}
      </PopoverValue>
      <hr v-if="footerContent.length">
    </div>
    <div class="footer content">
      <PopoverValue v-for="(v,index) in footerContent" :key="index" :item="v">
        {{v.type !== 'image' ? v.content:''}}
      </PopoverValue>
    </div>
    <div class="theme-blog-popover-close" v-show="!show && (popoverProps?.reopen ?? true) && popoverProps?.title" @click="show=true">

    </div>
  </div>
</template>

<script setup lang="ts">
import {computed,ref,h,onMounted} from "vue";
import {NIcon} from 'naive-ui'
import {useBlogConfig} from "../shared/blog";

const {popover:popoverProps}=useBlogConfig()
const show=ref(false)
const bodyContent=computed(()=>{
  return popoverProps?.body || []
})
</script>


<style scoped>

</style>