export type Transaction = {
  type: 'income' | 'outcome';
  description: string;
  date: string;
  value: string;
  currency: string;
};

export type Client = {
  info: { clientId: bigint; name: string; surname: string; country?: string };
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

export type Account = {
  client: Client;
  balance: {
    total: string;
    currency: string;
    date: string;
  };
  transactions: {
    type: string;
    description: string;
    date: string;
    value: string;
    currency: string;
  }[];
};

export interface ApiResponse {
  accounts: Account[];
}
