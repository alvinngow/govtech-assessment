import React, {Dispatch, SetStateAction} from 'react';

type QuickSuggestProps = {
  suggestions: string[];
  searchTerm: string;
  activeSuggestionIndex: number;
  setActiveSuggestionIndex: Dispatch<SetStateAction<number>>;
};

const QuickSuggest: React.FC<QuickSuggestProps> = (props) => {
  const {
    suggestions,
    searchTerm,
    activeSuggestionIndex,
    setActiveSuggestionIndex,
  } = props;

  return (
    <div
      className='absolute top-full bg-white w-full mt-1 shadow-md'
      role='listbox'>
      {suggestions.map((suggestion, index) => {
        const boldedIndex = suggestion.indexOf(searchTerm);
        const frontText = suggestion.slice(0, boldedIndex);
        const backText = suggestion.slice(boldedIndex + searchTerm.length);

        if (boldedIndex > -1) {
          return (
            <p
              className={`px-3 py-2 cursor-pointer ${
                index === activeSuggestionIndex && 'bg-gray-200'
              }`}
              key={suggestion}
              onMouseEnter={() => setActiveSuggestionIndex(index)}
              role='option'>
              {frontText}
              <b>{searchTerm}</b>
              {backText}
            </p>
          );
        }
      })}
    </div>
  );
};

export default QuickSuggest;
