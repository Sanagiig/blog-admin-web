import {Card, Button, Form, Input, Space} from "antd";
import style from "./register.module.scss";

import {register} from "@/api/user";
import {useNavigate} from "react-router";

export default function Register() {
  const handleRegister = async (data: RegisterBody) => {
    await register(data);
  };


  return (
    <div className={style.login_container}>
      <div className={style.login_card_container}>
        <Card hoverable className={style.login_card}>
          <span className={style.login_title}>MyBlog 注册</span>
          <Form
            labelCol={{span: 5}}
            initialValues={{remember: true}}
            onFinish={handleRegister}
            onFinishFailed={(data) => {
              console.log('data"', data);
            }}
            autoComplete="off"
          >
            <Form.Item
              label="用户名"
              name="username"
              wrapperCol={{span: 16}}
              rules={[{required: true, message: "请输入用户名"}]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="密码"
              name="password"
              wrapperCol={{span: 16}}
              rules={[{required: true, message: "请输入密码"}]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="再次确认"
              name="password2"
              wrapperCol={{span: 16}}
              rules={[{required: true, message: "请再次确认密码"}]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item
              label="email"
              name="email"
              wrapperCol={{span: 16}}
              rules={[{required: true, message: "请输入email"}]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="手机号"
              name="phone"
              wrapperCol={{span: 16}}
              rules={[{required: true, message: "请输入手机号"}]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" size={"large"}>
                注册
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
}
