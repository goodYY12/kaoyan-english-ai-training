# 考研英一 AI 提分训练平台

> 不只是刷真题，而是训练出题人思维。

这是一个使用 **React + Vite + Tailwind CSS + React Router** 制作的前端学习网站。

第一版包含首页、真题中心、阅读训练、出题人思维、长难句、词汇、翻译、写作和错题本。内容来自本地 JSON，错题保存在当前浏览器的 `localStorage` 中。

当前项目没有后端、数据库、登录、支付或 AI API。

## 技术与部署信息

- 框架：React
- 构建工具：Vite
- 样式：Tailwind CSS
- 路由：React Router
- 安装命令：`npm install`
- 开发命令：`npm run dev`
- 构建命令：`npm run build`
- 预览命令：`npm run preview`
- 构建输出目录：`dist`
- 推荐 Node.js：20.19 或更高版本

## 本地运行

### 1. 打开项目目录

```powershell
cd "C:\Users\dongz\Documents\英一自学网站"
```

### 2. 检查 Node.js 和 npm

```powershell
node --version
npm --version
```

如果提示无法识别命令，请关闭 PowerShell 后重新打开，再执行一次。

### 3. 安装依赖

```powershell
npm install
```

这个命令会根据 `package.json` 下载项目运行所需的软件包。

### 4. 启动本地网站

```powershell
npm run dev
```

终端会显示类似：

```text
http://127.0.0.1:5173/
```

这个地址只属于当前电脑。其他人无法通过你的 `127.0.0.1` 地址访问网站。

停止网站时，在终端按 `Ctrl + C`。

## 打包与预览

### 创建正式构建

```powershell
npm run build
```

构建成功后，正式文件会生成在 `dist` 文件夹中。

### 本地预览正式构建

```powershell
npm run preview
```

请打开终端显示的地址。预览用于检查正式构建结果，不用于公网分享。

### 运行测试

```powershell
npm test
```

当前测试用于验证错题的添加、去重、删除和复习状态。

## 上传到 GitHub

### 1. 安装并检查 Git

```powershell
git --version
```

如果能看到版本号，说明 Git 可以使用。

### 2. 初始化本地仓库

在项目目录中依次执行：

```powershell
git init
git branch -M main
git status
git add .
git status
git commit -m "init project"
```

这些命令分别用于：

1. 把当前文件夹变成 Git 仓库。
2. 将默认分支命名为 `main`。
3. 检查准备上传的文件。
4. 将项目文件加入本次提交。
5. 再次检查，确认没有 `.env`、`node_modules` 或 `dist`。
6. 创建第一条版本记录。

如果 Git 首次提交时要求用户名和邮箱，可以执行：

```powershell
git config --global user.name "你的 GitHub 用户名"
git config --global user.email "你的 GitHub 邮箱"
```

然后重新运行提交命令。

### 3. 在 GitHub 新建空仓库

1. 登录 [GitHub](https://github.com/)。
2. 点击右上角 `+`，选择 `New repository`。
3. 输入仓库名称，例如 `kaoyan-english-ai-training`。
4. 选择 `Public` 或 `Private`。
5. 不要勾选创建 README、`.gitignore` 或 License，因为本地已经有这些文件。
6. 点击 `Create repository`。

### 4. 连接并推送

GitHub 会显示仓库地址。将下面的地址替换为你自己的：

```powershell
git remote add origin https://github.com/你的用户名/你的仓库名.git
git remote -v
git push -u origin main
```

以后修改代码后，通常执行：

```powershell
git add .
git commit -m "说明这次修改"
git push
```

## 部署到 Vercel

### 1. 登录 Vercel

1. 打开 [Vercel](https://vercel.com/)。
2. 点击 `Sign Up` 或 `Log In`。
3. 推荐选择 `Continue with GitHub`。

### 2. 绑定 GitHub

第一次使用时，Vercel 会要求授权访问 GitHub 仓库。

你可以只授权当前项目仓库，不必开放全部仓库。

### 3. 导入项目

1. 在 Vercel 控制台点击 `Add New...`。
2. 选择 `Project`。
3. 在 GitHub 仓库列表中找到当前项目。
4. 点击 `Import`。

### 4. 检查构建设置

Vercel 通常会自动识别 Vite。请确认：

```text
Framework Preset: Vite
Install Command: npm install
Build Command: npm run build
Output Directory: dist
```

这个项目不需要填写环境变量。

### 5. 开始部署

点击 `Deploy`。

Vercel 会自动安装依赖、执行构建，然后生成类似下面的公网网址：

```text
https://你的项目名称.vercel.app
```

进入项目控制台的 `Overview` 或 `Deployments` 页面，可以看到并打开公网网址。

别人需要访问 Vercel 提供的 `https://...vercel.app` 地址，而不是你的 `127.0.0.1` 地址。

### 6. 后续自动部署

项目与 GitHub 绑定后，每次把新提交推送到 `main` 分支：

```powershell
git add .
git commit -m "update content"
git push
```

Vercel 都会自动开始新的生产部署。通常不需要再次手动导入项目。

其他分支或 Pull Request 通常会生成单独的预览网址，不会立即替换正式网址。

## 为什么需要 `vercel.json`

这个项目使用 React Router。直接打开 `/reading`、`/mistakes` 等地址时，Vercel 需要把请求交给 `index.html`，再由 React Router 显示正确页面。

`vercel.json` 已经配置了这个回退规则，可以避免刷新子页面时出现 404。

## 安全注意事项

- 不要提交 `.env` 或 `.env.local`。
- 不要把 API Key、数据库密码、登录密码写进源码。
- `node_modules` 和 `dist` 不需要上传，Vercel 会自动安装和构建。
- 上传前运行 `git status`，检查文件列表。
- 以后接入 API 时，只在 Vercel 的 Environment Variables 中保存密钥。

## 常见问题

### 本地可以打开，别人打不开

`127.0.0.1` 和 `localhost` 都只代表当前电脑。部署完成后，请分享 Vercel 提供的公网网址。

### Vercel 构建失败

先在本地执行：

```powershell
npm install
npm run build
```

如果本地也失败，请把完整终端报错发出来。如果只有 Vercel 失败，请复制 Vercel Deployment Logs。

### 刷新子页面出现 404

确认 GitHub 仓库中存在根目录下的 `vercel.json`，然后在 Vercel 中重新部署。

### 错题换电脑后没有了

错题目前保存在浏览器 `localStorage` 中，不会自动同步到账号或其他设备。这是第一版的设计，不是部署故障。

### Git 提示 `remote origin already exists`

先检查已有地址：

```powershell
git remote -v
```

如果地址不正确，替换它：

```powershell
git remote set-url origin https://github.com/你的用户名/你的仓库名.git
```

## 报错时请提供

1. 你执行的完整命令。
2. PowerShell 中从命令到报错结束的完整文字。
3. `node --version`、`npm --version` 和 `git --version` 输出。
4. Vercel 的 Deployment Logs。
5. 出错页面的网址和浏览器截图。
6. 浏览器 `F12 → Console` 中的红色错误。
