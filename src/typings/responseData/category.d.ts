type ResCategory = {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

type ResCategoryDetail = {
  id: string;
  name: string;
  type: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

type ResCategoryTree = ResCategory & {
  children?: ResCategoryTree[]
}

type ResCategoryPaging = ResCategory
