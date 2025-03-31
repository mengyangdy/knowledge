---
title: uniapp上传图片到后端
description: 详细解释了前端开发中代理配置的各个参数含义，包括 target、changeOrigin、ws、secure 等关键配置项的作用，以及如何通过路径匹配和重写来处理 API 请求转发。适合需要配置开发环境跨域的开发者参考
tags: [uniapp]
date: 2025-03-17
---

项目中有一个需求是选择本地图片上传到后端，而在uniapp中上传图片有两种方法，一种是使用uni.uploadFile这个方法,另一种是使用uni.request方法，这两种方法都有自己的缺点：
1. uploadFile这个方法只能使用默认的POST方法，而我的项目中上传的接口使用的是PUT方法
2. request这个方法默认是不能处理formData格式的数据，可以使用一些第三方库来实现

综合考虑还是让后端把方法改为POST使用uploadFile这个方法实现的图片上传