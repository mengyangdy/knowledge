---
title: GitKraken最新版的使用
tag:
  - git
  - 软件
date: 2023-09-12
cover: https://s2.loli.net/2023/09/12/OBWvluSgyGxIabk.jpg
---
# GitKraken 最新版的使用

> 最近一直在几个 git 的 gui 工具中试用，发现最后还是 gitkraken 操作简单，非常容易上手

## 安装

官网下载地址：[GitKraken](https://www.gitkraken.com/download)

### Windows 安装

下载安装包后，双击运行，会自动安装到 C 盘并且自动的打开程序。

安装目录在 `C:\Users\{用户名}\AppData\Local\gitkraken` 目录。

### Mac 安装

如果是从官网下载最新的安装包的话，默认后缀为 `.dmg`，下载完直接运行，回提示拖到 `Applications` 中，然后就会在启动台中看到图标。

如果下载的是旧版本，后缀名为 `.zip`，解压完后双击运行，如果是进入了软件的主界面而不是拖放界面，那么需要关闭软件，手动安装包到 `Applications` 中。

## 用户登录

软件在 v>=9.4.0 之后就不再强制要求登录账号，如果我们下载的是高版本打开软件后直接点击 `lets open a repository` 即可开始使用。

输入用户名、邮箱，点击 `Use these for Git commits` 按钮。(这里的用户名和邮箱就是 git 提交的时候用的个人信息)

## 下载工具

下载地址：[百度网盘]( https://pan.baidu.com/s/1L7mkkwj9WJaR-jcCIbFHfg?pwd=7ewn )

此工具原来是在 github 上开源的，现在已经被和谐，原地址为：[github 地址](https://github.com/PMExtra/GitCracken.git%EF%BC%89)

此项目依赖于 NodeJS/Yarn，Node 版本需要>=12

确保软件已经关闭，Mac 平台在底部的 Dack 中也彻底关闭软件

解压工具，进入 GitCracken 目录，在此目录依次运行一下三行命令：

```bash
yarn install 
yarn build
yarn gitcracken patcher # Mac用户可能需要root权限，需要在前面加上sudo
```

![](https://s2.loli.net/2023/09/12/gxKRoctjMT6YV1i.png)

最后输出 `Patching done` 代表着破解成功了。

最后一条命令在破解成功后不可重复执行，除非更换了版本

## 验证

重新打开 Gitkraken, 并且打开一个 git 仓库，激活成功的话会在右下角看到 Pro 标志。

![](https://s2.loli.net/2023/09/12/a8i6VS5GxoARhsH.png)

如果显示 Free 可以尝试删除下用户的缓存目录

- Windows
	- `C:\Users\{用户名}\AppData\Roaming\\.gitkraken`
- Mac
	- `~/.gitkraken`

再次打开软件，如果还没有出现 Pro 的话，那就是工具失效了，只能用旧版本了。

## 屏蔽更新

> 到目前为止最新的版本 9.x.x 都是可以使用的，所以也不需要禁用更新，直接使用即可。如果自动更新也，再次运行 `yarn gitcracken patcher` 命令即可。
> Windows 平台自动更新并不会卸载旧版本，所以更新后的旧版本会一直存在于电脑中占用空间，更新后手动删除一下，目录为 `C:\Users\{用户名}\AppData\Local\gitkraken\app-xxx`

Windows 平台可以直接删除安装路径下的 Update.exe 程序，但是后续升级就只能去官网下载最新版本了。

通用的方案是：

将下面的内容添加到系统的 `hosts` 文件中：

```bash
0.0.0.0 release.gitkraken.com
```

原理是让自动更新程序无法下载最新的包，但不影响从官网页面下载安装包。因为我通过抓包发现软件内部请求 release.gitkraken.com 时会重定向到 release.axocdn.com，而官网下载链接直接用的后者。

Hosts 文件路径：
- Windows 平台：`C:\Windows\System32\drivers\etc\hosts`
- Mac/Linux 平台：`/etc/hosts`

## 卸载

Windows 卸载残留
- `C:\Users\{用户名}\AppData\Roaming\\.gitkraken` （**注**：这里存放账号信息、打开过的项目、用户设置等，如果你只是升级版本，可以不用删除）
- `C:\Users\{用户名}\AppData\Roaming\GitKraken`
- `C:\Users\{用户名}\AppData\Local\gitkraken` （**注**：这是默认安装位置，如果安装完成后桌面没有快捷方式，可从这里启动）

Mac 卸载残留

```bash
rm -r ~/.gitkraken
```

## 查询历史版本

[GitKraken Client v7.x 更新记录](https://help.gitkraken.com/gitkraken-client/7x/)

[GitKraken Client v8.x 更新记录](https://help.gitkraken.com/gitkraken-client/8x/)

[GitKraken Client v9.x 更新记录](https://help.gitkraken.com/gitkraken-client/current/)

历史版本下载：

只需将后面的版本号更改一下：

- Linux-deb : [https://release.axocdn.com/linux/GitKraken-v7.7.0.deb](https://release.axocdn.com/linux/GitKraken-v7.7.0.deb)
- Linux-rpm : [https://release.axocdn.com/linux/GitKraken-v7.7.0.rpm](https://release.axocdn.com/linux/GitKraken-v7.7.0.rpm)
- Linux-tar.gz : [https://release.axocdn.com/linux/GitKraken-v7.7.0.tar.gz](https://release.axocdn.com/linux/GitKraken-v7.7.0.tar.gz)
- Win64： [https://release.axocdn.com/win64/GitKrakenSetup-7.7.0.exe](https://release.axocdn.com/win64/GitKrakenSetup-7.7.0.exe)
- Mac (Intel) : [https://release.axocdn.com/darwin/GitKraken-v7.7.0.zip](https://release.axocdn.com/darwin/GitKraken-v7.7.0.zip)
- Mac (Apple Silicon) 从 v 9.0.0 开始支持：[https://release.axocdn.com/darwin-arm64/GitKraken-v9.0.0.zip](https://release.axocdn.com/darwin-arm64/GitKraken-v9.0.0.zip)

## 汉化

下载汉化后的 json：[json地址](https://pan.baidu.com/s/1HOtq3TvOsiyTBRNPAtcYtw?pwd=barp)

将下载好的 `strings.json` 替换到 GitKraken 语言目录下的 `strings.json`
- Windows: `%程序安装目录%\gitkraken\app-x.x.x\resources\app\src\strings.json` (x.x.x 是你的 GitKraken 版本)
- Mac: `/Applications/GitKraken.app/Contents/Resources/app.asar.unpacked/src/strings.json`
- Linux: `/usr/share/gitkraken/resources/app.asar.unpacked/src` (感谢@lyydhy 10.31补充 Gitkraken是deepin 通过deb 安装的)
- Linux: `/opt/gitkraken/resources/app.asar.unpacked/src/strings.json` (Arch Linux AUR 安装的路径在这)