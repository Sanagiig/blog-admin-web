export function checkUsername(username: string  = "") {
  const len = username.length;
   if (len > 20 || len < 5) {
    return "用户名必须是 5 - 20 个字符之间";
  }
}

export function checkNickname(nickname:string  = ""){
  if (nickname.length < 5) {
    return "昵称必须超过5个字符";
  } else if (nickname.length >= 20) {
    return "昵称不能超过20个字符";
  }
}

export function checkPassword(pwd:string = ""){
  const len = pwd.length
  if(len < 5 || len > 20){
    return "密码必须是 5 - 20 个字符之间";
  }
}