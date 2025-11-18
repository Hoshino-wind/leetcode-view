import { Problem, Difficulty, Category, SolutionMethod } from "@/types";

/**
 * 数学类题目数据
 */
export const mathProblems: Problem[] = [
  {
    id: 5,
    leetcodeNumber: 70,
    title: "爬楼梯",
    difficulty: Difficulty.EASY,
    category: [Category.MATH],
    methods: [SolutionMethod.DYNAMIC_PROGRAMMING, SolutionMethod.RECURSION],
    description: `假设你正在爬楼梯。需要 n 阶你才能到达楼顶。

每次你可以爬 1 或 2 个台阶。你有多少种不同的方法可以爬到楼顶呢？`,
    examples: [
      {
        input: "n = 2",
        output: "2",
        explanation: "有两种方法可以爬到楼顶：1. 1 阶 + 1 阶  2. 2 阶",
      },
      {
        input: "n = 3",
        output: "3",
        explanation:
          "有三种方法可以爬到楼顶：1. 1 阶 + 1 阶 + 1 阶  2. 1 阶 + 2 阶  3. 2 阶 + 1 阶",
      },
    ],
    constraints: ["1 <= n <= 45"],
    hints: [
      "这是一个斐波那契数列问题",
      "f(n) = f(n-1) + f(n-2)",
      "可以用动态规划优化空间复杂度",
    ],
    solution: {
      methodName: "动态规划（优化空间）",
      methodDescription:
        "到达第 n 阶的方法数 = 到达第 n-1 阶的方法数 + 到达第 n-2 阶的方法数。这是斐波那契数列，可以用两个变量优化空间。",
      code: `function climbStairs(n: number): number {
  if (n <= 2) return n;
  
  let prev2 = 1;  // f(1)
  let prev1 = 2;  // f(2)
  let current = 0;
  
  for (let i = 3; i <= n; i++) {
    current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }
  
  return current;
}`,
      language: "typescript",
      keyLines: [4, 5, 9, 10, 11],
      steps: [
        "处理基础情况：n=1 时有 1 种方法，n=2 时有 2 种方法",
        "初始化：prev2 = 1（第1阶）, prev1 = 2（第2阶）",
        "从第 3 阶开始循环计算",
        "  • current = prev1 + prev2（状态转移方程）",
        "  • 更新：prev2 = prev1, prev1 = current",
        "返回 current（第 n 阶的方法数）",
      ],
      advantages: [
        "空间优化：只用 3 个变量，空间复杂度 O(1)",
        "时间高效：只需遍历一次，时间复杂度 O(n)",
        "思路清晰：典型的动态规划入门题",
      ],
      timeComplexity: {
        value: "O(n)",
        description: "需要计算从 3 到 n 的所有值",
      },
      spaceComplexity: {
        value: "O(1)",
        description: "只使用了常数个变量",
      },
      comparisons: [
        {
          name: "递归（暴力）",
          description: "直接递归调用 f(n) = f(n-1) + f(n-2)",
          timeComplexity: "O(2^n)",
          spaceComplexity: "O(n)",
          isRecommended: false,
          pros: ["代码简洁"],
          cons: ["大量重复计算", "效率极低"],
        },
        {
          name: "动态规划（数组）",
          description: "使用数组存储所有中间结果",
          timeComplexity: "O(n)",
          spaceComplexity: "O(n)",
          isRecommended: false,
          pros: ["易于理解"],
          cons: ["空间占用较大"],
        },
        {
          name: "动态规划（优化空间）",
          description: "只保存最近两个状态",
          timeComplexity: "O(n)",
          spaceComplexity: "O(1)",
          isRecommended: true,
          pros: ["时空复杂度都最优", "最佳解法"],
          cons: ["需要理解状态转移"],
        },
      ],
    },
  },
  {
    id: 11,
    leetcodeNumber: 9,
    title: "回文数",
    difficulty: Difficulty.EASY,
    category: [Category.MATH],
    methods: [SolutionMethod.ITERATION],
    description: `给你一个整数 x ，如果 x 是一个回文整数，返回 true ；否则，返回 false 。

回文数是指正序（从左向右）和倒序（从右向左）读都是一样的整数。`,
    examples: [
      {
        input: "x = 121",
        output: "true",
      },
      {
        input: "x = -121",
        output: "false",
        explanation: "从左向右读为 -121 。从右向左读为 121- 。因此它不是一个回文数。",
      },
      {
        input: "x = 10",
        output: "false",
        explanation: "从右向左读为 01 。因此它不是一个回文数。",
      },
    ],
    constraints: ["-2³¹ <= x <= 2³¹ - 1"],
    hints: [
      "负数不是回文数",
      "可以反转数字的一半来判断",
      "不需要将整个数字反转",
    ],
    solution: {
      methodName: "反转一半数字",
      methodDescription:
        "通过反转数字的后半部分，然后与前半部分比较。这样可以避免整数溢出的问题。",
      code: `function isPalindrome(x: number): boolean {
  if (x < 0 || (x % 10 === 0 && x !== 0)) return false;
  
  let reversed = 0;
  while (x > reversed) {
    reversed = reversed * 10 + x % 10;
    x = Math.floor(x / 10);
  }
  
  return x === reversed || x === Math.floor(reversed / 10);
}`,
      language: "typescript",
      keyLines: [2, 5, 6, 9],
      steps: [
        "处理特殊情况：负数和末尾为0的非零数不是回文",
        "反转数字的后半部分",
        "  • 取出末位数字加到反转数中",
        "  • 去掉原数字的末位",
        "比较前半部分和反转的后半部分是否相等",
      ],
      advantages: [
        "避免溢出：只反转一半，不会超出整数范围",
        "时间优化：只需遍历一半的位数",
        "空间节省：O(1) 空间复杂度",
      ],
      timeComplexity: {
        value: "O(log n)",
        description: "只需遍历数字位数的一半",
      },
      spaceComplexity: {
        value: "O(1)",
        description: "只使用了常数个变量",
      },
      comparisons: [
        {
          name: "转字符串",
          description: "将数字转为字符串，比较正反序",
          timeComplexity: "O(n)",
          spaceComplexity: "O(n)",
          isRecommended: false,
          pros: ["实现简单"],
          cons: ["额外空间开销", "转换开销"],
        },
        {
          name: "反转一半数字",
          description: "数学方法反转后半部分数字",
          timeComplexity: "O(log n)",
          spaceComplexity: "O(1)",
          isRecommended: true,
          pros: ["最优解法", "无额外空间"],
          cons: ["需要理解数学技巧"],
        },
      ],
    },
  },
];
