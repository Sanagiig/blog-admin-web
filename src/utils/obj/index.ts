function cookie2Obj(cookie: string) {
  const kvList = cookie.split(";");
  const res: { [k: string]: string } = {};

  kvList.forEach((kvStr) => {
    const kv: string[] = kvStr.split("=");
    res[kv[0]] = kv[1];
  });

  return res;
}

function obj2Cookie(obj: { [key: string]: any }) {
  const kvList: string[] = [];

  Object.keys(obj).forEach((key) => {
    kvList.push(`${key}=${obj[key]}`);
  });

  return kvList.join(";");
}

function objOmit<K extends keyof T,T extends any>(obj: T, keys: K[]): Omit<T, K> {
  const res: any = {};
  Object.keys(obj as any).forEach((key) => {
    if (!keys.includes(key as K)) {
      res[key] = obj[key  as K];
    }
  } )
  return res
}

function objPick<K extends keyof T,T extends  object>(obj: any, keys: string[]):Pick<T, K> {
  const res: any = {};
  Object.keys(obj).forEach(key => {
    if (keys.includes(key)) {
      res[key] = obj[key];
    }
  })
  return res
}

export {
  cookie2Obj,
  obj2Cookie,
  objOmit,
  objPick
};
