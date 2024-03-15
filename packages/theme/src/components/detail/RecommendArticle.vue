<template>
  <div
    v-if="_recommend !== false && (recommendList.length || emptyText)"
    class="recommend"
    :class="{ card: sidebarStyle === 'card' }"
    data-pagefind-ignore="all"
  >
    <!-- 头部 -->
    <div class="card-header">
      <span
        v-if="title"
        class="title"
        v-html="title"
      />
      <ElButton
        v-if="showChangeBtn"
        size="small"
        type="primary"
        text
        @click="changePage"
      >
        {{ nextText }}
      </ElButton>
    </div>
    <!-- 文章列表 -->
    <ol
      v-if="currentWikiData.length"
      class="recommend-container"
    >
      <li
        v-for="(v, idx) in currentWikiData"
        :key="v.route"
      >
        <!-- 序号 -->
        <i class="num">{{ startIdx + idx + 1 }}</i>
        <!-- 简介 -->
        <div class="des">
          <!-- title -->
          <a
            class="title"
            :class="{
              current: isCurrentDoc(v.route),
            }"
            :href="withBase(v.route)"
          >
            {{ v.meta.title }}
          </a>
          <!-- 描述信息 -->
          <div class="suffix">
            <!-- 日期 -->
            <span class="tag">{{ formatShowDate(v.meta.date) }}</span>
          </div>
        </div>
      </li>
    </ol>
    <div
      v-else
      class="empty-text"
    >
      {{ emptyText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, withBase } from 'vitepress'
import { ElButton, ElLink } from 'element-plus'
import { formatShowDate } from '../../utils'
import { useArticles, useBlogConfig } from '../../shared'
import { recommendSVG } from '../../constants/svg'
import type { Theme } from '../../typings'

const { recommend: _recommend } = useBlogConfig()

const sidebarStyle = computed(() =>
  _recommend && _recommend?.style ? _recommend.style : 'sidebar'
)

const recommendPadding = computed(() =>
  sidebarStyle.value === 'card' ? '10px' : '0px'
)
const recommend = computed(() =>
  _recommend === false ? undefined : _recommend
)

const title = computed(
  () =>
    recommend.value?.title ??
    `<span class="svg-icon">${recommendSVG}</span>` + '相关文章'
)
const pageSize = computed(() => recommend.value?.pageSize || 9)
const nextText = computed(() => recommend.value?.nextText || '换一组')
const emptyText = computed(() => recommend.value?.empty ?? '暂无相关文章')

const docs = useArticles()

const route = useRoute()

function getRecommendCategory(page?: Theme.PageData): string[] {
  if (!page) return []
  const { meta } = page
  if (Array.isArray(meta.recommend)) {
    return meta.recommend.filter((v) => typeof v === 'string') as string[]
  }
  if (typeof meta.recommend === 'string') {
    return [meta.recommend]
  }
  return []
}

function getRecommendValue(page?: Theme.PageData) {
  return Array.isArray(page?.meta?.recommend)
    ? page.meta.recommend[page.meta.recommend.length - 1]
    : page?.meta.recommend
}

function hasIntersection(arr1: any[], arr2: any[]) {
  return arr1.some((item) => arr2.includes(item))
}

const recommendList = computed(() => {
  // 中文支持
  const paths = decodeURIComponent(route.path).split('/')
  const currentPage = docs.value.find((v) => isCurrentDoc(v.route))
  const currentRecommendCategory = getRecommendCategory(currentPage)
  const origin = docs.value
    .map((v) => ({ ...v, route: withBase(v.route) }))
    .filter((v) => {
      // 筛选出类别有交集的
      if (currentRecommendCategory.length) {
        return hasIntersection(
          currentRecommendCategory,
          getRecommendCategory(v)
        )
      }
      // 如果没有自定义归类则保持原逻辑
      // 过滤出公共路由前缀
      // 限制为同路由前缀
      return (
        v.route.split('/').length === paths.length &&
        v.route.startsWith(paths.slice(0, paths.length - 1).join('/'))
      )
    })
    // 过滤出带标题的
    .filter((v) => !!v.meta.title)
    // 过滤掉自己
    .filter(
      (v) =>
        (recommend.value?.showSelf ?? true) ||
        v.route !== decodeURIComponent(route.path).replace(/.html$/, '')
    )
    // 过滤掉不需要展示的
    .filter((v) => v.meta.recommend !== false)
    // 自定义过滤
    .filter((v) => recommend.value?.filter?.(v) ?? true)

  const topList = origin.filter((v) => {
    const value = getRecommendValue(v)
    return typeof value === 'number'
  })
  topList.sort(
    (a, b) => Number(getRecommendValue(a)) - Number(getRecommendValue(b))
  )

  const normalList = origin.filter(
    (v) => typeof getRecommendValue(v) !== 'number'
  )

  // 排序
  const sortMode = recommend.value?.sort ?? 'date'
  // 默认时间排序
  let compareFn = (a: any, b: any) =>
    +new Date(b.meta.date) - +new Date(a.meta.date)
  // 文件名排序
  if (sortMode === 'filename') {
    compareFn = (a: any, b: any) => {
      const aName = a.route.split('/').pop()
      const bName = b.route.split('/').pop()
      return aName.localeCompare(bName)
    }
  }
  // 自定义排序
  if (typeof sortMode === 'function') {
    compareFn = sortMode
  }
  normalList.sort(compareFn)

  return topList.concat(normalList)
})

function isCurrentDoc(value: string) {
  const path = decodeURIComponent(route.path).replace(/.html$/, '')
  return [value, value.replace(/index$/, '')].includes(path)
}

const currentPage = ref(1)
function changePage() {
  const newIdx =
    currentPage.value % Math.ceil(recommendList.value.length / pageSize.value)
  currentPage.value = newIdx + 1
  return newIdx + 1
}
// 当前页开始的序号
const startIdx = computed(() => (currentPage.value - 1) * pageSize.value)

const currentWikiData = computed(() => {
  const startIdx = (currentPage.value - 1) * pageSize.value
  const endIdx = startIdx + pageSize.value
  return recommendList.value.slice(startIdx, endIdx)
})
console.log('🚀 ~ currentWikiData ~ currentWikiData:', currentWikiData)

const showChangeBtn = computed(() => {
  return recommendList.value.length > pageSize.value
})

onMounted(() => {
  // 更新当前页，确保访问页面在列表中
  const currentPageIndex = recommendList.value.findIndex((v) =>
    isCurrentDoc(v.route)
  )
  currentPage.value = Math.floor(currentPageIndex / pageSize.value) + 1
})
</script>

<style lang="scss" scoped>
.card {
  position: relative;
  margin: 0 auto 10px;
  padding: 10px;
  width: 100%;
  overflow: hidden;
  border-radius: 0.25rem;
  box-shadow: var(--box-shadow);
  box-sizing: border-box;
  transition: all 0.3s;
  background-color: rgba(var(--bg-gradient));
  display: flex;

  &:hover {
    box-shadow: var(--box-shadow-hover);
  }
}

.recommend {
  flex-direction: column;
  padding: v-bind(recommendPadding);
}

.recommend-container {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0 10px 0 0px;
  width: 100%;

  li {
    display: flex;

    .num {
      display: block;
      font-size: 14px;
      color: var(--description-font-color);
      font-weight: 600;
      margin: 6px 8px 10px 0;
      width: 22px;
      height: 18px;
      line-height: 18px;
      text-align: center;
    }

    .des {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .title {
      font-size: 14px;
      color: var(--vp-c-text-1);
      word-break: break-all;
      white-space: break-spaces;

      &.current {
        color: var(--vp-c-brand-1);
      }
    }

    .suffix {
      font-size: 12px;
      color: var(--vp-c-text-2);
    }
  }
}

.card-header {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  .title {
    font-size: 14px;
    display: flex;
    align-items: center;
  }
}

.empty-text {
  padding: 6px;
  font-size: 14px;
  text-align: center;
}
</style>
