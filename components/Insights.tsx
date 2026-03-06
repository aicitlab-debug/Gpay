
import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Lightbulb, TrendingDown, Target } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Transaction, SpendingInsight } from '../types';
import { getFinancialInsights } from '../services/geminiService';
import { CATEGORY_COLORS } from '../constants';

interface InsightsProps {
  transactions: Transaction[];
}

const Insights: React.FC<InsightsProps> = ({ transactions }) => {
  const [insight, setInsight] = useState<SpendingInsight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      const data = await getFinancialInsights(transactions);
      setInsight(data);
      setLoading(false);
    };
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fix: Explicitly cast value to number to avoid 'unknown' type issues in the render method
  const categoryData = Object.entries(
    transactions
      .filter(t => t.type === 'debit')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value: value as number }));

  return (
    <div className="flex flex-col p-6 animate-in slide-in-from-left duration-300 gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Insights</h2>
        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          <Sparkles size={16} className="text-blue-600" />
          <span className="text-xs font-bold text-blue-700 uppercase">AI Powered</span>
        </div>
      </div>

      {/* Spending Chart */}
      <div className="bg-white rounded-3xl p-6 google-shadow border border-gray-100">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Spending breakdown</h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[entry.name] || '#ccc'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {categoryData.slice(0, 4).map((cat) => (
            <div key={cat.name} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[cat.name] || '#ccc' }}></div>
              <span className="text-xs text-gray-600 truncate">{cat.name}: ${cat.value.toFixed(0)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Summary */}
      <div className="bg-blue-600 rounded-3xl p-6 text-white google-shadow relative overflow-hidden">
        <Brain className="absolute -right-4 -bottom-4 opacity-10 w-32 h-32" />
        <div className="flex items-center gap-2 mb-3">
          <Brain size={20} />
          <h3 className="font-bold">Gemini Analysis</h3>
        </div>
        {loading ? (
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-white/20 rounded animate-pulse w-full"></div>
            <div className="h-4 bg-white/20 rounded animate-pulse w-3/4"></div>
          </div>
        ) : (
          <p className="text-sm leading-relaxed opacity-90">{insight?.summary}</p>
        )}
      </div>

      {/* AI Tips */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold text-gray-800">Smart Tips</h3>
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse"></div>
          ))
        ) : (
          insight?.tips.map((tip, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 google-shadow flex items-start gap-4 hover:border-blue-200 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0">
                <Lightbulb size={20} />
              </div>
              <p className="text-sm text-gray-700 font-medium pt-1">{tip}</p>
            </div>
          ))
        )}
      </div>

      {/* Budget Goal Section */}
      <div className="bg-green-50 rounded-3xl p-6 border border-green-100 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-green-700 uppercase tracking-widest">Savings Goal</span>
          <span className="text-xl font-bold text-green-900">$1,200 of $2,000</span>
          <div className="w-full h-2 bg-green-200 rounded-full mt-2 overflow-hidden">
            <div className="bg-green-600 h-full w-[60%]"></div>
          </div>
        </div>
        <Target className="text-green-600" size={32} />
      </div>
    </div>
  );
};

export default Insights;
