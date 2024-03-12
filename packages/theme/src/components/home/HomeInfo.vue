<template>
  <div class="blog-info" data-pagefind-ignore="all">
    <Overview/>
    <HotArticle/>
    <ClientOnly>
      <FriendLink/>
    </ClientOnly>
    <HomeTags/>
  </div>
</template>

<script setup lang="ts">
import Overview from "./Overview.vue";
import HotArticle from "./HotArticle.vue";
import FriendLink from "./FriendLink.vue";
import HomeTags from "./HomeTags.vue";
</script>

<style scoped lang="scss">
.blog-info {
  display: flex;
  flex-direction: column;
  min-width: 240px;
  position: relative;
  box-sizing: border-box;
}

@media screen and (min-width: 767px) {
  .blog-info {
    width: 300px;
  }
}
</style>