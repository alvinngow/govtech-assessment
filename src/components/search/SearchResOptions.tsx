import React from 'react';
import {SearchDocument} from '../../queries/getSearchResults';

type OptionProp = {
  item: SearchDocument;
};

const SearchResOptions: React.FC<OptionProp> = (props) => {
  const {item} = props;

  return (
    <div className='my-8'>
      <a href={item.DocumentURI}>{item.DocumentTitle.Text}</a>
      <p className='w-3/4'>{item.DocumentExcerpt.Text}</p>
    </div>
  );
};

export default SearchResOptions;
