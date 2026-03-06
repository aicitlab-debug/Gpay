
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, SpendingInsight } from "../types";

export const getFinancialInsights = async (transactions: Transaction[]): Promise<SpendingInsight> => {
  // Fix: Use process.env.API_KEY directly as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const transactionsContext = transactions.map(t => 
    `${t.date}: ${t.merchant} (${t.category}) - ${t.type === 'debit' ? '-' : '+'}$${t.amount}`
  ).join('\n');

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze these transactions and provide financial insights in JSON format:
    ${transactionsContext}
    
    The response must follow this schema:
    {
      "summary": "A 2-sentence executive summary of spending patterns.",
      "tips": ["3 actionable financial tips based on data"],
      "totalSpent": total_debit_amount,
      "topCategory": "the category with highest spending"
    }`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          tips: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          totalSpent: { type: Type.NUMBER },
          topCategory: { type: Type.STRING }
        },
        required: ["summary", "tips", "totalSpent", "topCategory"]
      }
    }
  });

  try {
    // response.text is a property, not a method.
    return JSON.parse(response.text || '{}') as SpendingInsight;
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    return {
      summary: "We couldn't analyze your data at this moment.",
      tips: ["Check back later for AI insights."],
      totalSpent: transactions.filter(t => t.type === 'debit').reduce((acc, curr) => acc + curr.amount, 0),
      topCategory: "Unknown"
    };
  }
};
