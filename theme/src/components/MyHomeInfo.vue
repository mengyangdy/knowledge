<template>
  <div class="blog-info">
  <!-- 统计数据，日后支持，点击筛选出左侧的数据 -->
    <MyStat/>
  <!-- 置顶文章 -->
    <MyHotArticle />
  <!-- 友链 -->
    <MyFriend />
  <!-- 标签 -->
    <MyHomeTag />
  </div>
</template>

<script setup lang="ts">
import MyStat from "./MyStat.vue";
import MyHotArticle from "./MyHotArticle.vue";
import MyFriend from "./MyFriend.vue";
import MyHomeTag from "./MyHomeTag.vue";
</script>

<style scoped lang="scss">
.blog-info{
  display: flex;
  flex-direction: column;
  min-width: 240px;
  position: relative;
  box-sizing: border-box;
}
@media screen and (min-width: 767px) {
  .blog-info{
    max-width: 300px;
  }
}
</style>