<template>
  <div class="blog-search" v-if="openSearch" data-pagefind-ignore="all">
    <div class="nav-search-btn-wait" @click="searchModal=true">
      <svg width="14" height="14" viewBox="0 0 20 20">
        <path
          d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
          stroke="currentColor"
          fill="none"
          fill-rule="evenodd"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </svg>
      <span v-if="!isMinimized" class="search-tip">
        {{searchConfig.btnPlaceholder || '搜索'}}
      </span>
      <span v-if="!isMinimized" class="metaKey">
        {{metaKey}} K
      </span>
    </div>
    <Command.Dialog :visible="searchModal" theme="algolia">
      <template #header>

      </template>
      <template #body>

      </template>
      <template #footer v-if="searchResult.length">

      </template>
    </Command.Dialog>
  </div>
</template>

<script setup>

</script>

<style scoped lang="scss">

</style>