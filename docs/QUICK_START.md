# 快速开始指南

## 🎯 5 分钟快速启动

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

浏览器会自动打开 `http://localhost:3000`

### 3. 开始探索

- 查看题目列表
- 点击"两数之和"进入可视化页面
- 使用播放控制观看算法执行过程

---

## 📝 接下来做什么？

### 对于学习者

1. **浏览已实现的题目** - 从简单题目开始
2. **尝试自定义输入** - 点击"自定义输入"按钮
3. **单步执行** - 使用前进/后退按钮仔细观察
4. **调整速度** - 找到最适合你的播放速度

### 对于开发者

1. **阅读开发指南** - [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)
2. **了解项目结构** - 查看 [README.md](../README.md)
3. **添加新题目** - 参考 [HOW_TO_ADD_PROBLEM.md](HOW_TO_ADD_PROBLEM.md)
4. **查看路线图** - [ROADMAP.md](ROADMAP.md)

---

## 🛠️ 开发命令

```bash
# 开发服务器（热更新）
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 代码检查
npm run lint

# 类型检查
npx tsc --noEmit
```

---

## 📂 关键文件位置

```
leetcode-view/
├── src/
│   ├── problems/TwoSum/        # 第一个示例题目
│   ├── components/             # 可复用组件
│   ├── data/problems.ts        # 题目数据
│   └── types/index.ts          # 类型定义
├── docs/                       # 文档
└── README.md                   # 项目说明
```

---

## 🎨 技术栈一览

- **React 18** - 前端框架
- **TypeScript** - 类型系统
- **Vite** - 构建工具
- **Tailwind CSS** - 样式
- **Framer Motion** - 动画
- **React Router** - 路由

---

## 💡 提示

### 首次开发？

1. 先运行项目，看看效果
2. 修改 `src/problems/TwoSum/TwoSumVisualizer.tsx`
3. 保存后立即看到变化（热更新）
4. 参考这个文件结构创建新题目

### 遇到问题？

- 确保 Node.js >= 16
- 删除 `node_modules` 和 `package-lock.json` 后重新安装
- 查看浏览器控制台的错误信息
- 在 Issues 中搜索或提问

---

## 下一步

选择你的角色：

- **🎓 学习算法** → 直接使用项目，观看可视化
- **🔨 贡献代码** → 阅读 [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)
- **🎨 设计优化** → 提出 UI/UX 改进建议
- **📝 完善文档** → 帮助改进文档

开始吧！🚀
