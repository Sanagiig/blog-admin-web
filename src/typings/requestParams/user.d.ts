type RegisterBody = {
  username: string;
  password: string;
  email: string;
  phone: string;
};

type ReqLoginBody = {
  username: string;
  password: string;
  checkCode: string;
};

type ReqFindUserBody = {
  id?: string;
  username?: string;
  email?: string;
  phone?: string;
  roles?: string[];
}

type ReqAddUserBody = RegisterBody & {
  description?: string;
  profile?: string;
  roles?: string[];
}

type ReqUpdateUserBody = ReqAddUserBody & {
  id: string;
}

type ReqFindUserPagingBody = FindUserBody & ReqPaging