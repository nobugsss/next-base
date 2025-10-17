'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CalendarPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState(new Date().getDate());

  // 生成年份选项
  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 50 + i);
  
  // 月份选项
  const months = [
    { value: 1, name: '一月' },
    { value: 2, name: '二月' },
    { value: 3, name: '三月' },
    { value: 4, name: '四月' },
    { value: 5, name: '五月' },
    { value: 6, name: '六月' },
    { value: 7, name: '七月' },
    { value: 8, name: '八月' },
    { value: 9, name: '九月' },
    { value: 10, name: '十月' },
    { value: 11, name: '十一月' },
    { value: 12, name: '十二月' }
  ];

  // 获取月份的天数
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  // 获取月份第一天是星期几
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay();
  };

  // 格式化日期为 MM/DD/YYYY
  const formatDate = (year: number, month: number, day: number) => {
    const date = new Date(year, month - 1, day);
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const yyyy = year;
    return `${mm}/${dd}/${yyyy}`;
  };

  // 获取星期几
  const getDayOfWeek = (year: number, month: number, day: number) => {
    const date = new Date(year, month - 1, day);
    const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return days[date.getDay()];
  };

  // 生成日历网格
  const generateCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
    const firstDay = getFirstDayOfMonth(selectedYear, selectedMonth);
    const days = [];

    // 添加空白单元格
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // 添加日期
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const calendarDays = generateCalendarGrid();
  const selectedDateFormatted = formatDate(selectedYear, selectedMonth, selectedDate);
  const selectedDayOfWeek = getDayOfWeek(selectedYear, selectedMonth, selectedDate);

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

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-8">
            📅 日历
          </h1>

          {/* 日期选择器 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              选择日期
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  年份
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  月份
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {months.map(month => (
                    <option key={month.value} value={month.value}>{month.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  日期
                </label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: getDaysInMonth(selectedYear, selectedMonth) }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 选中的日期显示 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              选中的日期
            </h2>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {selectedDateFormatted}
              </div>
              <div className="text-lg text-gray-600 dark:text-gray-300">
                {selectedDayOfWeek}
              </div>
            </div>
          </div>

          {/* 日历网格 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
              {selectedYear}年 {months[selectedMonth - 1].name}
            </h2>
            <div className="grid grid-cols-7 gap-2">
              {/* 星期标题 */}
              {['日', '一', '二', '三', '四', '五', '六'].map(day => (
                <div key={day} className="text-center font-semibold text-gray-600 dark:text-gray-400 py-2">
                  {day}
                </div>
              ))}
              
              {/* 日期网格 */}
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`aspect-square flex items-center justify-center rounded-md transition-colors duration-200 ${
                    day === null
                      ? 'bg-transparent'
                      : day === selectedDate
                      ? 'bg-blue-500 text-white font-bold'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer'
                  }`}
                  onClick={() => day && setSelectedDate(day)}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
