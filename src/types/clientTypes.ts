export type Transaction = {
  type: 'income' | 'outcome';
  description: string;
  date: string;
  value: string;
  currency: string;
};

export type Client = {
  info: { name: string; surname: string; country?: string };
  balance: { total: string; currency: string; date: string };
  transactions: Transaction[];
};

export type SummaryClient = {
  info: {
    name: string;
    surname: string;
    country?: string;
  };
  balance: {
    total: string;
    currency: string;
    date: string;
  };
  summary: {
    totalExpenses: string;
    totalRevenues: string;
    totalTurnover: string;
    currency: string;
  };
};
