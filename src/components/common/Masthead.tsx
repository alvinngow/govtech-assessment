import React from 'react';
import '../../styles/components/common/masthead.css';

const Masthead = () => {
  return (
    <div className='flex items-center justify-center bg-zinc-100'>
      <div className='flex w-full max-w-[1120px] py-1'>
        <img src='lion.png' alt='Singapore Lion Head' className='h-4 lg:ml-4' />
        <p className='masthead-text text-zinc-600 text-xs ml-2'>
          An Official Website of the <b>Singapore Government</b>
        </p>
      </div>
    </div>
  );
};

export default Masthead;
