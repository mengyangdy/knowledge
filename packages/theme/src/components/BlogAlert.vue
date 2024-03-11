<template>
  <div v-if="show" class="global-alert" data-pagefind-ignore="all">
    <NAlert :title="alertProps?.title" :type="alertProps?.type" :show-icon="alertProps?.showIcon" >
      <div v-if="alertProps?.html" v-html="alertProps?.html"></div>
    </NAlert>
  </div>
</template>

<script setup lang="ts">
import {onMounted,ref} from "vue";
import {NAlert} from 'naive-ui'
import {useBlogConfig} from "../shared/blog";

const {alert:alertProps}=useBlogConfig()
console.log("=>(BlogAlert.vue:14) alertProps", alertProps);
const show=ref(false)
const storageKey='theme-blog-alert'
const closeFlag=`${storageKey}-close`
onMounted(()=>{
  const oldValue=localStorage.getItem(storageKey)
  const newValue=JSON.stringify(alertProps)
  localStorage.setItem(storageKey,newValue)

  if (Number(alertProps?.duration)>=0){
    show.value=true
    if (alertProps?.duration){
      setTimeout(()=>{
        show.value=false
      },alertProps?.duration)
    }
    return
  }

  if (oldValue!==newValue && alertProps?.duration === -1){
    show.value=true
    localStorage.removeItem(closeFlag)
    return
  }

  if (oldValue === newValue && alertProps?.duration === -1 && !localStorage.getItem(closeFlag)){
    show.value =true
  }

})

function handleClose(){
  show.value=false
  if (alertProps?.duration === -1){
    localStorage.setItem(closeFlag,`${+new Date()}`)
  }
}

</script>


<style scoped>

</style>