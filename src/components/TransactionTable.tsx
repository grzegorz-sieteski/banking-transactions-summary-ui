import React from 'react';
import { Transaction } from '../types/clientTypes';

type TransactionTableProps = {
  transactions: Transaction[];
};

export const TransactionTable: React.FC<TransactionTableProps> = ({ transactions }) => {
  return (
    <div className="overflow-x-auto p-2">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border">Type</th>
            <th className="px-4 py-2 border">Description</th>
            <th className="px-4 py-2 border">Date</th>
            <th className="px-4 py-2 border">Value</th>
            <th className="px-4 py-2 border">Currency</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, idx) => {
            const typeClass =
              t.type === 'income' ? 'bg-green-200 hover:bg-green-300' : 'bg-red-200 hover:bg-red-300';
            const textClass = t.type === 'income' ? 'text-green-800' : 'text-red-800';

            return (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className={`px-4 py-2 border ${typeClass} ${textClass} font-semibold`}>
                  {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                </td>
                <td className="px-4 py-2 border">{t.description}</td>
                <td className="px-4 py-2 border">{t.date}</td>
                <td className="px-4 py-2 border">{parseFloat(t.value).toFixed(2)}</td>
                <td className="px-4 py-2 border">{t.currency}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
