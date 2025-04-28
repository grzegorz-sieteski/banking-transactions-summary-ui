import React from 'react';
import { Client } from '../types/clientTypes';

type DataDisplayProps = {
  data: Client[];
  onEdit: (client: Client) => void;
};

export const DataDisplay: React.FC<DataDisplayProps> = ({ data, onEdit }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-lg w-full">
      <h2 className="text-xl font-semibold text-center text-green-600 mb-4">Clients</h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-green-600 text-white">
            <th className="py-2 px-4 text-left">Name</th>
            <th className="py-2 px-4 text-left">Surname</th>
            <th className="py-2 px-4 text-left">Country</th>
            <th className="py-2 px-4 text-left">Total Balance</th>
            <th className="py-2 px-4 text-left">Currency</th>
            <th className="py-2 px-4 text-left">Date</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((client) => (
            <tr key={client.info.name + client.info.surname} className="border-b hover:bg-gray-100">
              <td className="py-2 px-4">{client.info.name}</td>
              <td className="py-2 px-4">{client.info.surname}</td>
              <td className="py-2 px-4">{client.info.country || 'N/A'}</td>
              <td className="py-2 px-4">{client.balance.total}</td>
              <td className="py-2 px-4">{client.balance.currency}</td>
              <td className="py-2 px-4">{client.balance.date}</td>
              <td className="py-2 px-4">
                <button
                  onClick={() => onEdit(client)}
                  className="bg-green-600 text-white py-1 px-4 rounded hover:bg-green-700"
                >
                  Edit Client
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
