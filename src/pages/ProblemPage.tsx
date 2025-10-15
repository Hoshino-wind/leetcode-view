import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { getProblemById, problems } from "@/data/problems";
import { Difficulty } from "@/types";
import TwoSumVisualizer from "@/problems/TwoSum/TwoSumVisualizer";
import ReverseLinkedListVisualizer from "@/problems/ReverseLinkedList/ReverseLinkedListVisualizer";
import SolutionSection from "@/components/SolutionSection";

function ProblemPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentId = Number(id);
  const problem = getProblemById(currentId);
  
  // 找到当前题目在列表中的索引
  const currentIndex = problems.findIndex(p => p.id === currentId);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < problems.length - 1;
  
  const handlePrevious = () => {
    if (hasPrevious) {
      navigate(`/problem/${problems[currentIndex - 1].id}`);
    }
  };
  
  const handleNext = () => {
    if (hasNext) {
      navigate(`/problem/${problems[currentIndex + 1].id}`);
    }
  };
  
  const handleComplete = () => {
    // TODO: 实现学完逻辑，可以保存到 localStorage 或状态管理
    alert('恭喜完成本题学习！');
    if (hasNext) {
      handleNext();
    } else {
      navigate('/');
    }
  };

  if (!problem) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">题目未找到</h2>
        <Link to="/" className="text-primary-600 hover:underline">
          返回首页
        </Link>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case Difficulty.EASY:
        return "text-green-600 bg-green-50 border-green-200";
      case Difficulty.MEDIUM:
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case Difficulty.HARD:
        return "text-red-600 bg-red-50 border-red-200";
    }
  };

  const getDifficultyText = (difficulty: Difficulty) => {
    switch (difficulty) {
      case Difficulty.EASY:
        return "简单";
      case Difficulty.MEDIUM:
        return "中等";
      case Difficulty.HARD:
        return "困难";
    }
  };

  return (
    <div className="h-[calc(100vh-80px)]">
      {/* 顶部导航栏 */}
      <div className="px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
          {/* 左侧：返回按钮 */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 transition font-medium"
          >
            <ArrowLeft size={20} />
            <span>返回题目列表</span>
          </Link>
          
          {/* 中间：题目标题 */}
          <div className="flex items-center gap-3">
            <span className="text-gray-500 font-mono text-sm">
              #{problem.leetcodeNumber}
            </span>
            <h2 className="text-lg font-bold text-gray-900">
              {problem.title}
            </h2>
            <span
              className={`px-2 py-1 text-xs font-medium border rounded-full ${getDifficultyColor(
                problem.difficulty
              )}`}
            >
              {getDifficultyText(problem.difficulty)}
            </span>
          </div>
          
          {/* 右侧：导航按钮组 */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevious}
              disabled={!hasPrevious}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
              <span>上一题</span>
            </button>
            
            <button
              onClick={handleComplete}
              className="inline-flex items-center gap-1 px-4 py-1.5 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition shadow-sm"
            >
              <CheckCircle2 size={16} />
              <span>学完</span>
            </button>
            
            <button
              onClick={handleNext}
              disabled={!hasNext}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>下一题</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* 左右分栏布局 */}
      <div className="flex h-[calc(100%-56px)]">
        {/* 左侧：题目描述和题解 */}
        <div className="w-1/2 border-r border-gray-200 overflow-y-auto bg-gray-50">
          <div className="p-6 space-y-6">
            {/* 题目信息 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-2">
                    {problem.category.map((cat) => (
                      <span
                        key={cat}
                        className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </div>

            {/* 示例 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">示例</h3>
              {problem.examples.map((example, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 mb-3">
                  <div className="font-mono text-sm">
                    <div className="mb-2">
                      <span className="text-gray-600 font-semibold">输入：</span>
                      <span className="text-gray-900">{example.input}</span>
                    </div>
                    <div className="mb-2">
                      <span className="text-gray-600 font-semibold">输出：</span>
                      <span className="text-gray-900">{example.output}</span>
                    </div>
                    {example.explanation && (
                      <div>
                        <span className="text-gray-600 font-semibold">解释：</span>
                        <span className="text-gray-900">{example.explanation}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* 约束条件 */}
            {problem.constraints && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">提示</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-2">
                  {problem.constraints.map((constraint, index) => (
                    <li key={index} className="leading-relaxed">{constraint}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 题解部分 - 使用统一配置 */}
            {problem.solution && <SolutionSection solution={problem.solution} />}
          </div>
        </div>

        {/* 右侧：可视化区域 */}
        <div className="w-1/2 bg-white overflow-hidden flex flex-col">
          {problem.id === 1 ? (
            <TwoSumVisualizer />
          ) : problem.id === 2 ? (
            <ReverseLinkedListVisualizer />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              该题目的可视化功能正在开发中...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProblemPage;

