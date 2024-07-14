export type QuickSuggestResp = {
  stemmedQueryTerm: string
  suggestions: string[]
}

export const getQuickSuggest = async () => {
  const url = 'https://gist.githubusercontent.com/yuhong90/b5544baebde4bfe9fe2d12e8e5502cbf/raw/e026dab444155edf2f52122aefbb80347c68de86/suggestion.json'
  const res = await fetch(url);
  return res.json() as Promise<QuickSuggestResp>;
}