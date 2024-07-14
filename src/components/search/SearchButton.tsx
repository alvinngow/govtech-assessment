import React from 'react';
import {IconSearch} from '@tabler/icons-react';

type SearchButtonProps = {
  searchAction: () => void;
};

const SearchButton: React.FC<SearchButtonProps> = (props) => {
  const {searchAction} = props;

  return (
    <button
      className='bg-[#1c76d5] p-4 flex -mr-1 rounded-md text-white'
      onClick={() => searchAction()}
      data-testid='searchButton'>
      <IconSearch></IconSearch>
      <p className='ml-2'> Search</p>
    </button>
  );
};

export default SearchButton;
