<template>
  <div v-if="show" id="giscus-comment" ref="commentEl" class="comment" data-pagefind-ignore="all">
    <ElAffix :class="{hidden:commentIsVisible}" class="comment-btn" target="main" position="bottom" :offset="40">
      <ElButton plain :icon="Comment" type="primary" @click="handleScrollToComment">
        评论
      </ElButton>
    </ElAffix>
    <component
      :is="commentComponent" v-if="showComment"
      src="https://giscus.app/client.js"
      :data-repo="commentConfig.repo"
      :data-repo-id="commentConfig.repoId"
      :data-category="commentConfig.category"
      :data-category-id="commentConfig.categoryId"
      :data-mapping="commentConfig.mapping || 'pathname'"
      data-reactions-enabled="1"
      data-emit-metadata="0"
      :data-input-position="commentConfig.inputPosition || 'top'"
      :data-theme="isDark ? 'dark' : 'light'"
      :data-lang="commentConfig.lang || 'zh-CN'"
      crossorigin="anonymous"
      :data-loading="commentConfig.loading || 'eager'"
      async/>
  </div>
</template>

<script setup lang="ts">


import {useData, useRoute} from "vitepress";
import {computed, ref, watch} from "vue";
import {useDark, useElementVisibility} from "@vueuse/core";
import {ElAffix, ElButton} from "element-plus";
import {Comment} from '@element-plus/icons-vue'
import {useGiscusConfig} from "../composables/config/blog";
import type {Theme} from "../composables/config";

const {frontmatter} = useData()
const commentEl = ref(null)
const commentIsVisible = useElementVisibility(commentEl)
const commentComponent='script'

function handleScrollToComment() {
  document.querySelector('#giscus-comment')?.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  })
}

const giscusConfig = useGiscusConfig()

const commentConfig = computed<Partial<Theme.GiscusConfig>>(() => {
  if (!giscusConfig) {
    return {}
  }
  return giscusConfig
})

const show = computed(() => {
  if (frontmatter.value.comment === false) {
    return frontmatter.value.comment
  }
  if (!giscusConfig) {
    return giscusConfig
  }
  return (
    giscusConfig.repo &&
    giscusConfig.repoId &&
    giscusConfig.category &&
    giscusConfig.categoryId
  )
})

const isDark = useDark({
  storageKey: 'vitepress-theme-appearance'
})

const route = useRoute()
const showComment = ref(true)

watch(
  () => route.path,
  () => {
    showComment.value = false
    setTimeout(() => {
      showComment.value = true
    }, 200)
  },
  {
    immediate: true
  }
)
</script>

<style scoped lang="scss">
.comment {
  width: 100%;
  text-align: center;
  padding: 40px 0;
}

.hidden {
  opacity: 0;
  pointer-events: none;
}

.comment-btn {
  :deep(.el-affix--fixed) {
    text-align: right;

    .el-button {
      position: relative;
      right: -100px;
    }
  }
}

@media screen and (max-width: 1200px) {
  .comment-btn {
    :deep(.el-affix--fixed) {
      opacity: 0.7;

      .el-button {
        position: static;
      }
    }
  }
}
</style>