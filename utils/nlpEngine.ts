import { ParsedInput, TransactionType } from '../types';
import { CATEGORY_KEYWORDS, PAYMENT_KEYWORDS } from '../constants';

export const parseFinancialInput = (input: string): ParsedInput => {
  const lowerInput = input.toLowerCase();
  
  // 1. Extract Amount (Looks for numbers, optionally with comma/dot)
  const amountRegex = /(\d+([.,]\d{1,2})?)/g;
  const numbers = input.match(amountRegex);
  let amount: number | null = null;
  
  // Basic logic: largest number is likely the amount, unless it looks like a year (e.g., 2024)
  if (numbers) {
    const validNumbers = numbers.map(n => parseFloat(n.replace(',', '.'))).filter(n => n < 1900 || n > 2100); 
    if (validNumbers.length > 0) {
        amount = Math.max(...validNumbers);
    } else if (numbers.length > 0) {
        // Fallback if only year-like numbers exist
        amount = parseFloat(numbers[0].replace(',', '.'));
    }
  }

  // 2. Extract Description (Remove amount and known keywords later, strictly speaking just raw input for now minus amounts)
  let description = input; 
  // Refinement usually happens by removing detected entities, but we'll keep it simple for display

  // 3. Detect Category
  let category: string | null = null;
  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(k => lowerInput.includes(k))) {
      category = cat;
      break;
    }
  }

  // 4. Detect Payment Method
  let paymentMethod: string | null = null;
  for (const [method, keywords] of Object.entries(PAYMENT_KEYWORDS)) {
    if (keywords.some(k => lowerInput.includes(k))) {
      paymentMethod = method;
      break;
    }
  }

  // 5. Detect Type (Income/Expense)
  let type: TransactionType = 'EXPENSE';
  if (lowerInput.includes('recebi') || lowerInput.includes('ganhei') || lowerInput.includes('salario') || lowerInput.includes('pagamento')) {
    type = 'INCOME';
  } else if (lowerInput.includes('transferi') || lowerInput.includes('enviei')) {
    type = 'TRANSFER';
  }

  // 6. Calculate Confidence
  let confidence = 0;
  if (amount !== null) confidence += 0.4;
  if (category !== null) confidence += 0.3;
  if (paymentMethod !== null) confidence += 0.3;

  // Cleanup description to be "Remaining words" (Simple heuristic)
  if (amount) {
     description = description.replace(amount.toString(), '').replace(',', '.').trim();
     // Remove keywords from description to make it cleaner
     if (category) {
         CATEGORY_KEYWORDS[category].forEach(k => {
             const reg = new RegExp(`\\b${k}\\b`, 'gi');
             description = description.replace(reg, '');
         });
     }
     if (paymentMethod) {
         PAYMENT_KEYWORDS[paymentMethod].forEach(k => {
             const reg = new RegExp(`\\b${k}\\b`, 'gi');
             description = description.replace(reg, '');
         });
     }
     description = description.replace(/\s+/g, ' ').trim();
     if (description.length === 0 && category) description = category;
  }

  return {
    amount,
    description: description || (category ?? 'Despesa'),
    category,
    paymentMethod,
    type,
    confidence
  };
};
