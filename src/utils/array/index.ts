function unrepeatedAdd(list: any[], ...items: any) {
  items.forEach((item: any) => {
    if (!list.includes(item)) {
      list.push(item)
    }
  })
}

function unrepeatedRemove(list: any[], ...items: any) {
  items.forEach((item: any) => {
    let idx = list.indexOf(item)
    if (idx != -1) {
      list.splice(idx, 1)
    }
  })
}

function extractVal<T extends any,K extends keyof T>(list:T[],...keys:K[]){
  const res :any[] = []
  list.forEach(item =>{
    if(keys.length > 1){
      const o={} as T
      keys.forEach(k=>{
        o[k] = item[k]
      })
      res.push(o)
    }else{
      const k = keys[0];
      if(k){
        res.push(item[k])
      }
    }
  })

  return res;
}

export {
  unrepeatedAdd,
  unrepeatedRemove,
  extractVal,
}