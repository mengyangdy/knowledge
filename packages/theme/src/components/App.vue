<template>
  <Layout>
    <template #layout-top>
      <MyAlert/>
      <MyPopover/>
    </template>
    <template #doc-before>
      <ClientOnly>
        <MyArticleAnalyze/>
      </ClientOnly>
      <!--图片预览-->
      <MyImagePreview/>
    </template>
    <!--自定义搜索，替代Algolia-->
    <template #nav-bar-content-before>
      <!--<MySearch/>-->
    </template>
    <!--自定义首页-->
    <template #home-hero-before v-if="isBlogTheme">
      <div class="home">
        <div class="header-banner">
          <MyHomeBanner />
        </div>
        <div class="content-wrapper">
          <div class="blog-list-wrapper">
            <MyList />
          </div>
          <div class="blog-info-wrapper">
            <MyHomeInfo />
          </div>
        </div>
      </div>
    </template>
    <!--侧边栏-->
    <template #sidebar-nav-after v-if="isBlogTheme">
      <MySidebar />
    </template>
    <!--评论-->
    <template #doc-after>
      <MyComment />
    </template>
  </Layout>
</template>

<script setup lang="ts" name="App">
import Theme from 'vitepress/theme'
import MyAlert from "./MyAlert.vue";
import MyPopover from "./MyPopover.vue";
import MyArticleAnalyze from "./MyArticleAnalyze.vue";
import MyImagePreview from "./MyImagePreview.vue";
import MySearch from "./MySearch.vue";
import MyHomeBanner from "./MyHomeBanner.vue";
import MyList from "./MyList.vue";
import MyHomeInfo from "./MyHomeInfo.vue";
import MyComment from "./MyComment.vue";
import MySidebar from "./MySidebar.vue";
import {useBlogThemeMode} from "../composables/config/blog";

const {Layout} = Theme
const isBlogTheme=useBlogThemeMode()
</script>

<style scoped lang="scss">
.home{
  margin: 0 auto;
  padding: 20px;
  max-width: 1126px;
}
@media screen and (min-width: 960px) {
  .home{
    padding-top: var(--vp-nav-height);
  }
}

.header-banner{
  width: 100%;
  padding: 60px 0;
}
.content-wrapper{
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.blog-list-wrapper{
  width: 100%;
}

.blog-info-wrapper{
  margin-left: 16px;
  position: sticky;
  top: 100px;
}

@media screen and (max-width: 959px) {
  .blog-info-wrapper{
    margin-left: 16px;
    position: sticky;
    top: 40px;
  }
}

@media screen and (max-width: 767px) {
  .content-wrapper{
    flex-wrap: wrap;
  }
  .blog-info-wrapper{
    margin: 20px 0;
    width: 100%;
  }
}
</style>