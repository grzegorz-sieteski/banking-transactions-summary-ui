import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import DataForm from './DataForm';
import { Client } from '../types/clientTypes';

const mockClient: Client = {
  info: { clientId: BigInt(1), name: 'John', surname: 'Doe', country: 'USA' },
  balance: { total: '1000', currency: 'USD', date: '01.01.2021' },
  transactions: [],
};

describe('DataForm', () => {
  it('renders client data correctly', () => {
    render(<DataForm client={mockClient} onSave={jest.fn()} onCancel={jest.fn()} />);

    expect(screen.getByLabelText('Name')).toHaveValue('John');
    expect(screen.getByLabelText('Surname')).toHaveValue('Doe');
    expect(screen.getByLabelText('Country')).toHaveValue('USA');
    expect(screen.getByLabelText('Balance')).toHaveValue('1000');
    expect(screen.getByLabelText('Currency')).toHaveValue('USD');
    expect(screen.getByLabelText('Balance Date')).toHaveValue('01.01.2021');
  });

  it('calls onSave with updated data when form is submitted', () => {
    const mockOnSave = jest.fn();
    render(<DataForm client={mockClient} onSave={mockOnSave} onCancel={jest.fn()} />);

    fireEvent.change(screen.getByLabelText('Balance'), { target: { value: '2000' } });
    fireEvent.change(screen.getByLabelText('Balance Date'), { target: { value: '02.02.2022' } });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(mockOnSave).toHaveBeenCalledWith({
      info: { clientId: BigInt(1), name: 'John', surname: 'Doe', country: 'USA' },
      balance: { total: '2000', currency: 'USD', date: '02.02.2022' },
      transactions: [],
    });
  });

  it('disables Name, Surname, Country, and Currency fields', () => {
    render(<DataForm client={mockClient} onSave={jest.fn()} onCancel={jest.fn()} />);

    expect(screen.getByLabelText('Name')).toBeDisabled();
    expect(screen.getByLabelText('Surname')).toBeDisabled();
    expect(screen.getByLabelText('Country')).toBeDisabled();
    expect(screen.getByLabelText('Currency')).toBeDisabled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const mockOnCancel = jest.fn();
    render(<DataForm client={mockClient} onSave={jest.fn()} onCancel={mockOnCancel} />);

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockOnCancel).toHaveBeenCalled();
  });
});
