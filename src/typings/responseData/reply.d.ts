type ResReply = {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

type ResReplyDetail = {
  id: string;
  name: string;
  type: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

type ResReplyTree = ResReply & {
  children?: ResReplyTree[]
}

type ResReplyPaging = ResReply
