---
title: windows11改回完整版右键菜单
tag: 
 - window
 - 右键菜单
date: 2023-08-26
cover: https://s2.loli.net/2023/08/26/NQBqh9YCp27LeJR.jpg
---

# windows11改回完整版右键菜单

## 恢复win10右键菜单

管理员身份打开cmd运行命令：`reg.exe add "HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32" /f /ve`

## 恢复win11右键菜单

管理员身份打开cmd运行命令：`reg.exe delete "HKCU\Software\Classes\CLSID\{86ca1aa0-34aa-4e8b-a509-50c905bae2a2}\InprocServer32" /va /f`

## 重启资源管理器

如果不重启资源管理器则需要重启电脑才能看到效果，运行一下命令：`taskkill /f /im explorer.exe & start explorer.exe`