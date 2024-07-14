import {IconX, IconZoomExclamation} from '@tabler/icons-react';
import {useQuery, useQueryClient} from '@tanstack/react-query';
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useDebounce from '../../hooks/useDebounce';
import {getQuickSuggest} from '../../queries/getQuickSuggest';
import {getSearchResults, SearchResp} from '../../queries/getSearchResults';
import QuickSuggest from './QuickSuggest';
import SearchButton from './SearchButton';

type SearchBarProps = {
  setSearchRes: Dispatch<SetStateAction<SearchResp | undefined>>;
};

const SearchBar: React.FC<SearchBarProps> = (props) => {
  const {setSearchRes} = props;
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // If this was an actual backend, mutation would be used here along with the searchTerm as payload
  // Assumes that we're not using URL searchParams
  const {data, status} = useQuery({
    queryKey: ['quickSuggest'],
    queryFn: getQuickSuggest,
  });

  const handleSearchButtonClick = async () => {
    const data = await queryClient.fetchQuery({
      queryKey: ['searchRes'],
      queryFn: getSearchResults,
    });
    setSearchRes(data);
  };

  const filteredData = useMemo(() => {
    if (data) {
      const filteredList = [];
      for (const suggestion of data.suggestions) {
        if (suggestion.indexOf(searchTerm) > -1) {
          filteredList.push(suggestion);
        }
      }

      if (filteredList.length > 0) {
        return filteredList;
      }
    }

    return [];
  }, [data, searchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      setActiveSuggestionIndex((prevIndex) =>
        prevIndex === filteredData!.length - 1 ? 0 : prevIndex + 1,
      );
    } else if (e.key === 'ArrowUp') {
      setActiveSuggestionIndex((prevIndex) =>
        prevIndex === 0 ? filteredData!.length - 1 : prevIndex - 1,
      );
    } else if (e.key === 'Enter') {
      setSearchTerm(filteredData![activeSuggestionIndex]);
      setActiveSuggestionIndex(0);
      handleSearchButtonClick();
      inputRef.current!.blur();
    }
  };

  useEffect(() => {
    queryClient.invalidateQueries({queryKey: ['quickSuggest']});
  }, [debouncedSearchTerm]);

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
      />
      {searchTerm.length > 0 && (
        <IconX
          className='mr-2 text-zinc-400 cursor-pointer'
          onClick={() => {
            setSearchTerm('');
            inputRef.current?.focus();
            setIsInputFocused(true);
          }}
        />
      )}
      <SearchButton searchAction={handleSearchButtonClick}></SearchButton>
      {status == 'pending' && <div></div>}
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
