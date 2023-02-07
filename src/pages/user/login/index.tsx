import {Card, Button, Form, Input, Space} from "antd";
import style from "./login.module.scss";
import {login} from "@/api/user";
import {useNavigate} from "react-router";

export default function Login() {
  const navigate = useNavigate();
  const handleLogin = async (data: ReqLoginBody) => {
    const loginData: ReqLoginBody = {
      ...data,
      password: btoa(data.password),
    };

    const res = await login(loginData) as any;
    if (res.code == 200) {
      navigate("/home");
    }
  };

  const handleJump2Register = () => {
    navigate("/register");
  };

  return (
    <div className={style.login_container}>
      <div className={style.login_card_container}>
        <Card hoverable className={style.login_card}>
          <span className={style.login_title}>MyBlog 登录</span>
          <Form
            labelCol={{span: 5}}
            initialValues={{remember: true}}
            onFinish={handleLogin}
            autoComplete="off"
          >
            <Form.Item
              label="用户名"
              name="username"
              wrapperCol={{span: 16}}
              rules={[{required: true, message: "请输入用户名"}]}
            >
              <Input/>
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              wrapperCol={{span: 16}}
              rules={[{required: true, message: "请输入密码"}]}
            >
              <Input.Password/>
            </Form.Item>

            <Form.Item
              label="验证码"
              name="checkCode"
              wrapperCol={{span: 16}}
              rules={[{required: true, message: "请输入验证码"}]}
            >
              <Input/>
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  type="dashed"
                  size={"large"}
                  onClick={handleJump2Register}
                >
                  注册
                </Button>
                <Button type="primary" htmlType="submit" size={"large"}>
                  登录
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}
