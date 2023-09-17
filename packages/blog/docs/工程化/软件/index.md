---
title: windows下使用Oh My Posh美化终端
tag:
  - window
  - Oh My Posh
  - 终端
  - Terminal
date: 2023-08-25
cover: https://s2.loli.net/2023/08/26/DRX6Bw5iSKotAuJ.jpg
---

# windows下使用Oh My Posh美化终端

## 1. 安装Windows Terminal

win11默认已经安装了终端，如果没有安装的话到Microsoft store搜索'Windows Terminal'即可

## 2. 安装Oh My Posh

打开终端(默认使用PowerShell)并输入以下命令安装Oh My Posh:

```bash
winget install JanDeDobbeleer.OhMyPosh -s winget
```

这个命令会安装：

- oh-my-posh:windows可执行文件
- themes:最新的oh my posh主题

## 3. 安装字体

平时我们使用的字体是没有问题的，但是oh my posh的一些主题图标icon就会显示不出来，因为我们的字体是不支持的，所以我们需要安装支持图标的字体。

大家可以打开这个网址直接下载:[Meslo LGM NF](https://github.com/ryanoasis/nerd-fonts/releases/download/v3.0.2/Meslo.zip)这个字体，这也是官方推荐的字体。
下载完后解压缩，然后选择为所有用户安装。

## 4. 修改终端和vscode字体

当打开终端的时候，使用快捷键`ctrl+shift+,`打开终端的配置文件，在以下位置添加`font.face`属性：

```json
{
  "profiles": {
    "defaults": {
      "font": {
        "face": "MesloLGM Nerd Font"
      }
    }
  }
}
```

vscode设置中搜索`terminal.integrated.fontFamily`,将值更新为`MesloLGM Nerd Font`

```json
"terminal.integrated.fontFamily": "MesloLGM Nerd Font"
```

## 5 PowerShell 阻止运行本地脚本

使用管理员打开PowerShell,输入`set-executionpolicy remotesigned`,执行策略更改选择`A`全是即可。

## 6. 配置shell使用Oh My Posh

编辑PowerShell的配置脚本文件，将Oh My Posh添加进去。

在终端中输入一下命令使用记事本打开配置文件`notepad $PROFILE`

如果弹出系统找不到指定的路径，则是因为配置文件还没有创建出来。

请先创建配置文件：

```bash
New-Item -Path $PROFILE -Type File -Force
```

然后再重复上一次的`notepad $PROFILE`来添加配置

```bash
oh-my-posh init pwsh | Invoke-Expression
```

添加后，重新加载配置文件让我们的修改生效。到了这异步，默认主题就已经出现在终端上了。

## 7. 自定义主题

如果不喜欢默认的主题的话，可以查找更多的主题来使用，首先我们前往官网主题页面查看所有的主题：[theme](https://ohmyposh.dev/docs/themes)和显示的效果，看看使用哪一个主题，复制其主题名字。其次我们第一步安装的使用已经把主题都安装到本地了，地址为：`C:\Users\dylan\AppData\Local\Programs\oh-my-posh\themes`

我们再次打开PowerShell的配置文件，将下面的写入到文件中保存，刷新即可看到我们自定义的主题了。

```bash
oh-my-posh init pwsh --config 'C:/Users/dylan/AppData/Local/Programs/oh-my-posh/themes/emodipt-extend.omp.json' | Invoke-Expression
```
