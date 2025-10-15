# 开发指南

## 目录

- [项目概述](#项目概述)
- [开发环境设置](#开发环境设置)
- [代码规范](#代码规范)
- [组件开发](#组件开发)
- [题目开发流程](#题目开发流程)
- [调试技巧](#调试技巧)

## 项目概述

本项目旨在为 LeetCode 热题 100 创建交互式的算法可视化教程。通过动画、代码高亮、分步执行等方式帮助学习者更好地理解算法。

### 核心架构

```
用户界面层 (UI Layer)
    ↓
可视化组件层 (Visualization Components)
    ↓
算法步骤生成层 (Algorithm Step Generator)
    ↓
数据层 (Data Layer)
```

## 开发环境设置

### 1. 必需工具

- Node.js >= 16.0
- Git
- VS Code (推荐)

### 2. 推荐的 VS Code 插件

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

### 3. 初始化项目

```bash
# 克隆项目
git clone <your-repo-url>
cd leetcode-view

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 代码规范

### TypeScript 规范

- 所有文件使用 TypeScript
- 使用明确的类型注解
- 避免使用 `any` 类型
- 导出接口和类型

```typescript
// ✅ 好的示例
interface Props {
  items: number[];
  onUpdate: (items: number[]) => void;
}

// ❌ 避免
interface Props {
  items: any;
  onUpdate: any;
}
```

### React 组件规范

- 使用函数组件和 Hooks
- Props 使用接口定义
- 组件名使用 PascalCase
- 文件名与组件名一致

```typescript
// ✅ 好的示例
interface ButtonProps {
  label: string;
  onClick: () => void;
}

function Button({ label, onClick }: ButtonProps) {
  return <button onClick={onClick}>{label}</button>;
}
```

### 样式规范

- 使用 Tailwind CSS 工具类
- 避免内联样式
- 复用 Tailwind 配置的主题色

```tsx
// ✅ 好的示例
<div className="bg-white rounded-lg shadow-sm p-6">

// ❌ 避免
<div style={{ background: 'white', borderRadius: '8px' }}>
```

## 组件开发

### 可视化组件结构

每个可视化组件应该：

1. 接收数据作为 props
2. 接收高亮/当前状态
3. 使用 Framer Motion 实现动画
4. 响应式设计

```typescript
interface VisualizerProps {
  data: unknown[];
  highlightedIndices?: number[];
  currentIndex?: number;
  onItemClick?: (index: number) => void;
}

function Visualizer({
  data,
  highlightedIndices = [],
  currentIndex,
  onItemClick,
}: VisualizerProps) {
  // 实现...
}
```

### 动画最佳实践

```typescript
import { motion } from 'framer-motion'

// 使用 motion 组件
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* 内容 */}
</motion.div>

// 使用动画变体
const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

<motion.div
  variants={variants}
  initial="hidden"
  animate="visible"
>
```

## 题目开发流程

### 1. 规划阶段

在开始编码前，思考：

- 这道题的关键步骤是什么？
- 需要可视化哪些数据结构？
- 哪些变量需要展示？
- 如何分解算法步骤？

### 2. 创建题目数据

在 `src/data/problems.ts` 添加：

```typescript
{
  id: 2,
  leetcodeNumber: 206,
  title: '反转链表',
  difficulty: Difficulty.EASY,
  category: [Category.LINKED_LIST],
  description: `详细的题目描述...`,
  examples: [
    {
      input: 'head = [1,2,3,4,5]',
      output: '[5,4,3,2,1]',
      explanation: '...'
    }
  ],
  constraints: ['...'],
  hints: ['...']
}
```

### 3. 创建题目目录

```bash
mkdir -p src/problems/YourProblem
touch src/problems/YourProblem/YourProblemVisualizer.tsx
touch src/problems/YourProblem/algorithm.ts
```

### 4. 实现算法步骤生成器

在 `algorithm.ts` 中：

```typescript
import { VisualizationStep } from "@/types";

export function generateYourProblemSteps(input: any): VisualizationStep[] {
  const steps: VisualizationStep[] = [];

  // 初始步骤
  steps.push({
    id: 0,
    description: "开始执行算法...",
    data: input,
    variables: {},
    code: "1",
  });

  // 算法逻辑...
  // 每个关键步骤都添加一个 step

  return steps;
}
```

**关键点：**

- 每个重要的状态变化都应该有一个步骤
- 包含清晰的描述
- 记录当前变量状态
- 标记代码行号
- 高亮相关元素

### 5. 实现可视化组件

```typescript
import { useState, useEffect } from "react";
import { generateYourProblemSteps } from "./algorithm";
import PlaybackControls from "@/components/controls/PlaybackControls";
// ... 其他导入

const YourProblemVisualizer = () => {
  const [input, setInput] = useState(/* 默认输入 */);
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // 生成步骤
  useEffect(() => {
    const generatedSteps = generateYourProblemSteps(input);
    setSteps(generatedSteps);
    setCurrentStep(0);
  }, [input]);

  // 自动播放
  useEffect(() => {
    if (!isPlaying || currentStep >= steps.length - 1) return;

    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 1000 / speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length, speed]);

  // 实现控制函数
  const handlePlay = () => setIsPlaying(true);
  const handlePause = () => setIsPlaying(false);
  // ... 其他控制函数

  return (
    <div className="space-y-6">
      {/* 输入控制 */}
      {/* 播放控制 */}
      <PlaybackControls {...controlProps} />
      {/* 可视化区域 */}
      {/* 代码显示 */}
      {/* 复杂度分析 */}
    </div>
  );
};

export default YourProblemVisualizer;
```

### 6. 注册到路由

在 `src/pages/ProblemPage.tsx` 中添加：

```typescript
import YourProblemVisualizer from "@/problems/YourProblem/YourProblemVisualizer";

// 在渲染部分添加
{
  problem.id === 2 ? (
    <YourProblemVisualizer />
  ) : problem.id === 1 ? (
    <TwoSumVisualizer />
  ) : (
    <div>开发中...</div>
  );
}
```

### 7. 测试

- 测试不同的输入
- 验证边界情况
- 检查动画流畅性
- 确保代码高亮准确
- 测试响应式布局

## 调试技巧

### 1. 查看步骤数据

```typescript
useEffect(() => {
  console.log("Steps:", steps);
  console.log("Current Step:", currentStep, steps[currentStep]);
}, [steps, currentStep]);
```

### 2. React DevTools

安装 React DevTools 浏览器插件，查看：

- 组件层级
- Props 和 State
- 性能分析

### 3. 动画调试

```typescript
// 临时禁用动画以调试布局
<motion.div
  animate={{ opacity: 1 }}
  transition={{ duration: 0 }} // 设置为 0
>
```

### 4. 控制台输出

使用有意义的日志：

```typescript
console.group("Algorithm Step");
console.log("Current Index:", i);
console.log("Current Value:", nums[i]);
console.log("Map State:", Object.fromEntries(map));
console.groupEnd();
```

## 性能优化

### 1. 使用 React.memo

```typescript
import { memo } from "react";

interface ExpensiveComponentProps {
  data: unknown[];
}

const ExpensiveComponent = memo(function ExpensiveComponent({
  data,
}: ExpensiveComponentProps) {
  // 组件逻辑
  return <div>{/* ... */}</div>;
});
```

### 2. 使用 useMemo 和 useCallback

```typescript
const computedValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);

const handleClick = useCallback(() => {
  // 处理逻辑
}, [dependencies]);
```

### 3. 避免不必要的重渲染

```typescript
// ✅ 好的示例
const [state, setState] = useState({ count: 0 });
setState((prev) => ({ ...prev, count: prev.count + 1 }));

// ❌ 避免
setState({ count: state.count + 1 });
```

## 常见问题

### Q: 如何处理复杂的数据结构（如树、图）？

A: 创建专门的可视化组件：

- `TreeVisualizer.tsx` for 树结构
- `GraphVisualizer.tsx` for 图结构
- 使用 D3.js 或 Canvas 处理复杂布局

### Q: 如何让动画更流畅？

A:

- 使用 CSS transform 而不是 position
- 合理使用 Framer Motion 的 layout 属性
- 避免在动画期间进行复杂计算
- 使用 `will-change` CSS 属性

### Q: 如何支持自定义输入？

A: 参考 `TwoSumVisualizer.tsx` 的实现：

```typescript
const handleInputChange = () => {
  const input = prompt("请输入...");
  // 验证和设置
  setInput(parseInput(input));
};
```

## 下一步

- 阅读 [贡献指南](../CONTRIBUTING.md)
- 查看 [示例：两数之和](../src/problems/TwoSum)
- 开始开发你的第一个题目！

## 需要帮助？

- 查看已有的题目实现作为参考
- 在 Issues 中提问
- 加入我们的讨论组
