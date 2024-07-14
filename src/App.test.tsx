import React from 'react';
import {
  render,
  screen,
  waitFor,
  act,
  fireEvent,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import App from './App';
import {getQuickSuggest} from './queries/getQuickSuggest';
import {QuickSuggestResp} from './queries/getQuickSuggest';

// Mock the getQuickSuggest function
jest.mock('./queries/getQuickSuggest');

// Explicitly type the mock
const mockedGetQuickSuggest = getQuickSuggest as jest.Mock<
  Promise<QuickSuggestResp>
>;

const queryClient = new QueryClient();

const renderComponent = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );

describe('App', () => {
  beforeEach(() => {
    queryClient.clear();
  });

  it('renders the masthead and search bar', () => {
    renderComponent();
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('displays suggestions when typing', async () => {
    mockedGetQuickSuggest.mockResolvedValueOnce({
      stemmedQueryTerm: 'child',
      suggestions: [
        'child care',
        'child vaccination',
        'child health',
        'child education',
        'child development account',
        'register childcare',
      ],
    });

    renderComponent();
    const input = screen.getByPlaceholderText('Search');

    await act(async () => {
      userEvent.type(input, 'child');
    });

    await waitFor(() => {
      const suggestionContainer = screen.getByRole('listbox');
      const suggestions = within(suggestionContainer).getAllByRole('option');
      expect(suggestions.length).toBe(6); // Ensure we have the right number of suggestions
      expect(suggestions[0].innerHTML).toContain('<b>child</b> care');
      expect(suggestions[1].innerHTML).toContain('<b>child</b> vaccination');
      expect(suggestions[2].innerHTML).toContain('<b>child</b> health');
      expect(suggestions[3].innerHTML).toContain('<b>child</b> education');
      expect(suggestions[4].innerHTML).toContain(
        '<b>child</b> development account',
      );
      expect(suggestions[5].innerHTML).toContain('register <b>child</b>care');
    });
  });

  it('highlights suggestions using keyboard navigation', async () => {
    mockedGetQuickSuggest.mockResolvedValueOnce({
      stemmedQueryTerm: 'child',
      suggestions: [
        'child care',
        'child vaccination',
        'child health',
        'child education',
        'child development account',
        'register childcare',
      ],
    });

    renderComponent();
    const input = screen.getByPlaceholderText('Search');

    await act(async () => {
      userEvent.type(input, 'child');
    });

    await waitFor(() => {
      const suggestionContainer = screen.getByRole('listbox');
      const suggestions = within(suggestionContainer).getAllByRole('option');
      expect(suggestions.length).toBe(6); // Ensure we have the right number of suggestions
      expect(suggestions[0].innerHTML).toContain('<b>child</b> care');
      expect(suggestions[1].innerHTML).toContain('<b>child</b> vaccination');
      expect(suggestions[2].innerHTML).toContain('<b>child</b> health');
      expect(suggestions[3].innerHTML).toContain('<b>child</b> education');
      expect(suggestions[4].innerHTML).toContain(
        '<b>child</b> development account',
      );
      expect(suggestions[5].innerHTML).toContain('register <b>child</b>care');
    });

    await act(async () => {
      userEvent.type(input, '{arrowdown}');
    });

    await waitFor(() => {
      const suggestion = screen.getByText((content, element) => {
        return element?.textContent === 'child care';
      });
      expect(suggestion).toHaveClass('bg-gray-200');
    });

    await act(async () => {
      userEvent.type(input, '{arrowdown}');
    });

    await waitFor(() => {
      const suggestion = screen.getByText((content, element) => {
        return element?.textContent === 'child vaccination';
      });
      expect(suggestion).toHaveClass('bg-gray-200');
    });

    await act(async () => {
      userEvent.type(input, '{arrowup}');
    });

    await waitFor(() => {
      const suggestion = screen.getByText((content, element) => {
        return element?.textContent === 'child care';
      });
      expect(suggestion).toHaveClass('bg-gray-200');
    });

    await act(async () => {
      userEvent.type(input, '{arrowup}');
    });

    await waitFor(() => {
      const suggestion = screen.getByText((content, element) => {
        return element?.textContent === 'register childcare';
      });
      expect(suggestion).toHaveClass('bg-gray-200');
    });
  });

  it('clears input when clicking the clear icon', () => {
    renderComponent();
    const input = screen.getByPlaceholderText('Search');

    userEvent.type(input, 'child');

    expect(input).toHaveValue('child');

    const clearButton = screen.getByTestId('clearSearch');

    fireEvent.click(clearButton);

    expect(input).toHaveValue('');
  });
});
