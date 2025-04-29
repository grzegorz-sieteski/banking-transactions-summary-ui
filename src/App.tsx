import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Client, SummaryClient, Account, ApiResponse } from './types/clientTypes';  // Poprawiony import
import DataForm from './components/DataForm';
import { SummaryDisplay } from './components/SummaryDisplay';
import { ClientList } from './components/ClientList';

function App() {
  const [data, setData] = useState<Client[]>([]);
  const [selected, setSelected] = useState<Client | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<SummaryClient[] | null>(null);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  useEffect(() => {
    axios
      .get<ApiResponse>('http://localhost:8080/bankingtransactions/accounts')
      .then((resp) => {
        const accountsData = resp.data.accounts.map((account: Account) => account.client);  // Typ dla account
        setData(accountsData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = (updated: Client) => {
    const updatedList = data.map(c =>
      c.info.name === updated.info.name && c.info.surname === updated.info.surname ? updated : c
    );

    const updatedAccounts = updatedList.map((client) => ({
      client,
      balance: {
        total: client.balance.total,
        currency: client.balance.currency,
        date: client.balance.date,
      },
      transactions: client.transactions.map((t) => ({
        type: t.type,
        description: t.description,
        date: t.date,
        value: t.value,
        currency: t.currency,
      })),
    }));

    const payload = { accounts: updatedAccounts };

    axios
      .post('http://localhost:8080/bankingtransactions/create-or-update-accounts', payload)
      .then(() => {
        setData(updatedList);
        setSelected(null);
      })
      .catch((err) => setError(err.message));
  };

  const handleSummary = () => {
    const payload = { clients: { client: data } };
    axios
      .post<SummaryClient[]>('http://localhost:8080/bankingtransactions/summary', payload)
      .then(resp => setSummary(resp.data))
      .catch(err => setError(err.message));
  };

  const handleToggleTransactions = (index: number) => {
    setExpandedRows(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-600">Financial Transactions Tracker</h1>

      {!summary && (
        <div className="mb-4 text-center">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handleSummary}
          >
            Summary
          </button>
        </div>
      )}

      {summary ? (
        <>
          <SummaryDisplay summary={summary} />
          <div className="text-center mt-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => setSummary(null)}
            >
              Back to Clients
            </button>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ClientList
            clients={data}
            expandedRows={expandedRows}
            onToggleTransactions={handleToggleTransactions}
            onEdit={(client) => setSelected(client)}
          />

          {selected && (
            <div className="bg-white p-4 shadow-lg rounded-lg">
              <h3 className="text-2xl font-semibold mb-4">Edit Client</h3>
              <DataForm client={selected} onSave={handleSave} onCancel={() => setSelected(null)} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
