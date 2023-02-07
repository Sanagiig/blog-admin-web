type ResUserBaseInfo = {
  id: string;
  username: string;
  nickname: string;
  roles:any[]
  sex: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

type ResUserDetailInfo = ResUserBaseInfo &{
  userInfo: {
    description: string;
    profile: string;
  }
}