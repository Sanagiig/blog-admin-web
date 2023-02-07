function genComLimitText(str: string, limit: number = 20) {
  let tip = "", text = str;
  if (str.length > limit) {
    tip = text;
    text = str.slice(0, limit) + " ..."
  }
  return {tip, text}
}

export {
  genComLimitText
}