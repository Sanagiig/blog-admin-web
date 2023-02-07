export  function checkValue(value: string  = ""){
  if(value.length > 200){
    return "权限值字符过长"
  }
}