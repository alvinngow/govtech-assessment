import React from 'react';
import {render, screen, fireEvent, waitFor, act} from '@testing-library/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import App from '../App';

describe('App', () => {
  test('renders search results correctly', async () => {
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>,
    );

    const searchBar = screen.getByPlaceholderText('Search');
    await act(async () => {
      fireEvent.change(searchBar, {target: {value: 'child'}});
      const searchButton = screen.getByTestId('searchButton');
      fireEvent.click(searchButton);
    });

    await waitFor(() =>
      expect(screen.getByText(/Showing/i)).toBeInTheDocument(),
    );
  });
});
