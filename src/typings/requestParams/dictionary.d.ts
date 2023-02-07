type ReqAddDictionaryBody = {
  parentID?: string;
  name: string;
  type: string;
  description: string;
}

type ReqFindDictionaryBody = {
  parentID?: string | null
  id?: string;
  name?: string;
  code?: string;
  description?: string;
}

type ReqUpdateDictionaryBody = ReqAddDictionaryBody & {
  id: string;
}

type ReqFindDictionaryPagingBody = FindDictionaryBody & ReqPaging

type ReqDeleteDictionaryBody = {
  ids: string[]
}