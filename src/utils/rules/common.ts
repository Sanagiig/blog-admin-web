export  function checkName(name: string = ""){
  if(name.length > 30){
    return "名称字段过长"
  }
}

export function checkCode(code :string=""){
  const reg = /^\w+$/
  const len = code.length
  if(len > 30){
    return "code字段过长"
  }else if(!reg.test(code)){
    return "code格式不符合标准,必须是[ 字母，数字，下划线 ]组成"
  }
}

export function checkPhone(phone:string =""){
  if(phone.length != 11){
    return "长度不符合11位数标准"
  }else if(!/[\d]{11}/.test(phone)){
    return "手机号必须是11位数纯数字"
  }
}

export function checkEmail(email:string = ""){
  const reg = /^\w+@\w+\.\w+$/
  if(!reg.test(email)){
    return "email格式错误"
  }
}

export function checkDescription(des:string  = ""){
  if(des.length > 200){
    return "描述字段过长"
  }
}