import React, {useState} from 'react';
import Masthead from './components/common/Masthead';
import SearchBar from './components/search/SearchBar';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {SearchResp} from './queries/getSearchResults';
import SearchResOptions from './components/search/SearchResOptions';

const defaultQueryClient = new QueryClient();

type AppProps = {
  queryClient?: QueryClient;
};

function App({queryClient = defaultQueryClient}: AppProps) {
  const [searchRes, setSearchRes] = useState<SearchResp | undefined>(undefined);

  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Masthead />
        <div className='h-36 shadow-md flex justify-center items-center'>
          <SearchBar setSearchRes={setSearchRes} />
        </div>
        {searchRes && (
          <div className='w-full flex justify-center'>
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
          </div>
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;
