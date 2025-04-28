import React, { useState, useEffect } from 'react';
import { Client, Transaction } from '../types/clientTypes';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  client: Client;
  onSave: (client: Client) => void;
  onCancel: () => void;
};

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return '';
  }
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`; // Return in dd.MM.yyyy format
}

export const DataForm: React.FC<Props> = ({ client, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Client>(() => ({
    ...client,
    balance: {
      ...client.balance,
      date: formatDate(client.balance.date),
    },
    transactions: client.transactions.map((t) => ({
      ...t,
      date: formatDate(t.date),
    })),
  }));

  const [errors, setErrors] = useState<{
    balanceDate?: boolean;
    transactionsDates?: boolean[];
  }>({
    balanceDate: false,
    transactionsDates: [],
  });

  useEffect(() => {
    setFormData({
      ...client,
      balance: {
        ...client.balance,
        date: formatDate(client.balance.date),
      },
      transactions: client.transactions.map((t) => ({
        ...t,
        date: formatDate(t.date),
      })),
    });
  }, [client]);

  const handleChange = (field: keyof Client['info'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      info: {
        ...prev.info,
        [field]: value,
      },
    }));
  };

  const handleTransactionChange = (index: number, field: keyof Transaction, value: string) => {
    const updatedTransactions = [...formData.transactions];
    updatedTransactions[index] = {
      ...updatedTransactions[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      transactions: updatedTransactions,
    }));
  };

  const handleBalanceChange = (field: keyof Client['balance'], value: string) => {
    setFormData((prev) => ({
      ...prev,
      balance: {
        ...prev.balance,
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const balanceDateInvalid = !formData.balance.date.match(/^\d{2}\.\d{2}\.\d{4}$/);
    const transactionsDatesInvalid = formData.transactions.map((t) => !t.date.match(/^\d{2}\.\d{2}\.\d{4}$/));

    if (balanceDateInvalid || transactionsDatesInvalid.includes(true)) {
      setErrors({
        balanceDate: balanceDateInvalid,
        transactionsDates: transactionsDatesInvalid,
      });
      return;
    }

    onSave({
      ...formData,
      balance: {
        ...formData.balance,
        date: formData.balance.date,
      },
      transactions: formData.transactions.map((t) => ({
        ...t,
        date: t.date,
      })),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-semibold">Name</label>
        <input
          className="w-full border p-2 rounded"
          value={formData.info.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />
      </div>

      <div>
        <label className="block font-semibold">Surname</label>
        <input
          className="w-full border p-2 rounded"
          value={formData.info.surname}
          onChange={(e) => handleChange('surname', e.target.value)}
        />
      </div>

      <div>
        <label className="block font-semibold">Country</label>
        <input
          className="w-full border p-2 rounded"
          value={formData.info.country || ''}
          onChange={(e) => handleChange('country', e.target.value)}
        />
      </div>

      <div>
        <label className="block font-semibold">Balance</label>
        <input
          className="w-full border p-2 rounded"
          value={formData.balance.total}
          onChange={(e) => handleBalanceChange('total', e.target.value)}
        />
      </div>

      <div>
        <label className="block font-semibold">Currency</label>
        <input
          className="w-full border p-2 rounded"
          value={formData.balance.currency}
          onChange={(e) => handleBalanceChange('currency', e.target.value)}
        />
      </div>

      <div>
        <label className="block font-semibold">Balance Date</label>
        <DatePicker
          selected={new Date(formData.balance.date.split('.').reverse().join('-'))} // Invert the format
          onChange={(date: Date | null) => {
            if (date) {
              const formattedDate = formatDate(date.toString());
              handleBalanceChange('date', formattedDate);
            }
          }}
          dateFormat="dd.MM.yyyy"
          className={`w-full border p-2 rounded ${errors.balanceDate ? 'border-red-500' : ''}`}
        />
        {errors.balanceDate && <span className="text-red-500">Invalid date format</span>}
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Transactions</h3>
        {formData.transactions.map((t: Transaction, index) => (
          <div key={index} className="border p-4 rounded mb-2">
            <input
              className="w-full border p-2 rounded mb-2"
              placeholder="Description"
              value={t.description}
              onChange={(e) => handleTransactionChange(index, 'description', e.target.value)}
            />
            <select
              className="w-full border p-2 rounded mb-2"
              value={t.type}
              onChange={(e) => handleTransactionChange(index, 'type', e.target.value)}
            >
              <option value="income">Income</option>
              <option value="outcome">Outcome</option>
            </select>
            <DatePicker
              selected={new Date(t.date.split('.').reverse().join('-'))} // Invert the format
              onChange={(date: Date | null) => {
                if (date) {
                  const formattedDate = formatDate(date.toString());
                  handleTransactionChange(index, 'date', formattedDate);
                }
              }}
              dateFormat="dd.MM.yyyy"
              className={`w-full border p-2 rounded mb-2 ${errors.transactionsDates && errors.transactionsDates[index] ? 'border-red-500' : ''}`}
            />
            {errors.transactionsDates && errors.transactionsDates[index] && <span className="text-red-500">Invalid date format</span>}
            <input
              className="w-full border p-2 rounded mb-2"
              placeholder="Value"
              value={t.value}
              onChange={(e) => handleTransactionChange(index, 'value', e.target.value)}
            />
            <input
              className="w-full border p-2 rounded"
              placeholder="Currency"
              value={t.currency}
              onChange={(e) => handleTransactionChange(index, 'currency', e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
