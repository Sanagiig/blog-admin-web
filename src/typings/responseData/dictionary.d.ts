type ResDictionary = {
  parentID?:string;
  id: string;
  name: string;
  code: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

type ResDictionaryDetail = ResDictionary & {}

type ResDictionaryTree = ResDictionary & {
  children?: ResDictionaryTree[]
}

type ResDictionaryPaging = ResDictionary
