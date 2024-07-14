export type SearchResp = {
  Page: 1
  PageSize: 10
  ResultItems: SearchDocument[]
  TotalNumberOfResults: 100
}

export type SearchDocument = {
  DocumentExcerpt: {
    Highlights: { BeginOffset: number, EndOffset: number; }[]
    Text: string
  }
  DocumentId: string
  DocumentTitle: {
    Text: string
    Highlights: { BeginOffset: number, EndOffset: number; }[]
  }
  DocumentURI: string
}

export const getSearchResults = async () => {
  const url = 'https://gist.githubusercontent.com/yuhong90/b5544baebde4bfe9fe2d12e8e5502cbf/raw/44deafab00fc808ed7fa0e59a8bc959d255b9785/queryResult.json'
  const res = await fetch(url);
  return res.json() as Promise<SearchResp>;
}