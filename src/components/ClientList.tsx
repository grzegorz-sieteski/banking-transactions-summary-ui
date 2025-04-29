import React from 'react';
import { Client } from '../types/clientTypes';
import { TransactionTable } from './TransactionTable';

type ClientListProps = {
  clients: Client[];
  expandedRows: number[];
  onToggleTransactions: (index: number) => void;
  onEdit: (client: Client) => void;
};

export const ClientList: React.FC<ClientListProps> = ({ clients, expandedRows, onToggleTransactions, onEdit }) => {
  return (
    <div className="overflow-auto bg-white shadow-lg rounded-lg">
      <table className="min-w-full table-auto">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Surname</th>
            <th className="px-4 py-2">Country</th>
            <th className="px-4 py-2">Balance</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, index) => (
            <React.Fragment key={index}>
              <tr className="border-t">
                <td className="px-4 py-2">{client.info.name}</td>
                <td className="px-4 py-2">{client.info.surname}</td>
                <td className="px-4 py-2">{client.info.country || 'N/A'}</td>
                <td className="px-4 py-2">{client.balance.total} {client.balance.currency}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => onToggleTransactions(index)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    {expandedRows.includes(index) ? 'Hide Transactions' : 'Show Transactions'}
                  </button>
                  <button
                    onClick={() => onEdit(client)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                </td>
              </tr>

              {expandedRows.includes(index) && (
                <tr className="border-t">
                  <td colSpan={5}>
                    <TransactionTable transactions={client.transactions} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
