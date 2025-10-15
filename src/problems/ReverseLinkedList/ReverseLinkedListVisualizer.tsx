import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PlaybackControls from "@/components/controls/PlaybackControls";
import CodeDisplay from "@/components/CodeDisplay";
import { AlgorithmState } from "@/types";
import {
  generateReverseLinkedListSteps,
  defaultTestCases,
  ReverseListState,
  ListNode,
} from "./algorithm";

function ReverseLinkedListVisualizer() {
  const [inputValues, setInputValues] = useState<string>("1,2,3,4,5");
  const [algorithmState, setAlgorithmState] = useState<AlgorithmState>({
    currentStep: 0,
    totalSteps: 0,
    isPlaying: false,
    speed: 1,
    steps: [],
  });
  
  // 是否显示代码区域（简单题目可以关闭）
  const [showCode, setShowCode] = useState<boolean>(false);

  const code = `function reverseList(head: ListNode | null): ListNode | null {
  let prev: ListNode | null = null;
  let curr: ListNode | null = head;
  
  while (curr !== null) {
    const next = curr.next;
    curr.next = prev;
    prev = curr;
    curr = next;
  }
  
  return prev;
}`;

  // 初始化步骤
  useEffect(() => {
    handleGenerateSteps();
  }, []);

  const handleGenerateSteps = () => {
    const values = inputValues
      .split(",")
      .map((v) => parseInt(v.trim()))
      .filter((v) => !isNaN(v));

    const steps = generateReverseLinkedListSteps(values);
    setAlgorithmState({
      currentStep: 0,
      totalSteps: steps.length,
      isPlaying: false,
      speed: algorithmState.speed,
      steps,
    });
  };

  // 自动播放
  useEffect(() => {
    if (!algorithmState.isPlaying) return;

    const interval = setInterval(() => {
      setAlgorithmState((prev) => {
        if (prev.currentStep >= prev.totalSteps - 1) {
          return { ...prev, isPlaying: false };
        }
        return { ...prev, currentStep: prev.currentStep + 1 };
      });
    }, 1000 / algorithmState.speed);

    return () => clearInterval(interval);
  }, [algorithmState.isPlaying, algorithmState.speed]);

  useEffect(() => {
    if (algorithmState.currentStep >= algorithmState.totalSteps - 1) {
      setAlgorithmState((prev) => ({ ...prev, isPlaying: false }));
    }
  }, [algorithmState.currentStep, algorithmState.totalSteps]);

  const handlePlay = () => {
    if (algorithmState.currentStep >= algorithmState.totalSteps - 1) {
      setAlgorithmState((prev) => ({ ...prev, currentStep: 0 }));
    }
    setAlgorithmState((prev) => ({ ...prev, isPlaying: true }));
  };

  const handlePause = () => 
    setAlgorithmState((prev) => ({ ...prev, isPlaying: false }));
  
  const handleStepForward = () => 
    setAlgorithmState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, prev.totalSteps - 1),
    }));
  
  const handleStepBackward = () =>
    setAlgorithmState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
    }));
  
  const handleReset = () =>
    setAlgorithmState((prev) => ({
      ...prev,
      currentStep: 0,
      isPlaying: false,
    }));

  const currentStepData = algorithmState.steps[algorithmState.currentStep];
  const state = currentStepData?.data as ReverseListState;

  return (
    <div className="flex flex-col h-full">
      {/* 播放控制栏 */}
      {algorithmState.steps.length > 0 && (
        <PlaybackControls
          currentStep={algorithmState.currentStep}
          totalSteps={algorithmState.totalSteps}
          isPlaying={algorithmState.isPlaying}
          speed={algorithmState.speed}
          onPlay={handlePlay}
          onPause={handlePause}
          onReset={handleReset}
          onStepForward={handleStepForward}
          onStepBackward={handleStepBackward}
          onSpeedChange={(speed) =>
            setAlgorithmState((prev) => ({ ...prev, speed }))
          }
        />
      )}

      {/* 可视化区域 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* 测试用例 */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">测试用例</h3>
            <button
              onClick={handleGenerateSteps}
              className="px-4 py-2 bg-gradient-to-r from-primary-500 to-blue-500 hover:from-primary-600 hover:to-blue-600 text-white rounded-lg transition text-sm font-medium shadow-sm hover:shadow"
            >
              生成步骤
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              链表节点值:
            </label>
            <input
              type="text"
              value={inputValues}
              onChange={(e) => setInputValues(e.target.value)}
              placeholder="输入节点值，用逗号分隔，如: 1,2,3,4,5"
              className="w-full px-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent font-mono bg-white text-gray-800 font-semibold"
            />
          </div>
          <div className="flex gap-2 flex-wrap mt-3">
            {defaultTestCases.map((testCase, index) => (
              <button
                key={index}
                onClick={() => {
                  setInputValues(testCase.values.join(","));
                  setTimeout(handleGenerateSteps, 0);
                }}
                className="px-3 py-1 bg-white text-primary-700 text-sm rounded-md hover:bg-blue-100 transition border border-blue-200 font-medium"
              >
                {testCase.label}
              </button>
            ))}
          </div>
        </div>
        {/* 执行步骤说明 */}
        {currentStepData && (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
              <div className="flex-1">
                <p className="text-gray-800 font-medium leading-relaxed">
                  {currentStepData.description}
                </p>
                {currentStepData.variables && Object.keys(currentStepData.variables).length > 0 && (
                  <div className="mt-3 bg-white rounded-lg p-4 border border-amber-100">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      当前变量：
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {Object.entries(currentStepData.variables).map(([key, value]) => (
                        <div key={key} className="text-sm">
                          <span className="font-mono text-blue-600 font-semibold">{key}</span>
                          <span className="text-gray-500"> = </span>
                          <span className="font-mono text-gray-800 font-semibold">
                            {JSON.stringify(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 链表可视化 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">链表可视化 - 三指针迭代法</h3>
            {/* 代码切换按钮 */}
            <button
              onClick={() => setShowCode(!showCode)}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition flex items-center gap-2"
            >
              {showCode ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                  隐藏代码
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  查看代码
                </>
              )}
            </button>
          </div>
          {state && state.nodes.length > 0 ? (
            <div className="flex flex-col items-center space-y-8">
              {/* 链表节点 */}
              <div className="bg-gradient-to-b from-gray-50 to-white p-6 rounded-lg border border-gray-100 w-full">
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <AnimatePresence mode="sync">
                    {state.nodes.map((node, index) => (
                      <LinkedListNodeComponent
                        key={`node-${index}`}
                        node={node}
                        index={index}
                        isPrev={index === state.prevIndex}
                        isCurr={index === state.currIndex}
                        isNext={index === state.nextIndex}
                        isComplete={state.isComplete}
                        allNodes={state.nodes}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* 图例 */}
              <div className="flex gap-6 items-center justify-center flex-wrap text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-t from-blue-500 to-blue-400 rounded"></div>
                  <span className="text-gray-700">prev 指针</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-t from-green-500 to-green-400 rounded"></div>
                  <span className="text-gray-700">curr 指针</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gradient-to-t from-orange-500 to-orange-400 rounded"></div>
                  <span className="text-gray-700">next 指针</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-500">
              空链表
            </div>
          )}
        </div>

        {/* 代码显示（可选） */}
        {showCode && (
          <CodeDisplay
            code={code}
            language="typescript"
            title="双指针迭代法（TypeScript）"
            highlightedLines={
              currentStepData?.code
                ? code.split("\n").map((line, index) => 
                    currentStepData.code?.includes(line.trim()) ? index + 1 : -1
                  ).filter(n => n > 0)
                : []
            }
          />
        )}
      </div>
    </div>
  );
}

// 链表节点组件
interface LinkedListNodeProps {
  node: ListNode;
  index: number;
  isPrev: boolean;
  isCurr: boolean;
  isNext: boolean;
  isComplete: boolean;
  allNodes: ListNode[];
}

function LinkedListNodeComponent({
  node,
  index,
  isPrev,
  isCurr,
  isNext,
  isComplete,
  allNodes,
}: LinkedListNodeProps) {
  const getNodeColor = () => {
    if (isPrev) return "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100";
    if (isCurr) return "border-green-500 bg-gradient-to-br from-green-50 to-green-100";
    if (isNext) return "border-orange-500 bg-gradient-to-br from-orange-50 to-orange-100";
    return "border-gray-300 bg-white";
  };

  const getIndicatorColor = () => {
    if (isPrev) return "bg-gradient-to-t from-blue-500 to-blue-400";
    if (isCurr) return "bg-gradient-to-t from-green-500 to-green-400";
    if (isNext) return "bg-gradient-to-t from-orange-500 to-orange-400";
    return "bg-gray-400";
  };

  const getIndicatorLabel = () => {
    if (isPrev) return "prev";
    if (isCurr) return "curr";
    if (isNext) return "next";
    return "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex items-center gap-2"
    >
      {/* 节点 */}
      <div className="flex flex-col items-center">
        {/* 指针标签 */}
        {(isPrev || isCurr || isNext) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-2 px-2 py-1 rounded text-xs font-bold text-white ${getIndicatorColor()}`}
          >
            {getIndicatorLabel()}
          </motion.div>
        )}

        {/* 节点方框 */}
        <motion.div
          animate={{
            scale: isPrev || isCurr || isNext ? 1.1 : 1,
            borderWidth: isPrev || isCurr || isNext ? 3 : 2,
          }}
          className={`w-16 h-16 border-2 rounded-lg flex items-center justify-center text-xl font-bold transition-all ${getNodeColor()}`}
        >
          {node.val}
        </motion.div>

        {/* 索引 */}
        <div className="mt-1 text-xs text-gray-500">[{index}]</div>
      </div>

      {/* 箭头 */}
      {node.next !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center"
        >
          <svg width="40" height="24" className="mt-6">
            <defs>
              <marker
                id={`arrowhead-${index}`}
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3, 0 6"
                  fill={
                    node.next < index
                      ? "#10b981"
                      : "#6b7280"
                  }
                />
              </marker>
            </defs>
            <line
              x1="0"
              y1="12"
              x2="30"
              y2="12"
              stroke={
                node.next < index
                  ? "#10b981"
                  : "#6b7280"
              }
              strokeWidth="2"
              markerEnd={`url(#arrowhead-${index})`}
            />
          </svg>
          {node.next < index && (
            <div className="text-xs text-green-600 font-semibold -mt-1">
              已反转
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

export default ReverseLinkedListVisualizer;
