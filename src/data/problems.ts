import { Problem, Difficulty, Category, SolutionMethod } from "@/types";

export const problems: Problem[] = [
  {
    id: 1,
    leetcodeNumber: 1,
    title: "两数之和",
    difficulty: Difficulty.EASY,
    category: [Category.ARRAY, Category.HASH_TABLE],
    methods: [SolutionMethod.TWO_POINTERS, SolutionMethod.ITERATION],
    description: `给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标。

你可以假设每种输入只会对应一个答案。但是，数组中同一个元素在答案里不能重复出现。

你可以按任意顺序返回答案。`,
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "因为 nums[0] + nums[1] == 9，返回 [0, 1]",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
      },
    ],
    constraints: [
      "2 <= nums.length <= 10⁴",
      "-10⁹ <= nums[i] <= 10⁹",
      "-10⁹ <= target <= 10⁹",
      "只会存在一个有效答案",
    ],
    hints: [
      "尝试使用哈希表来优化时间复杂度",
      "遍历数组时，检查 target - nums[i] 是否在哈希表中",
    ],
    solution: {
      methodName: "哈希表（经典解法）",
      methodDescription:
        "使用哈希表可以将查找时间从 O(n) 降低到 O(1)，从而把整体时间复杂度降低到 O(n)。",
      code: `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    
    if (map.has(complement)) {
      return [map.get(complement)!, i];
    }
    
    map.set(nums[i], i);
  }
  
  return [];
}`,
      language: "typescript",
      keyLines: [7, 8, 11], // 关键代码行：检查哈希表、返回结果、存入哈希表
      steps: [
        "创建一个哈希表（Map）用于存储已遍历过的数字及其索引",
        "遍历数组，对于每个元素 nums[i]，计算其补数 complement = target - nums[i]",
        "检查补数是否在哈希表中：",
        "  • 如果存在，说明找到答案，返回 [哈希表中的索引, 当前索引 i]",
        "  • 如果不存在，将当前数字和索引存入哈希表",
        "继续遍历直到找到答案",
      ],
      advantages: [
        "查找快：哈希表的查找时间为 O(1)，远快于数组的 O(n)",
        "一次遍历：只需遍历数组一次，边遍历边查找",
        "空间可接受：虽然需要 O(n) 额外空间，但在现代计算机中完全可接受",
      ],
      timeComplexity: {
        value: "O(n)",
        description: "只需遍历数组一次，每次哈希表的查询和插入操作都是 O(1)",
      },
      spaceComplexity: {
        value: "O(n)",
        description: "哈希表最多需要存储 n 个元素",
      },
      comparisons: [
        {
          name: "暴力解法（两层循环）",
          description: "对每个元素，遍历后续所有元素寻找配对",
          timeComplexity: "O(n²)",
          spaceComplexity: "O(1)",
          isRecommended: false,
          pros: ["不需要额外空间", "实现简单"],
          cons: ["效率低", "数据量大时耗时严重"],
        },
        {
          name: "哈希表解法",
          description: "用空间换时间，一次遍历即可完成",
          timeComplexity: "O(n)",
          spaceComplexity: "O(n)",
          isRecommended: true,
          pros: ["高效", "在面试和实际应用中最常用"],
          cons: ["需要额外空间"],
        },
      ],
    },
  },
  {
    id: 2,
    leetcodeNumber: 206,
    title: "反转链表",
    difficulty: Difficulty.EASY,
    category: [Category.LINKED_LIST],
    methods: [
      SolutionMethod.TWO_POINTERS,
      SolutionMethod.ITERATION,
      SolutionMethod.RECURSION,
    ],
    description: `给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。`,
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
      },
      {
        input: "head = [1,2]",
        output: "[2,1]",
      },
      {
        input: "head = []",
        output: "[]",
      },
    ],
    constraints: [
      "链表中节点的数目范围是 [0, 5000]",
      "-5000 <= Node.val <= 5000",
    ],
    hints: [
      "可以使用迭代或递归两种方法",
      "迭代法需要用三个指针：prev, curr, next",
      "递归法要理解递归返回后的操作",
    ],
    solution: {
      methodName: "迭代法（双指针）",
      methodDescription:
        "使用双指针迭代遍历链表，逐个反转节点的指向。这是最直观、最容易理解的解法。",
      code: `function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr: ListNode | null = head;
  
  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  
  return prev;
}`,
      language: "typescript",
      keyLines: [6, 7, 8, 9], // 关键代码行：保存next、反转指针、移动prev、移动curr
      steps: [
        "初始化两个指针：prev = null（前驱节点），curr = head（当前节点）",
        "遍历链表，对于每个节点：",
        "  • 先保存下一个节点：next = curr.next",
        "  • 反转当前节点的指针：curr.next = prev",
        "  • 移动两个指针：prev = curr, curr = next",
        "当 curr 为 null 时，prev 就是新的头节点",
      ],
      advantages: [
        "空间复杂度低：只需要常数级别的额外空间",
        "逻辑清晰：容易理解和实现",
        "适合面试：是面试官最期待看到的解法",
      ],
      timeComplexity: {
        value: "O(n)",
        description: "需要遍历链表一次，n 为链表长度",
      },
      spaceComplexity: {
        value: "O(1)",
        description: "只使用了常数个指针变量",
      },
      comparisons: [
        {
          name: "迭代法（双指针）",
          description: "使用两个指针遍历并反转",
          timeComplexity: "O(n)",
          spaceComplexity: "O(1)",
          isRecommended: true,
          pros: ["空间效率高", "易于理解", "最常用"],
          cons: ["需要仔细处理指针"],
        },
        {
          name: "递归法",
          description: "利用递归栈反转链表",
          timeComplexity: "O(n)",
          spaceComplexity: "O(n)",
          isRecommended: false,
          pros: ["代码简洁", "体现递归思想"],
          cons: ["递归栈空间开销", "可能栈溢出"],
        },
      ],
    },
  },
  // 后续添加更多题目...
];

export const getProblemById = (id: number): Problem | undefined => {
  return problems.find((p) => p.id === id);
};

export const getProblemsByCategory = (category: Category): Problem[] => {
  return problems.filter((p) => p.category.includes(category));
};

export const getProblemsByDifficulty = (difficulty: Difficulty): Problem[] => {
  return problems.filter((p) => p.difficulty === difficulty);
};

// 获取所有分类及其题目数量（题型分类）
export const getCategoryStats = () => {
  const stats = new Map<Category, number>();
  problems.forEach((problem) => {
    problem.category.forEach((cat) => {
      stats.set(cat, (stats.get(cat) || 0) + 1);
    });
  });
  return stats;
};

// 获取所有解决方式及其题目数量
export const getMethodStats = () => {
  const stats = new Map<SolutionMethod, number>();
  problems.forEach((problem) => {
    problem.methods.forEach((method) => {
      stats.set(method, (stats.get(method) || 0) + 1);
    });
  });
  return stats;
};

// 分类中文名称映射（题型）
export const categoryNames: Record<Category, string> = {
  [Category.ARRAY]: "数组",
  [Category.STRING]: "字符串",
  [Category.LINKED_LIST]: "链表",
  [Category.TREE]: "树",
  [Category.GRAPH]: "图",
  [Category.HASH_TABLE]: "哈希表",
  [Category.STACK]: "栈",
  [Category.QUEUE]: "队列",
  [Category.HEAP]: "堆",
  [Category.MATH]: "数学",
  [Category.MATRIX]: "矩阵",
};

// 解决方式中文名称映射
export const methodNames: Record<SolutionMethod, string> = {
  [SolutionMethod.DYNAMIC_PROGRAMMING]: "动态规划",
  [SolutionMethod.GREEDY]: "贪心算法",
  [SolutionMethod.BACKTRACKING]: "回溯",
  [SolutionMethod.BINARY_SEARCH]: "二分查找",
  [SolutionMethod.TWO_POINTERS]: "双指针",
  [SolutionMethod.SLIDING_WINDOW]: "滑动窗口",
  [SolutionMethod.DIVIDE_CONQUER]: "分治",
  [SolutionMethod.SORTING]: "排序",
  [SolutionMethod.BIT_MANIPULATION]: "位运算",
  [SolutionMethod.DFS]: "深度优先搜索",
  [SolutionMethod.BFS]: "广度优先搜索",
  [SolutionMethod.RECURSION]: "递归",
  [SolutionMethod.ITERATION]: "迭代",
};
