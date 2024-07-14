import React from 'react';
import PaginationPages from './PaginationPages';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

const Pagination = (props: PaginationProps) => {
  const {totalPages, currentPage} = props;
  const offset = Math.floor(currentPage / 10) * 10;
  const maxPages = offset + 10 > totalPages ? totalPages - offset : 10;

  return (
    <div className='flex gap-4 items-center mt-4 mb-4'>
      {currentPage > 1 && (
        <div className='hover:cursor-pointer' onClick={() => {}}>
          {'<<'}
        </div>
      )}
      <ul className='flex list-none gap-4'>
        {Array.from({length: maxPages}, (item, index) => {
          return (
            <PaginationPages
              key={index}
              number={index + 1 + offset}
              currentPage={currentPage}
            />
          );
        })}
      </ul>
      {currentPage < totalPages && (
        <div className='hover:cursor-pointer' onClick={() => {}}>
          {'>>'}
        </div>
      )}
    </div>
  );
};

export default Pagination;
