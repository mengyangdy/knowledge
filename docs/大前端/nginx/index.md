---
title: nginx配置项目后访问403错误
tags:
  - nginx
date: 2023-11-29
cover: https://my-vitepress-blog.sh1a.qingstor.com/202311291525049.jpg
---

# nginx 配置项目后访问403错误

> 在博客项目上传到云服务器上，修改 `nginx` 配置之后，在网站上访问项目却报了 `403` 的错误。找了很久才找到原因，其实在我们前端看来，错误 `403` 的原因是无访问权限，这样的话错误信息就比较明确了。

## 排查步骤

### 第一步查看错误信息

我们可以先看一下 `nginx` 的错误日志，出现错误后应该先查看日志信息。

`nginx` 的日志地址是在 `/var/log/nginx` 目录下：

```txt
2023/11/28 22:41:10 [error] 78117#0: *2 "/code/blog/index.html" is forbidden (13: Permission denied), client: 171.15.106.136, server: _, request: "GET / HTTP/1.1", host: "mengyang.online"
2023/11/28 22:41:10 [error] 78117#0: *2 "/code/blog/index.html" is forbidden (13: Permission denied), client: 171.15.106.136, server: _, request: "GET / HTTP/1.1", host: "mengyang.online"
2023/11/28 22:41:11 [error] 78117#0: *2 "/code/blog/index.html" is forbidden (13: Permission denied), client: 171.15.106.136, server: _, request: "GET / HTTP/1.1", host: "mengyang.online"
```

我们可以看到错误信息是 `Permission denied`，也就是没有权限。

### 第二步查看防火墙和 shlinux

如果是服务器的防火墙和 selinux 没有关闭的时候，我们访问也是会报 `403` 错误的。

我们先看一下防火墙的状态：

```txt
[root@hecs-78624 /]# systemctl status firewalld
○ firewalld.service - firewalld - dynamic firewall daemon
     Loaded: loaded (/usr/lib/systemd/system/firewalld.service; disabled; vendor preset: enabled)
     Active: inactive (dead)
       Docs: man:firewalld(1)
[root@hecs-78624 /]#
```

我们可以看到防火墙是处于关闭的状态的。

我们再来看一下 seliunx 的状态：

```txt
# This file controls the state of SELinux on the system.
# SELINUX= can take one of these three values:
#     enforcing - SELinux security policy is enforced.
#     permissive - SELinux prints warnings instead of enforcing.
#     disabled - No SELinux policy is loaded.
SELINUX=disabled
# SELINUXTYPE= can take one of these three values:
#     targeted - Targeted processes are protected,
#     minimum - Modification of targeted policy. Only selected processes are protected.
#     mls - Multi Level Security protection.
SELINUXTYPE=targeted
```

可以看到 seliunx 也是关闭的状态的。

### 第三步查看文件是否存在

如果我们指定的路径里面并没有存放相关的文件，也是会报错的。

### 第四步启用用户和 nginx 工作用户不一样

为了安全起见，默认我们的 nginx 工作用户一般都不是 root 用户，这是为了防止黑客攻击我们的 nginx 入侵 80 端口后获得 root 权限。

我们来查看一下：

![](https://my-vitepress-blog.sh1a.qingstor.com/202311291542801.png)

我们可以看到 master 进程是由 root 用户常见的，而 worker 进程是由 master 进程创建的，我们去 `nginx` 配置文件里面看下 `nginx` 的工作用户是什么：

![](https://my-vitepress-blog.sh1a.qingstor.com/202311291544714.png)

这样我们就找到原因了：启动 nginx 的是 root 用户，而工作用户是 nginx，两个不一致就会导致了 `403` 错误。我们可以修改 nginx 用户为 root 这样就可以访问网站了。但是这样就会导致 80 端口被入侵后就拥有了 root 权限了。

### 第五步用户没有资源目录的权限

如果不修改 nginx 配置的话我们就需要修改 nginx 用户的资源权限了，我们可以将目录提权一下即可解决 403 的问题：

```bash
[root@salted ~]#  chmod 777 /code
```

这样网站就可以访问了。
