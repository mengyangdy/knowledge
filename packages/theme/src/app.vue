<template>
  <Layout>
    <template #layout-top>
      <slot name="layout-top" />
      <!--<Alert />-->
      <Popover/>
    </template>
    <template #doc-before>
      <slot name="doc-before" />
      <ClientOnly>
        <ArticleAnalyze />
        <!--图片预览-->
        <!--<ImagePreview />-->
      </ClientOnly>
    </template>
    <template #nav-bar-content-before>
      <slot name="nav-bar-content-before" />
    </template>
    <!--自定义首页-->
    <template v-if="isBlogTheme" #home-hero-before>
      <slot name="home-hero-before" />
      <div class="home">
        <HomeHeaderAvatar />
        <div class="header-banner">
          <HomeBanner />
        </div>
        <div class="content-wrapper">
          <div class="blog-list-wrapper">
            <List />
          </div>
          <div class="blog-info-wrapper">
            <HomeInfo />
          </div>
        </div>
      </div>
    </template>
    <template v-if="isBlogTheme" #sidebar-nav-after>
      <slot name="sidebar-nav-after" />
      <Sidebar />
    </template>
    <template #doc-after>
      <slot name="doc-after" />
      <ClientOnly>
        <BackToTop />
        <Comment />
      </ClientOnly>
    </template>
    <template #layout-bottom>
      <Footer v-if="layout === 'home'" />
      <slot name="layout-bottom" />
    </template>
    <!-- 透传默认主题的其它插槽 -->
    <!-- navbar -->
    <template #nav-bar-title-before>
      <slot name="nav-bar-title-before" />
    </template>
    <template #nav-bar-title-after>
      <slot name="nav-bar-title-after" />
    </template>
    <template #nav-bar-content-after>
      <slot name="nav-bar-content-after" />
    </template>
    <template #nav-screen-content-before>
      <slot name="nav-screen-content-before" />
    </template>
    <template #nav-screen-content-after>
      <slot name="nav-screen-content-after" />
    </template>

    <!-- sidebar -->
    <template #sidebar-nav-before>
      <slot name="sidebar-nav-before" />
    </template>

    <!-- content -->
    <template #page-top>
      <slot name="page-top" />
    </template>
    <template #page-bottom>
      <slot name="page-bottom" />
    </template>

    <template #not-found>
      <slot name="not-found" />
    </template>
    <template #home-hero-info>
      <slot name="home-hero-info" />
    </template>
    <template #home-hero-image>
      <slot name="home-hero-image" />
    </template>
    <template #home-hero-after>
      <slot name="home-hero-after" />
    </template>
    <template #home-features-before>
      <slot name="home-features-before" />
    </template>
    <template #home-features-after>
      <slot name="home-features-after" />
    </template>

    <template #doc-footer-before>
      <slot name="doc-footer-before" />
    </template>

    <template #doc-top>
      <slot name="doc-top" />
    </template>
    <template #doc-bottom>
      <slot name="doc-bottom" />
    </template>

    <template #aside-top>
      <slot name="aside-top" />
    </template>
    <template #aside-bottom>
      <slot name="aside-bottom" />
    </template>
    <template #aside-outline-before>
      <slot name="aside-outline-before" />
    </template>
    <template #aside-outline-after>
      <slot name="aside-outline-after" />
    </template>
    <template #aside-ads-before>
      <slot name="aside-ads-before" />
    </template>
    <template #aside-ads-after>
      <slot name="aside-ads-after" />
    </template>
  </Layout>
</template>

<script setup lang="ts">
import Theme from 'vitepress/theme'
import {useData} from "vitepress";
import {computed} from "vue";
import {useBlogThemeMode} from "./shared";

// import Alert from "./components/prompt/Alert.vue";
import Popover from "./components/prompt/Popover.vue";
import ArticleAnalyze from "./components/detail/ArticleAnalyze.vue";
// import ImagePreview from "./components/common/ImagePreview.vue";
import HomeHeaderAvatar from "./components/home/HomeHeaderAvatar.vue";
import HomeBanner from "./components/home/HomeBanner.vue";
import List from "./components/home/List.vue";
import HomeInfo from "./components/home/HomeInfo.vue";
import Sidebar from "./components/detail/Sidebar.vue";
import BackToTop from "./components/common/BackToTop.vue";
import Comment from "./components/common/Comment.vue";
import Footer from './components/home/Footer.vue'

const {frontmatter}=useData()
const layout=computed(()=>frontmatter.value.layout)
const isBlogTheme=useBlogThemeMode()
const {Layout}=Theme
</script>

<style scoped lang="scss">
.home{
  margin: 0 auto;
  padding: 20px;
  max-width: 1200px;
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
    //position: sticky;
    //top: 100px;
  }

}
@media screen and (min-width: 960px) {
  .home{
    padding-top: var(--vp-nav-height);
  }
}
@media screen and (max-width: 959px) {
  .blog-info-wrapper{
    margin-left: 16px;
    //position: sticky;
    //top: 40px;
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