---
title: TailScale部署系列教程 - 安装环境
createTime: 2025/04/14 09:50:41
permalink: /article/vziatlgf/
---
## 前言

我之前已经有了使用 [WireGuard](https://www.wireguard.com/) 和配套服务的经验，但是 WireGuard 要搭建一个中转服务器用于连接朋友的 NAS 实在是弄得头疼，所以在研究之后发现 Tailscale+Derp 的方案会更加简单，也会更加方便，于是便转换到以上的技术栈。

[Tailscale](https://tailscale.com/) 本身为开源工具，但是其控制服务器为闭源实现，其免费用户只能部署至多 32 个设备，并且服务器在国外不方便访问。

基于以上这种情况，我们选择了 [Headscale](https://headscale.net/stable/) 作为控制服务器，并且搭建一个网页作为控制 UI。

## 要准备的工具

我准备了以下这些服务器：

- 一台部署在阿里云日本东京节点的轻量云服务器作为控制节点（至多 20Mbps 上传带宽）
- 一台部署在腾讯云国内上海节点的轻量云锐驰型云服务器作为 Derp 中转节点搭建（至多 200Mbps 带宽）
- 尽量拥有一个自己的域名，如果没有纯IP也可以

## 搭建 Headscale 和 Headscale-UI

对于 Headscale 我没有过多要求，仅有简单的控制和设备认证需求，以及希望带有 ACL 控制功能。因此我们选择了 Headscale-UI 作为轻量的控制网页。

### 安装 Docker 以及 Docker Compose

如果你的服务器上还没有安装[Docker](https://www.docker.com/)及其配套环境，可以遵照以下的步骤进行安装：

#### 服务器在国内

在国内的服务器我们使用中科大镜像进行加速，在终端执行以下的命令：

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo DOWNLOAD_URL=https://mirrors.ustc.edu.cn/docker-ce sh get-docker.sh
```

在安装完成后可以用以下的命令进行检查：

```bash
docker --version
docker compose version
```

如果有正常的输出，则证明已经成功安装。

#### 服务器在国外

在国外的服务器就直接使用官方脚本进行安装即可：

```bash
curl -fsSL https://get.docker.com -o get-docker.sh && chmod +x get-docker.sh && ./get-docker.sh
```

检查方式与国内安装方式相同。

### 安装 Caddy

[Caddy](https://caddyserver.com/)作为 Web 服务器，配置更加简单，同时也能够自动申请 SSL 证书，于是便作为 Nginx 的替代。

安装过程请遵循官方的[手册内容](https://caddyserver.com/docs/install)，本篇文章只展示 Debian/Ubuntu 的安装方式：

请使用以下的命令安装 Caddy：

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

### 安装 Headscale

我们现在当前目录下新建`headscale`文件夹，并且在目录下新建`config`和`data`两个文件夹，之后用于存放 Headscale 产生的数据。

我们在当前目录新建一个`docker-compose.yml`，并在其中键入以下内容：

```yaml
version: '3.5'
services:
  headscale:
    image: headscale/headscale:stable
    container_name: headscale
    volumes: # 挂载本地文件夹，请根据对应用户修改
      - /root/headscale/config:/etc/headscale
      - /root/headscale/data:/var/lib/headscale
    ports:
      - 18080:8080 # Headscale 服务端口
    command: serve
    restart: unless-stopped
  headscale-ui:
    image: ghcr.io/gurucomputing/headscale-ui:latest
    restart: unless-stopped
    container_name: headscale-ui
    ports:
      # - 8443:8443
      - 18081:8080 # Headscale-UI 网页端口
```

之后我们需要获取模板配置文件，并且保存在对应的目录下：

```bash
wget -O ./headscale/config/config.yaml https://raw.githubusercontent.com/juanfont/headscale/refs/heads/main/config-example.yaml
```

完成上面这一步后，我们要对一部分的内容进行自定义修改，具体每项对应内容请直接阅读示例配置文件：

```yaml
server_url: https://hd.example.com:443 # 替换为自己的域名
```

完成这一步以后即可使用`docker compose up -d`将对应容器上线。

### 配置反向代理

我们编辑`/etc/caddy/Caddyfile`，并在其中添加以下内容，并且不要忘记将其中的`hd.example.com`替换成自己的域名：

```json
https://hd.example.com {
	reverse_proxy /web* http://127.0.0.1:18081
	reverse_proxy * http://127.0.0.1:18080
}
```

之后我们通过输入`systemctl restart caddy`重启 Caddy 服务，Caddy 会帮助我们自动申请证书。

让我们访问`hd.example.com/web`进入控制面板。

### 配置访问面板

Headscale-UI 与 Headscale 之间是通过 API Key 进行认证通讯，于是第一步我们先要为 UI 申请一个 API Key：

```bash
docker compose exec headscale headscale apikeys create -e 720d
```

![Headscale UI 管理页面](https://img.goldbro.top/article_tailscale_builder_1.png)

在获得对应的 API Key 后，我们在`Headscale API Key`这里输入，并且点击`Test Server Settings`查看是否认证成功。如果可以，则会出现绿色对钩。

不要忘记检查上方的`Headscale URL`是否为自己的域名，如果不是请记得替换并保存。