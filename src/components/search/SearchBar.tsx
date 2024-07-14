import {IconX, IconZoomExclamation} from '@tabler/icons-react';
import {useQueryClient} from '@tanstack/react-query';
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useDebounce from '../../hooks/useDebounce';
import {getSearchResults, SearchResp} from '../../queries/getSearchResults';
import Spinner from '../common/Spinner';
import QuickSuggest from './QuickSuggest';
import SearchButton from './SearchButton';

type SearchBarProps = {
  setSearchRes: Dispatch<SetStateAction<SearchResp | undefined>>;
};

export type QuickSuggestResp = {
  stemmedQueryTerm: string;
  suggestions: string[];
};

const SearchBar: React.FC<SearchBarProps> = (props) => {
  const {setSearchRes} = props;
  const queryClient = useQueryClient();

  const [quickSuggestRes, setQuickSuggestRes] = useState<
    QuickSuggestResp | undefined
  >(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isQuickSuggestLoading, setIsQuickSuggestLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // If this was an actual backend, mutation would be used here along with the searchTerm as payload
  // Assumes that we're not using URL searchParams
  const handleQuickSuggest = useCallback(async () => {
    setIsQuickSuggestLoading(true);
    const url =
      'https://gist.githubusercontent.com/yuhong90/b5544baebde4bfe9fe2d12e8e5502cbf/raw/e026dab444155edf2f52122aefbb80347c68de86/suggestion.json';
    const res = await fetch(url);

    if (res.ok) {
      const data = await res.json();
      setQuickSuggestRes(data);
    } else {
      alert('Something went wrong, please try again');
    }
    setIsQuickSuggestLoading(false);
  }, [queryClient]);

  const handleSearch = async () => {
    const data = await queryClient.fetchQuery({
      queryKey: ['searchRes'],
      queryFn: getSearchResults,
    });
    setSearchRes(data);
  };

  const filteredData = useMemo(() => {
    if (quickSuggestRes) {
      const filteredList = [];
      for (const suggestion of quickSuggestRes.suggestions) {
        if (suggestion.indexOf(searchTerm) > -1) {
          filteredList.push(suggestion);
        }
      }

      if (filteredList.length > 0) {
        return filteredList;
      }
    }

    return [];
  }, [quickSuggestRes, searchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      setActiveSuggestionIndex((prevIndex) =>
        prevIndex === filteredData.length - 1 ? 0 : prevIndex + 1,
      );
    } else if (e.key === 'ArrowUp') {
      setActiveSuggestionIndex((prevIndex) =>
        prevIndex === 0 ? filteredData.length - 1 : prevIndex - 1,
      );
    } else if (e.key === 'Enter') {
      setSearchTerm(filteredData[activeSuggestionIndex]);
      setActiveSuggestionIndex(0);
      handleSearch();
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  useEffect(() => {
    handleQuickSuggest();
  }, [debouncedSearchTerm, handleQuickSuggest]);

  return (
    <div className='relative focus-within:border-blue-300 max-w-[1120px] w-full border border-gray-300 rounded-md flex items-center px-1'>
      <input
        type='text'
        className='outline-none relative p-4 flex-grow'
        placeholder='Search'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsInputFocused(true)}
        onBlur={() => setIsInputFocused(false)}
        ref={inputRef}
        data-testid='SearchBar'
      />
      {searchTerm.length > 0 && (
        <IconX
          id='clearSearch'
          className='mr-2 text-zinc-400 cursor-pointer'
          onClick={() => {
            setSearchTerm('');
            inputRef.current?.focus();
            setIsInputFocused(true);
          }}
          data-testid='clearSearch'
        />
      )}
      <SearchButton searchAction={handleSearch}></SearchButton>
      {isQuickSuggestLoading && (
        <div className=' flex justify-center items-center absolute top-full bg-white w-full mt-1 shadow-md h-32'>
          <Spinner></Spinner>
        </div>
      )}
      {searchTerm.length > 2 &&
        isInputFocused &&
        (filteredData ? (
          <QuickSuggest
            suggestions={filteredData}
            searchTerm={searchTerm}
            activeSuggestionIndex={activeSuggestionIndex}
            setActiveSuggestionIndex={setActiveSuggestionIndex}
          />
        ) : (
          <div className=' flex justify-center items-center absolute top-full bg-white w-full mt-1 shadow-md h-32'>
            <IconZoomExclamation></IconZoomExclamation>
            <p>No Results</p>
          </div>
        ))}
    </div>
  );
};

export default SearchBar;
