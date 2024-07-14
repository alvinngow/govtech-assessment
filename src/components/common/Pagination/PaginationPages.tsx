import React from 'react';
import classNames from 'classnames';

interface PaginationPagesProps {
  number: number;
  currentPage: number;
}

const PaginationPages = (props: PaginationPagesProps) => {
  const {number, currentPage} = props;

  const pageClassName = classNames('p-2 rounded-lg hover:cursor-pointer', {
    'text-white bg-blue-300': currentPage === number,
  });

  return (
    <li className={pageClassName}>
      <div onClick={() => {}}>{number}</div>
    </li>
  );
};

export default PaginationPages;
