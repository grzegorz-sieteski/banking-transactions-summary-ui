import React, { useReducer, useEffect } from 'react';
import { fetchAccounts, updateAccounts, fetchSummary } from './apiService';
import DataForm from './components/DataForm';
import { SummaryDisplay } from './components/SummaryDisplay';
import { ClientList } from './components/ClientList';
import { Client, SummaryClient } from './types/clientTypes';

type State = {
  data: Client[];
  selected: Client | null;
  loading: boolean;
  error: string | null;
  summary: SummaryClient[] | null;
  expandedRows: number[];
};

type Action =
  | { type: 'SET_DATA'; payload: Client[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SELECTED'; payload: Client | null }
  | { type: 'SET_SUMMARY'; payload: SummaryClient[] | null }
  | { type: 'TOGGLE_ROW'; payload: number };

const initialState: State = {
  data: [],
  selected: null,
  loading: true,
  error: null,
  summary: null,
  expandedRows: [],
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_SELECTED':
      return { ...state, selected: action.payload };
    case 'SET_SUMMARY':
      return { ...state, summary: action.payload };
    case 'TOGGLE_ROW':
      return {
        ...state,
        expandedRows: state.expandedRows.includes(action.payload)
          ? state.expandedRows.filter(row => row !== action.payload)
          : [...state.expandedRows, action.payload],
      };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    (async () => {
      try {
        const clients = await fetchAccounts();
        dispatch({ type: 'SET_DATA', payload: clients });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    })();
  }, []);

  const handleSave = async (updated: Client): Promise<void> => {
    try {
      const updatedList = state.data.map((client: Client) =>
        client.info.name === updated.info.name && client.info.surname === updated.info.surname
          ? updated
          : client
      );

      const updatedAccounts = updatedList.map((client: Client) => ({
        client,
        balance: client.balance,
        transactions: client.transactions,
      }));

      await updateAccounts({ accounts: updatedAccounts });
      dispatch({ type: 'SET_DATA', payload: updatedList });
      dispatch({ type: 'SET_SELECTED', payload: null });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const handleSummary = async (): Promise<void> => {
    try {
      const summary = await fetchSummary({ clients: { client: state.data } });
      dispatch({ type: 'SET_SUMMARY', payload: summary });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: (error as Error).message });
    }
  };

  const handleToggleTransactions = (index: number): void => {
    dispatch({ type: 'TOGGLE_ROW', payload: index });
  };

  if (state.loading) return <div className="p-6 text-center">Loading...</div>;
  if (state.error) return <div className="p-6 text-center text-red-600">{state.error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-600">Financial Transactions Tracker</h1>

      {!state.summary && (
        <div className="mb-4 text-center">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handleSummary}
          >
            Summary
          </button>
        </div>
      )}

      {state.summary ? (
        <>
          <SummaryDisplay summary={state.summary} />
          <div className="text-center mt-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => dispatch({ type: 'SET_SUMMARY', payload: null })}
            >
              Back to Clients
            </button>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ClientList
            clients={state.data}
            expandedRows={state.expandedRows}
            onToggleTransactions={handleToggleTransactions}
            onEdit={(client) => dispatch({ type: 'SET_SELECTED', payload: client })}
          />

          {state.selected && (
            <div className="bg-white p-4 shadow-lg rounded-lg">
              <h3 className="text-2xl font-semibold mb-4">Edit Client</h3>
              <DataForm
                client={state.selected}
                onSave={handleSave}
                onCancel={() => dispatch({ type: 'SET_SELECTED', payload: null })}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;