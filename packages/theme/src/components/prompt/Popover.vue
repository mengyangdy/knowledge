<template>
  <div v-show="show" class="theme-blog-popover" data-pagefind-ignore="all">
    <div class="header">
      <div class="title-wrapper">
        <img src="https://api.iconify.design/icon-park-solid:volume-notice.svg" alt="">
        <span class="title">{{ popoverProps?.title }}</span>
      </div>
      <div class="close-wrapper" @click="handleClose">
        <img src="https://api.iconify.design/material-symbols:close-rounded.svg" alt="">
      </div>
    </div>
    <div v-if="bodyContent.length" class="body content">
      <PopoverValue v-for="(v,index) in bodyContent" :key="index" :item="v">
        {{ v.type !== 'image' ? v.content : '' }}
      </PopoverValue>
      <hr v-if="footerContent.length">
    </div>
    <div class="footer content">
      <PopoverValue v-for="(v,index) in footerContent" :key="index" :item="v">
        {{ v.type !== 'image' ? v.content : '' }}
      </PopoverValue>
    </div>
  </div>
  <div class="theme-blog-popover-close" v-show="!show && (popoverProps?.reopen ?? true) && popoverProps?.title"
       @click="show=true">
    <img class="img-icon" src="https://api.iconify.design/akar-icons:chat-dots.svg" alt="">
  </div>
</template>

<script setup lang="ts">
import {BlogPopover} from "../../typings";
import {parseStringStyle} from '@vue/shared'
import {NButton} from 'naive-ui'
import {computed, h, onMounted, ref} from "vue";
import {useBlogConfig} from "../../shared";

const {popover: popoverProps} = useBlogConfig()
const show = ref(false)
const bodyContent = computed(() => {
  return popoverProps?.body || []
})
const footerContent = computed(() => {
  return popoverProps?.footer || []
})

const storageKey = 'theme-blog-popover'
const closeFlag = `${storageKey}-close`

function PopoverValue(props: { key: number; item: BlogPopover.Value }, {slots}: any) {
  const {key, item} = props
  if (item.type === 'title') {
    return h(
      'h4',
      {
        style: parseStringStyle(item.style || '')
      },
      item.content
    )
  }
  if (item.type === 'text') {
    return h(
      'p',
      {
        style: parseStringStyle(item.style || '')
      },
      item.content
    )
  }
  if (item.type === 'image') {
    return h(
      'img',
      {
        src: item.src,
        style: parseStringStyle(item.style || '')
      }
    )
  }
  if (item.type === 'button') {
    return h(
      NButton,
      {
        onClick: () => {
          window.open(item.link, '_self')
        },
        style: parseStringStyle(item.style || ''),
        ...item.props
      },
      slots
    )
  }
  return h(
    'div',
    {
      key
    },
    ''
  )
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

function handleClose() {
  show.value = false
  if (popoverProps?.duration === -1) {
    localStorage.setItem(closeFlag, `${+new Date()}`)
  }
}
</script>


<style scoped lang="scss">
.theme-blog-popover {
  width: 258px;
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 99;
  box-sizing: border-box;
  border: 1px solid var(--vp-c-brand-3);
  border-radius: 6px;
  background-color: rgba(var(--bg-gradient-home));
  box-shadow: var(--box-shadow);

  .header {
    background-color: var(--vp-c-brand-3);
    color: #fff;
    padding: 6px 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .title-wrapper {
      display: flex;
      align-items: center;

      .title {
        font-size: 14px;
        padding-left: 6px;
      }
    }
    .close-wrapper{
      border-radius: 50%;
      background-color: #fff;
      cursor: pointer;
      .close-icon {
        cursor: pointer;
      }
    }


  }

  .body {
    box-sizing: border-box;
    padding: 10px 10px 0;

    hr {
      border: none;
      border-bottom: 1px solid #eaecef;
    }
  }

  .footer {
    box-sizing: border-box;
    padding: 10px;
  }

  .body.content, .footer.content {
    text-align: center;

    h4 {
      text-align: center;
      font-size: 12px;
    }

    p {
      text-align: center;
      padding: 10px 0;
      font-size: 14px;
    }

    img {
      width: 100%;
    }
  }
}

.theme-blog-popover-close {
  cursor: pointer;
  opacity: 0.5;
  position: fixed;
  z-index: 99;
  top: 80px;
  right: 10px;
  background-color: var(--vp-c-brand-3);
  padding: 8px;
  color: #fff;
  font-size: 12px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
}
.img-icon{
  color: #fff;
}
</style>