import React, { useState, useEffect } from 'react';
import { Client } from '../types/clientTypes';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

type Props = {
  client: Client;
  onSave: (client: Client) => void;
  onCancel: () => void;
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return '';
  }
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
};

const InputField = ({
  label,
  value,
  onChange,
  disabled = false,
  placeholder = '',
  id,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  placeholder?: string;
  id: string;
}) => (
  <div>
    <label htmlFor={id} className="block font-semibold">{label}</label>
    <input
      id={id}
      className="w-full border p-2 rounded"
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
    />
  </div>
);

const DatePickerField = ({
  label,
  date,
  onChange,
  error = false,
  id,
}: {
  label: string;
  date: string;
  onChange: (date: Date | null) => void;
  error?: boolean;
  id: string;
}) => (
  <div>
    <label htmlFor={id} className="block font-semibold">{label}</label>
    <DatePicker
      id={id}
      selected={new Date(date.split('.').reverse().join('-'))}
      onChange={onChange}
      dateFormat="dd.MM.yyyy"
      className={`w-full border p-2 rounded ${error ? 'border-red-500' : ''}`}
    />
    {error && <span className="text-red-500">Invalid date format</span>}
  </div>
);

const DataForm: React.FC<Props> = ({ client, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Client>(() => ({
    ...client,
    balance: {
      ...client.balance,
      date: formatDate(client.balance.date),
    },
  }));

  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    setFormData({
      ...client,
      balance: {
        ...client.balance,
        date: formatDate(client.balance.date),
      },
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

    if (balanceDateInvalid) {
      setError(true);
      return;
    }

    onSave({
      ...formData,
      balance: {
        ...formData.balance,
        date: formData.balance.date,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField
        id="name"
        label="Name"
        value={formData.info.name}
        onChange={(e) => handleChange('name', e.target.value)}
        disabled
      />
      <InputField
        id="surname"
        label="Surname"
        value={formData.info.surname}
        onChange={(e) => handleChange('surname', e.target.value)}
        disabled
      />
      <InputField
        id="country"
        label="Country"
        value={formData.info.country || ''}
        onChange={(e) => handleChange('country', e.target.value)}
        disabled
      />

      <InputField
        id="balance"
        label="Balance"
        value={formData.balance.total}
        onChange={(e) => handleBalanceChange('total', e.target.value)}
      />
      <InputField
        id="currency"
        label="Currency"
        value={formData.balance.currency}
        onChange={(e) => handleBalanceChange('currency', e.target.value)}
        disabled
      />
      <DatePickerField
        id="balanceDate"
        label="Balance Date"
        date={formData.balance.date}
        onChange={(date) => {
          if (date) {
            const formattedDate = formatDate(date.toString());
            handleBalanceChange('date', formattedDate);
          }
        }}
        error={error}
      />

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

export default DataForm;

