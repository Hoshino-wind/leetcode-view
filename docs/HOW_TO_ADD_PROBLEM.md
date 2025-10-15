# 如何添加新题目

本指南将手把手教你如何为项目添加一道新的 LeetCode 题目可视化。

## 快速检查清单

- [ ] 在 `problems.ts` 中添加题目信息
- [ ] 创建题目目录和文件
- [ ] 实现算法步骤生成器
- [ ] 实现可视化组件
- [ ] 在路由中注册题目
- [ ] 测试和调试
- [ ] 提交 PR

---

## 详细步骤

### 步骤 1: 添加题目信息

编辑 `src/data/problems.ts`，在 `problems` 数组中添加新题目：

```typescript
{
  id: 2,  // 递增的ID
  leetcodeNumber: 206,  // LeetCode 题号
  title: '反转链表',
  difficulty: Difficulty.EASY,  // EASY | MEDIUM | HARD
  category: [Category.LINKED_LIST],  // 可以有多个分类
  description: `给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。`,
  examples: [
    {
      input: 'head = [1,2,3,4,5]',
      output: '[5,4,3,2,1]',
      explanation: '将链表从 1->2->3->4->5 反转为 5->4->3->2->1'
    },
    {
      input: 'head = [1,2]',
      output: '[2,1]',
    },
    {
      input: 'head = []',
      output: '[]',
    }
  ],
  constraints: [
    '链表中节点的数目范围是 [0, 5000]',
    '-5000 <= Node.val <= 5000',
  ],
  hints: [
    '使用三个指针：prev, current, next',
    '可以使用递归或迭代两种方式',
  ],
}
```

### 步骤 2: 创建题目目录结构

```bash
# 创建题目目录（使用 PascalCase 命名）
mkdir -p src/problems/ReverseLinkedList

# 创建必要的文件
touch src/problems/ReverseLinkedList/ReverseLinkedListVisualizer.tsx
touch src/problems/ReverseLinkedList/algorithm.ts
```

目录结构：

```
src/problems/ReverseLinkedList/
├── ReverseLinkedListVisualizer.tsx  # 可视化组件
├── algorithm.ts                      # 算法步骤生成器
└── README.md                         # (可选) 题目说明
```

### 步骤 3: 实现算法步骤生成器

编辑 `src/problems/ReverseLinkedList/algorithm.ts`：

```typescript
import { VisualizationStep } from "@/types";

// 定义链表节点接口（如果需要）
interface ListNode {
  val: number;
  next: ListNode | null;
}

export function generateReverseLinkedListSteps(
  head: ListNode | null
): VisualizationStep[] {
  const steps: VisualizationStep[] = [];

  // 步骤 0: 初始状态
  steps.push({
    id: 0,
    description:
      "开始反转链表，初始化三个指针：prev = null, current = head, next = null",
    data: head,
    variables: {
      prev: null,
      current: head,
      next: null,
    },
    code: "1",
  });

  let prev: ListNode | null = null;
  let current = head;
  let next: ListNode | null = null;

  let stepId = 1;

  // 遍历链表
  while (current !== null) {
    // 步骤 N: 保存 next
    next = current.next;
    steps.push({
      id: stepId++,
      description: `保存 current.next 到 next 指针，防止丢失后续节点`,
      data: head,
      variables: { prev, current, next },
      highlightedNodes: [current.val.toString()],
      code: "5",
    });

    // 步骤 N+1: 反转指针
    current.next = prev;
    steps.push({
      id: stepId++,
      description: `反转指针：current.next = prev`,
      data: head,
      variables: { prev, current, next },
      highlightedNodes: [current.val.toString()],
      code: "6",
    });

    // 步骤 N+2: 移动指针
    prev = current;
    current = next;
    steps.push({
      id: stepId++,
      description: `移动指针：prev = current, current = next`,
      data: head,
      variables: { prev, current, next },
      code: "7-8",
    });
  }

  // 最后一步
  steps.push({
    id: stepId,
    description: `链表反转完成，prev 指向新的头节点`,
    data: prev,
    variables: { prev, current: null, next: null },
    code: "10",
  });

  return steps;
}
```

**关键要点：**

- 每个重要的状态变化都要记录一个步骤
- `description` 要清晰明了
- `variables` 记录所有相关变量的当前值
- `highlightedNodes/highlightedIndices` 高亮当前操作的元素
- `code` 标记对应的代码行号

### 步骤 4: 实现可视化组件

编辑 `src/problems/ReverseLinkedList/ReverseLinkedListVisualizer.tsx`：

```typescript
import { useState, useEffect } from "react";
import { generateReverseLinkedListSteps } from "./algorithm";
import PlaybackControls from "@/components/controls/PlaybackControls";
import CodeDisplay from "@/components/CodeDisplay";
import StepDescription from "@/components/StepDescription";
import LinkedListVisualizer from "@/components/visualizers/LinkedListVisualizer";
import { VisualizationStep } from "@/types";

const ReverseLinkedListVisualizer = () => {
  // 状态管理
  const [input, setInput] = useState([1, 2, 3, 4, 5]);
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // 代码字符串
  const code = `function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null
  let current = head
  let next: ListNode | null = null
  
  while (current !== null) {
    next = current.next
    current.next = prev
    prev = current
    current = next
  }
  
  return prev
}`;

  // 生成步骤
  useEffect(() => {
    const head = arrayToLinkedList(input);
    const generatedSteps = generateReverseLinkedListSteps(head);
    setSteps(generatedSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [input]);

  // 自动播放逻辑
  useEffect(() => {
    if (!isPlaying || currentStep >= steps.length - 1) return;

    const timer = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 1000 / speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length, speed]);

  // 播放结束自动暂停
  useEffect(() => {
    if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [currentStep, steps.length]);

  // 控制函数
  const handlePlay = () => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => setIsPlaying(false);

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleInputChange = () => {
    const inputStr = prompt("请输入链表节点值（用逗号分隔）", input.join(","));
    if (inputStr) {
      const newInput = inputStr.split(",").map((s) => parseInt(s.trim()));
      if (newInput.every((n) => !isNaN(n))) {
        setInput(newInput);
      }
    }
  };

  const currentStepData = steps[currentStep] || steps[0];

  return (
    <div className="space-y-6">
      {/* 输入控制 */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-700">测试用例</h3>
          <button
            onClick={handleInputChange}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition"
          >
            自定义输入
          </button>
        </div>
        <div className="font-mono bg-white px-3 py-2 rounded border">
          head = [{input.join(", ")}]
        </div>
      </div>

      {/* 播放控制 */}
      {steps.length > 0 && (
        <PlaybackControls
          isPlaying={isPlaying}
          currentStep={currentStep}
          totalSteps={steps.length}
          speed={speed}
          onPlay={handlePlay}
          onPause={handlePause}
          onStepForward={handleStepForward}
          onStepBackward={handleStepBackward}
          onReset={handleReset}
          onSpeedChange={setSpeed}
        />
      )}

      {/* 步骤说明 */}
      {currentStepData && (
        <StepDescription
          description={currentStepData.description}
          variables={currentStepData.variables}
        />
      )}

      {/* 链表可视化 */}
      {currentStepData && (
        <LinkedListVisualizer
          data={currentStepData.data}
          highlightedNodes={currentStepData.highlightedNodes}
        />
      )}

      {/* 代码显示 */}
      <CodeDisplay
        code={code}
        highlightedLines={
          currentStepData?.code ? [parseInt(currentStepData.code)] : []
        }
      />

      {/* 复杂度分析 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold mb-3">复杂度分析</h3>
        <div className="space-y-2">
          <div>
            <span className="font-semibold">时间复杂度：</span>
            <code>O(n)</code> - 遍历链表一次
          </div>
          <div>
            <span className="font-semibold">空间复杂度：</span>
            <code>O(1)</code> - 只使用常数个指针
          </div>
        </div>
      </div>
    </div>
  );
};

// 辅助函数：数组转链表
function arrayToLinkedList(arr: number[]) {
  // 实现...
}

export default ReverseLinkedListVisualizer;
```

### 步骤 5: 在路由中注册

编辑 `src/pages/ProblemPage.tsx`，添加新题目的路由：

```typescript
import ReverseLinkedListVisualizer from "@/problems/ReverseLinkedList/ReverseLinkedListVisualizer";

// 在渲染部分
{
  problem.id === 2 ? (
    <ReverseLinkedListVisualizer />
  ) : problem.id === 1 ? (
    <TwoSumVisualizer />
  ) : (
    <div className="text-center py-12 text-gray-500">
      该题目的可视化功能正在开发中...
    </div>
  );
}
```

### 步骤 6: 测试

1. **启动开发服务器**

   ```bash
   npm run dev
   ```

2. **测试清单**

   - [ ] 题目在首页列表中正确显示
   - [ ] 点击题目能跳转到详情页
   - [ ] 题目信息（描述、示例、提示）正确显示
   - [ ] 可视化组件正常渲染
   - [ ] 播放/暂停控制工作正常
   - [ ] 单步前进/后退功能正常
   - [ ] 速度调节正常
   - [ ] 代码高亮与步骤同步
   - [ ] 变量状态正确显示
   - [ ] 自定义输入功能正常
   - [ ] 测试各种边界情况
   - [ ] 响应式布局在移动端正常

3. **边界测试**
   - 空输入
   - 单个元素
   - 大量元素
   - 特殊值（负数、零等）

### 步骤 7: 完善文档

（可选）创建 `src/problems/ReverseLinkedList/README.md`：

```markdown
# 反转链表

## 题目描述

给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。

## 解法

### 迭代法

使用三个指针 prev, current, next 遍历链表并反转指针方向。

**时间复杂度**: O(n)  
**空间复杂度**: O(1)

### 递归法

（待实现）

## 可视化特点

- 链表节点动画
- 指针移动动画
- 清晰的变量状态展示

## 开发说明

- 使用 LinkedListVisualizer 组件
- 实现了完整的播放控制
- 支持自定义输入
```

### 步骤 8: 提交代码

```bash
# 创建新分支
git checkout -b feat/add-reverse-linked-list

# 添加文件
git add .

# 提交
git commit -m "feat: 添加反转链表题目可视化"

# 推送
git push origin feat/add-reverse-linked-list

# 在 GitHub 上创建 Pull Request
```

---

## 常见模板

### 简单数组题目模板

```typescript
// algorithm.ts
export function generateSteps(nums: number[]): VisualizationStep[] {
  const steps: VisualizationStep[] = [];

  steps.push({
    id: 0,
    description: "初始状态",
    data: nums,
    variables: {},
  });

  // 算法逻辑...

  return steps;
}
```

### 链表题目模板

```typescript
interface ListNode {
  val: number;
  next: ListNode | null;
}

export function generateSteps(head: ListNode | null): VisualizationStep[] {
  // 类似上面的反转链表示例
}
```

### 树题目模板

```typescript
interface TreeNode {
  val: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

export function generateSteps(root: TreeNode | null): VisualizationStep[] {
  const steps: VisualizationStep[] = [];

  function traverse(node: TreeNode | null) {
    if (!node) return;

    steps.push({
      id: steps.length,
      description: `访问节点 ${node.val}`,
      data: root,
      highlightedNodes: [node.val.toString()],
    });

    // 递归遍历...
  }

  traverse(root);
  return steps;
}
```

---

## 最佳实践

### 1. 步骤粒度

- ✅ 每个关键状态变化一个步骤
- ❌ 不要太细（如每次变量赋值）
- ❌ 不要太粗（如整个循环一个步骤）

### 2. 描述清晰度

```typescript
// ✅ 好的描述
description: "检查 nums[2] = 11 是否等于 complement = 7，不相等，继续";

// ❌ 模糊的描述
description: "继续执行";
```

### 3. 变量展示

```typescript
// ✅ 展示有意义的变量
variables: {
  i: 2,
  'nums[i]': 11,
  complement: 7,
  map: { 2: 0, 7: 1 }
}

// ❌ 展示过多或无关变量
variables: {
  i, j, k, temp, flag, result, ...
}
```

### 4. 代码行号

```typescript
// 使用准确的行号
code: "5"; // 单行
code: "5-7"; // 多行
code: "5,8"; // 多个不连续行
```

---

## 需要创建新可视化组件？

如果现有的可视化组件不够用，参考：

- `ArrayVisualizer.tsx` - 数组可视化
- 创建 `LinkedListVisualizer.tsx` - 链表可视化
- 创建 `TreeVisualizer.tsx` - 树可视化
- 创建 `GraphVisualizer.tsx` - 图可视化

---

## 遇到问题？

1. 查看已实现的题目作为参考
2. 阅读 [开发指南](DEVELOPMENT_GUIDE.md)
3. 在 Issues 中提问
4. 加入讨论组

---

## 下一步

- 选择一道你想实现的题目
- 按照本指南开始开发
- 提交 PR 分享你的成果！

祝你开发顺利！🎉
