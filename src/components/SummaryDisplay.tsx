import React from 'react';

type SummaryClient = {
  info: { name: string; surname: string; country?: string };
  balance: { total: string; currency: string; date: string };
  summary: { totalExpenses: string; totalRevenues: string; totalTurnover: string; currency: string };
};

type SummaryDisplayProps = {
  summary: SummaryClient[];
};

export const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ summary }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold text-green-600">Summary Report</h2>
      </div>

      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-green-600 text-white">
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Balance</th>
            <th className="px-6 py-3 text-left">Total Expenses</th>
            <th className="px-6 py-3 text-left">Total Revenues</th>
            <th className="px-6 py-3 text-left">Total Turnover</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((client, index) => (
            <tr key={index} className="border-t hover:bg-gray-100">
              <td className="px-6 py-3">{client.info.name} {client.info.surname}</td>
              <td className="px-6 py-3">{client.balance.total} {client.balance.currency}</td>
              <td className="px-6 py-3">{client.summary.totalExpenses} {client.summary.currency}</td>
              <td className="px-6 py-3">{client.summary.totalRevenues} {client.summary.currency}</td>
              <td className="px-6 py-3">{client.summary.totalTurnover} {client.summary.currency}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

