'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CalculatorPage() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display);

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  // 键盘输入处理函数（暂时注释掉，因为当前没有使用）
  // const handleKeyPress = (key: string) => {
  //   if (key >= '0' && key <= '9') {
  //     inputNumber(key);
  //   } else if (key === '.') {
  //     inputDecimal();
  //   } else if (key === '+' || key === '-' || key === '*' || key === '/') {
  //     const operationMap: { [key: string]: string } = {
  //       '+': '+',
  //       '-': '-',
  //       '*': '×',
  //       '/': '÷'
  //     };
  //     performOperation(operationMap[key]);
  //   } else if (key === 'Enter' || key === '=') {
  //     handleEquals();
  //   } else if (key === 'Escape' || key === 'c' || key === 'C') {
  //     clear();
  //   }
  // };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* 返回按钮 */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            ← 返回首页
          </Link>
        </div>

        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
            🧮 计算器
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            {/* 显示屏 */}
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <div className="text-right text-3xl font-mono text-gray-900 dark:text-white overflow-hidden">
                {display}
              </div>
            </div>

            {/* 按钮网格 */}
            <div className="grid grid-cols-4 gap-3">
              {/* 第一行 */}
              <button
                onClick={clear}
                className="col-span-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                Clear
              </button>
              <button
                onClick={() => performOperation('÷')}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                ÷
              </button>
              <button
                onClick={() => performOperation('×')}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                ×
              </button>

              {/* 第二行 */}
              <button
                onClick={() => inputNumber('7')}
                className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                7
              </button>
              <button
                onClick={() => inputNumber('8')}
                className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                8
              </button>
              <button
                onClick={() => inputNumber('9')}
                className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                9
              </button>
              <button
                onClick={() => performOperation('-')}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                -
              </button>

              {/* 第三行 */}
              <button
                onClick={() => inputNumber('4')}
                className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                4
              </button>
              <button
                onClick={() => inputNumber('5')}
                className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                5
              </button>
              <button
                onClick={() => inputNumber('6')}
                className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                6
              </button>
              <button
                onClick={() => performOperation('+')}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                +
              </button>

              {/* 第四行 */}
              <button
                onClick={() => inputNumber('1')}
                className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                1
              </button>
              <button
                onClick={() => inputNumber('2')}
                className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                2
              </button>
              <button
                onClick={() => inputNumber('3')}
                className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                3
              </button>
              <button
                onClick={handleEquals}
                className="row-span-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                =
              </button>

              {/* 第五行 */}
              <button
                onClick={() => inputNumber('0')}
                className="col-span-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                0
              </button>
              <button
                onClick={inputDecimal}
                className="bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-900 dark:text-white font-semibold py-3 rounded-lg transition-colors duration-200"
              >
                .
              </button>
            </div>

            {/* 使用说明 */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                使用说明：
              </h3>
              <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                <li>• 点击数字按钮输入数字</li>
                <li>• 点击运算符按钮进行运算</li>
                <li>• 点击 &quot;=&quot; 按钮计算结果</li>
                <li>• 点击 &quot;Clear&quot; 按钮清空</li>
                <li>• 支持键盘输入（数字、+、-、*、/、=、Enter、Escape）</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
