import React, {useState} from 'react';
import Masthead from './components/common/Masthead';
import SearchBar from './components/search/SearchBar';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {SearchResp} from './queries/getSearchResults';
import SearchResOptions from './components/search/SearchResOptions';
import Pagination from './components/common/Pagination';

const defaultQueryClient = new QueryClient();

type AppProps = {
  queryClient?: QueryClient;
};

function App({queryClient = defaultQueryClient}: AppProps) {
  const [searchRes, setSearchRes] = useState<SearchResp | undefined>(undefined);

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <div className='sticky top-0 '>
          <Masthead />
          <div className='px-4 h-36 shadow-md flex justify-center items-center bg-white'>
            <SearchBar setSearchRes={setSearchRes} />
          </div>
        </div>
        <div className='w-full flex flex-col items-center px-4'>
          {searchRes && (
            <>
              <div className='w-full max-w-[1120px]'>
                <div className='mt-8'>
                  <p
                    style={{fontFamily: 'Open Sans'}}
                    className='font-semibold text-2xl'>
                    Showing {searchRes.Page} -{' '}
                    {searchRes.Page * searchRes.PageSize} of{' '}
                    {searchRes.TotalNumberOfResults}
                  </p>
                </div>
                <div>
                  {searchRes.ResultItems.map((item) => (
                    <SearchResOptions key={item.DocumentId} item={item} />
                  ))}
                </div>
              </div>
              <Pagination
                totalPages={searchRes.TotalNumberOfResults / searchRes.PageSize}
                currentPage={searchRes.Page}
              />
            </>
          )}
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;
