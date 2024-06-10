<template>
  <div
    v-if="_recommend !== false"
    class="sidebar"
    data-pagefind-ignore="all"
  >
    <RecommendArticle />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBlogConfig } from '../../shared'
import RecommendArticle from './RecommendArticle.vue'

const { recommend: _recommend } = useBlogConfig()

const sidebarStyle = computed(() =>
  _recommend && _recommend?.style ? _recommend.style : 'card'
)

const marginTop = computed(() =>
  sidebarStyle.value === 'card' ? '40px' : '0px'
)

const marginTopMini = computed(() =>
  sidebarStyle.value === 'card' ? '60px' : '0px'
)
</script>

<style scoped lang="scss">
.sidebar {
  margin-top: v-bind(marginTop);
}

@media screen and (min-width: 960px) {
  .sidebar {
    margin-top: v-bind(marginTopMini);
  }
}
</style>
