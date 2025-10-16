# 拾光 - 剪贴板历史记录工具

一款基于 Electron + React + TypeScript 开发的剪贴板历史记录软件，支持文本和图片的复制粘贴历史管理。

## 功能特性

- 📋 **剪贴板监听**：自动监听系统剪贴板变化
- 📝 **文本记录**：保存文本复制历史
- 🖼️ **图片记录**：支持图片复制历史
- 🔍 **搜索功能**：快速搜索历史记录
- ⌨️ **快捷键**：Ctrl+O 快速打开/关闭面板
- 🎨 **主题切换**：支持浅色/深色主题
- 💾 **持久化存储**：自动保存历史记录

## 技术栈

- **前端框架**：React 19 + TypeScript
- **桌面框架**：Electron
- **状态管理**：Redux Toolkit
- **UI 组件**：Ant Design
- **样式处理**：Sass/SCSS
- **构建工具**：Vite + electron-vite
- **打包工具**：electron-builder

## 开发环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

## 安装和运行

### 1. 克隆项目

```bash
git clone <repository-url>
cd TimeCollector12
```

### 2. 安装依赖

```bash
npm install
```

### 3. 开发模式运行

```bash
npm run dev
```

这将启动开发服务器，自动打开 Electron 应用窗口。

### 4. 构建项目

```bash
# 类型检查
npm run typecheck

# 构建生产版本
npm run build
```

### 5. 打包应用

```bash
# 打包 Windows 安装程序
npm run build:win

# 打包未压缩的应用目录
npm run build:unpack

# 打包 macOS 应用
npm run build:mac

# 打包 Linux 应用
npm run build:linux
```

## 项目结构

```
TimeCollector12/
├── src/
│   ├── main/                 # 主进程代码
│   │   └── index.ts         # 主进程入口
│   ├── preload/             # 预加载脚本
│   │   └── index.ts         # 预加载脚本入口
│   ├── renderer/            # 渲染进程代码
│   │   ├── src/
│   │   │   ├── App.tsx      # 主应用组件
│   │   │   ├── main.tsx     # React 应用入口
│   │   │   ├── store/       # Redux 状态管理
│   │   │   └── components/  # React 组件
│   │   └── index.html       # HTML 模板
│   └── types/               # TypeScript 类型定义
├── resources/               # 资源文件
│   └── icon.ico            # 应用图标
├── build/                  # 构建配置
├── out/                    # 构建输出
├── dist/                   # 打包输出
├── package.json            # 项目配置
├── electron-builder.yml    # 打包配置
└── README.md              # 项目说明
```

## 开发命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发模式 |
| `npm run build` | 构建生产版本 |
| `npm run build:win` | 打包 Windows 安装程序 |
| `npm run build:unpack` | 打包未压缩应用目录 |
| `npm run build:mac` | 打包 macOS 应用 |
| `npm run build:linux` | 打包 Linux 应用 |
| `npm run typecheck` | TypeScript 类型检查 |
| `npm run lint` | ESLint 代码检查 |
| `npm run format` | Prettier 代码格式化 |

## 使用说明

### 快捷键

- **Ctrl + O**：打开/关闭剪贴板历史面板
- **双击**：复制选中的历史记录到剪贴板

### 功能操作

1. **查看历史记录**：应用会自动监听剪贴板变化并保存历史
2. **搜索记录**：在搜索框中输入关键词快速查找
3. **复制内容**：双击任意历史记录项即可复制到剪贴板
4. **清空历史**：点击"清空"按钮删除所有历史记录
5. **切换主题**：在设置页面选择浅色或深色主题

## 构建输出说明

### Windows 安装程序

执行 `npm run build:win` 后，安装程序位置：
- **安装包**：`dist/timecollector-1.0.0-setup.exe`
- **可执行文件**：`dist/win-unpacked/timecollector.exe`

### 应用配置

- **应用名称**：拾光
- **版本号**：1.0.0
- **图标**：resources/icon.ico
- **安装目录**：用户可自定义

## 开发注意事项

### TypeScript 配置

项目使用严格的 TypeScript 配置，确保类型安全：
- 启用严格模式
- 完整的类型检查
- Redux store 类型定义

### 代码规范

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 React 和 TypeScript 最佳实践

### 主进程功能

- 剪贴板监听和轮询
- 历史记录管理
- 全局快捷键注册
- 窗口状态控制

### 渲染进程功能

- React 组件渲染
- Redux 状态管理
- Ant Design UI 组件
- 主题切换支持

## 故障排除

### 常见问题

1. **依赖安装失败**
   ```bash
   # 清理缓存后重新安装
   npm cache clean --force
   npm install
   ```

2. **打包失败**
   ```bash
   # 确保已正确安装依赖
   npm install
   # 重新构建
   npm run build
   npm run build:win
   ```

3. **开发模式启动失败**
   ```bash
   # 检查 Node.js 版本
   node --version
   # 确保版本 >= 18.0.0
   ```

## 许可证

本项目采用 MIT 许可证。

## 作者

rockui

## 更新日志

### v1.0.0
- 初始版本发布
- 支持文本和图片剪贴板历史记录
- 实现搜索和主题切换功能
- 支持 Windows 平台打包