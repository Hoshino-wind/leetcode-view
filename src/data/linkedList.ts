import { Problem, Difficulty, Category, SolutionMethod } from "@/types";

/**
 * 链表类题目数据
 */
export const linkedListProblems: Problem[] = [
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
      keyLines: [6, 7, 8, 9],
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
  {
    id: 12,
    leetcodeNumber: 21,
    title: "合并两个有序链表",
    difficulty: Difficulty.EASY,
    category: [Category.LINKED_LIST],
    methods: [SolutionMethod.TWO_POINTERS, SolutionMethod.ITERATION],
    description: `将两个升序链表合并为一个新的升序链表并返回。新链表是通过拼接给定的两个链表的所有节点组成的。`,
    examples: [
      {
        input: "list1 = [1,2,4], list2 = [1,3,4]",
        output: "[1,1,2,3,4,4]",
      },
      {
        input: "list1 = [], list2 = []",
        output: "[]",
      },
      {
        input: "list1 = [], list2 = [0]",
        output: "[0]",
      },
    ],
    constraints: [
      "两个链表的节点数目范围是 [0, 50]",
      "-100 <= Node.val <= 100",
      "list1 和 list2 均按非递减顺序排列",
    ],
    hints: [
      "使用双指针分别指向两个链表",
      "每次选择较小的节点加入结果链表",
      "注意处理链表为空的情况",
    ],
    solution: {
      methodName: "迭代法（双指针）",
      methodDescription:
        "使用双指针分别遍历两个链表，每次选择较小的节点加入结果链表，直到某个链表遍历完，然后将剩余节点直接连接。",
      code: `function mergeTwoLists(list1: ListNode | null, list2: ListNode | null): ListNode | null {
  const dummy = new ListNode();
  let current = dummy;
  
  while (list1 !== null && list2 !== null) {
    if (list1.val <= list2.val) {
      current.next = list1;
      list1 = list1.next;
    } else {
      current.next = list2;
      list2 = list2.next;
    }
    current = current.next;
  }
  
  current.next = list1 !== null ? list1 : list2;
  return dummy.next;
}`,
      language: "typescript",
      keyLines: [6, 7, 10, 15],
      steps: [
        "创建哑节点 dummy，简化边界处理",
        "当两个链表都不为空时循环：",
        "  • 比较两个链表当前节点的值",
        "  • 将较小的节点加入结果链表",
        "  • 移动对应链表的指针",
        "将剩余的非空链表直接连接到结果链表",
        "返回 dummy.next（跳过哑节点）",
      ],
      advantages: [
        "简单直观：逻辑清晰易懂",
        "时间最优：O(n+m) 一次遍历",
        "空间优化：O(1) 只使用指针",
      ],
      timeComplexity: {
        value: "O(n + m)",
        description: "需要遍历两个链表的所有节点",
      },
      spaceComplexity: {
        value: "O(1)",
        description: "只使用了常数个指针变量",
      },
      comparisons: [
        {
          name: "迭代法",
          description: "使用双指针逐个比较合并",
          timeComplexity: "O(n + m)",
          spaceComplexity: "O(1)",
          isRecommended: true,
          pros: ["最优解法", "空间效率高"],
          cons: ["需要处理边界情况"],
        },
        {
          name: "递归法",
          description: "递归比较并连接节点",
          timeComplexity: "O(n + m)",
          spaceComplexity: "O(n + m)",
          isRecommended: false,
          pros: ["代码简洁"],
          cons: ["递归栈空间开销"],
        },
      ],
    },
  },
];
