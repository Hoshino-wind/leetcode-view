import { generateTwoSumIISteps } from "./algorithm";
import { motion } from "framer-motion";
import { useVisualization } from "@/hooks/useVisualization";
import { VisualizationLayout } from "@/components/visualizers/VisualizationLayout";
import { Target, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import {
  getNumberVariable,
  getBooleanVariable,
  getArrayVariable,
  StepVariables,
} from "@/types/visualization";

interface TwoSumIIInput {
  numbers: number[];
  target: number;
}

function TwoSumIIVisualizer() {
  const visualization = useVisualization<TwoSumIIInput>(
    (input) => generateTwoSumIISteps(input.numbers, input.target),
    { numbers: [2, 7, 11, 15], target: 9 }
  );

  const data = visualization.currentStepData?.data as { numbers?: number[]; target?: number } || {};
  const { numbers = [], target = 0 } = data;
  const variables = visualization.currentStepData?.variables;
  const left = getNumberVariable(variables, 'left');
  const right = getNumberVariable(variables, 'right');
  const sum = getNumberVariable(variables, 'sum');
  const moveLeft = getBooleanVariable(variables, 'moveLeft');
  const moveRight = getBooleanVariable(variables, 'moveRight');
  const finished = getBooleanVariable(variables, 'finished');
  const result = getArrayVariable(variables, 'result') as number[] | undefined;

  const customVariables = (variables: StepVariables) => {
    const left = getNumberVariable(variables, 'left');
    const right = getNumberVariable(variables, 'right');
    const sum = getNumberVariable(variables, 'sum');
    const target = getNumberVariable(variables, 'target');
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        {left !== undefined && (
          <div>
            <span className="font-mono text-blue-600 font-semibold">left</span>
            <span className="text-gray-500"> = </span>
            <span className="font-mono text-gray-800 font-semibold">{left}</span>
          </div>
        )}
        {right !== undefined && (
          <div>
            <span className="font-mono text-green-600 font-semibold">right</span>
            <span className="text-gray-500"> = </span>
            <span className="font-mono text-gray-800 font-semibold">{right}</span>
          </div>
        )}
        {sum !== undefined && (
          <div>
            <span className="font-mono text-purple-600 font-semibold">sum</span>
            <span className="text-gray-500"> = </span>
            <span className="font-mono text-gray-800 font-semibold">{sum}</span>
          </div>
        )}
        {target !== undefined && (
          <div>
            <span className="font-mono text-orange-600 font-semibold">target</span>
            <span className="text-gray-500"> = </span>
            <span className="font-mono text-gray-800 font-semibold">{target}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <VisualizationLayout
      visualization={visualization}
      inputTypes={[
        { type: "array", key: "numbers", label: "有序数组" },
        { type: "number", key: "target", label: "目标值" },
      ]}
      inputFields={[
        { type: "array", key: "numbers", label: "有序数组 numbers", placeholder: "输入有序数组，如: 2,7,11,15" },
        { type: "number", key: "target", label: "目标值 target", placeholder: "输入目标值，如: 9" },
      ]}
      testCases={[
        { label: "示例 1", value: { numbers: [2, 7, 11, 15], target: 9 } },
        { label: "示例 2", value: { numbers: [2, 3, 4], target: 6 } },
        { label: "示例 3", value: { numbers: [-1, 0], target: -1 } },
        { label: "示例 4", value: { numbers: [1, 2, 3, 4, 5, 6], target: 10 } },
      ]}
      customStepVariables={customVariables}
    >
      <div className="space-y-6">
        {/* 目标值显示 */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border-2 border-orange-200">
          <div className="flex items-center justify-center gap-3">
            <Target className="text-orange-600" size={24} />
            <span className="text-lg font-semibold text-gray-700">目标和：</span>
            <span className="text-3xl font-bold text-orange-600">{target}</span>
          </div>
        </div>

        {/* 数组可视化 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">双指针查找</h3>
          
          <div className="flex gap-2 items-center justify-center flex-wrap">
            {(numbers as number[]).map((num: number, index: number) => {
              const isLeft = left === index;
              const isRight = right === index;
              const inRange = left !== undefined && right !== undefined && index >= left && index <= right;
              const outOfRange = !inRange && !finished;
              
              return (
                <motion.div
                  key={index}
                  className="relative"
                  animate={{
                    scale: isLeft || isRight ? 1.15 : 1,
                    opacity: outOfRange ? 0.3 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className={`w-16 h-16 rounded-lg flex items-center justify-center font-bold text-xl border-2 ${
                      result && (isLeft || isRight)
                        ? 'bg-gradient-to-br from-green-400 to-green-600 text-white border-green-700 shadow-xl'
                        : isLeft
                        ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white border-blue-700 shadow-lg'
                        : isRight
                        ? 'bg-gradient-to-br from-green-400 to-green-600 text-white border-green-700 shadow-lg'
                        : inRange
                        ? 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 border-gray-400'
                        : 'bg-gray-100 text-gray-400 border-gray-200'
                    }`}
                  >
                    {num}
                  </motion.div>
                  
                  {isLeft && !finished && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
                    >
                      <ArrowLeft className="text-blue-600" size={20} />
                      <span className="text-xs font-bold text-blue-600 whitespace-nowrap mt-1">left</span>
                    </motion.div>
                  )}
                  {isRight && !finished && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
                    >
                      <ArrowRight className="text-green-600" size={20} />
                      <span className="text-xs font-bold text-green-600 whitespace-nowrap mt-1">right</span>
                    </motion.div>
                  )}
                  
                  <div className="text-center text-xs text-gray-400 mt-1">{index}</div>
                </motion.div>
              );
            })}
          </div>

          {/* 当前和显示 */}
          {sum !== undefined && !finished && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-purple-50 rounded-lg border-2 border-purple-200 text-center"
            >
              <div className="text-purple-700 font-semibold">
                当前和：<span className="text-2xl font-bold ml-2">{sum}</span>
                <span className="text-gray-500 ml-3">
                  {sum < target ? '< 目标 (左指针右移)' : sum > target ? '> 目标 (右指针左移)' : '= 目标 ✓'}
                </span>
              </div>
            </motion.div>
          )}
        </div>

        {/* 结果显示 */}
        {finished && result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 rounded-2xl p-8 shadow-2xl text-center text-white"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <CheckCircle className="mx-auto mb-4" size={64} strokeWidth={2.5} />
            </motion.div>
            <div className="text-3xl font-bold mb-3">找到答案！</div>
            <div className="text-xl">
              索引：<span className="font-mono text-2xl font-bold">[{result[0]}, {result[1]}]</span>
            </div>
            <div className="mt-2 text-lg opacity-90">
              {numbers[result[0] - 1]} + {numbers[result[1] - 1]} = {target}
            </div>
          </motion.div>
        )}
      </div>
    </VisualizationLayout>
  );
}

export default TwoSumIIVisualizer;
