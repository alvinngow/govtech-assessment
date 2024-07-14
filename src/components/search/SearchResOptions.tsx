import React from 'react';
import {SearchDocument} from '../../queries/getSearchResults';

type OptionProp = {
  item: SearchDocument;
};

const SearchResOptions: React.FC<OptionProp> = (props) => {
  const {item} = props;
  const boldString = (str: string, substr: string) => {
    const boldedNormal = str.replaceAll(substr, `<b>${substr}</b>`);
    const boldedLower = boldedNormal.replaceAll(
      substr.toLowerCase(),
      `<b>${substr.toLowerCase()}</b>`,
    );
    const boldedAll = boldedLower.replaceAll(
      substr.toUpperCase(),
      `<b>${substr.toUpperCase()}</b>`,
    );

    return boldedAll;
  };

  return (
    <div className='my-8'>
      <a
        href={item.DocumentURI}
        className='text-[#1c76d5] font-semibold text-2xl'
        dangerouslySetInnerHTML={{
          __html: boldString(item.DocumentTitle.Text, 'Child'),
        }}></a>
      <p
        className='w-3/4'
        dangerouslySetInnerHTML={{
          __html: boldString(item.DocumentExcerpt.Text, 'Child'),
        }}
      />
      <p className='w-3/4 mt-4 text-gray-500'>{item.DocumentURI}</p>
    </div>
  );
};

export default SearchResOptions;
