import axios from 'axios';
import { Client, Account, ApiResponse, SummaryClient } from './types/clientTypes';

export const fetchAccounts = async (): Promise<Client[]> => {
  const response = await axios.get<ApiResponse>('http://localhost:8080/bankingtransactions/accounts');
  return response.data.accounts.map((account: Account) => account.client);
};

export const updateAccounts = async (payload: { accounts: Account[] }): Promise<void> => {
  await axios.post('http://localhost:8080/bankingtransactions/create-or-update-accounts', payload);
};

export const fetchSummary = async (payload: { clients: { client: Client[] } }): Promise<SummaryClient[]> => {
  const response = await axios.post<SummaryClient[]>('http://localhost:8080/bankingtransactions/summary', payload);
  return response.data;
};