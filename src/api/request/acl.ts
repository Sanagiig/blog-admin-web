const noAuthList = ["/api/user/login", "/api/user/register"];

function isNoauthReq(url: string): boolean {
  return noAuthList.includes(url);
}

type ResponseData = {
  code: number;
  data?: any;
  message?: string;
  errMsg?: string;
}

const toLoginCodeList = [[1005, 1011]]

function isRedicrectToLogin(res: ResponseData) {
  const {code} = res;
  for (let i = 0; i < toLoginCodeList.length; i++) {
    const item = toLoginCodeList[i];
    if (Array.isArray(item)) {
      const [start, end] = item;
      if (code >= start && code <= end) {
        return true
      }
    } else if (code == item) {
      return true
    }
  }

  return false
}

export {isNoauthReq, isRedicrectToLogin};
