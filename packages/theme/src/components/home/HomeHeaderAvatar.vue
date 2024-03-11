<template>
  <div class="blog-home-header-avatar" v-show="inMiniScreen && !alwaysHide">
    <img :src="withBase(logo)" alt="avatar">
    <span>logo</span>
  </div>
</template>

<script setup lang="ts">
import {withBase,useData} from "vitepress";
import {computed} from "vue";
import {useWindowSize} from "@vueuse/core";
import {useBlogConfig} from "../../shared";

const {width}=useWindowSize()
const inMiniScreen=computed(()=>width.value<=767)
const {home}=useBlogConfig()
const {frontmatter,site}=useData()
console.log("=>(HomeHeaderAvatar.vue:17) site", site);
console.log("=>(HomeHeaderAvatar.vue:17) frontmatter", frontmatter);
const logo=computed(()=>
  frontmatter.value.logo
  ?? frontmatter.value?.blog?.logo
  ?? home?.logo
  ?? site.value.themeConfig.logo
)
console.log("=>(HomeHeaderAvatar.vue:20) logo", logo);


const alwaysHide=computed(()=>frontmatter.value.blog?.minScreenAvatar === false)
</script>

<style scoped lang="scss">
.blog-home-header-avatar{
  padding-top: 40px;
  display: flex;
  align-items: center;
  img{
    display: block;
    margin: 0 auto;
    width: 130px;
    height: 130px;
    border-radius: 50%;
    background-color: transparent;
    border: 5px solid rgba(var(--bg-gradient-home));
    box-sizing: border-box;
  }
  img:hover{
    transform: rotate(666turn);
    transition-duration: 59s;
    transition-timing-function: cubic-bezier(.34,0,.84,1);
  }
}
</style>