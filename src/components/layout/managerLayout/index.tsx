import {Layout, Breadcrumb, MenuProps, Avatar, Dropdown} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  GithubOutlined,
} from "@ant-design/icons";

import React, {useState, memo, useEffect} from "react";
import DynamicMenu from "@/components/layout/managerLayout/dynamicMenu";
import style from "./style.module.scss";
import {useNavigate, useOutlet} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {asyncSelfInfo, selectSelfInfo} from "@/store/reducers/user";

const {Header, Sider, Content} = Layout;
const miniWidth = "80px";
const normalWidth = "200px";

function TriggerBtn({collapsed, onClick}: any) {
  const Btn = collapsed ? MenuUnfoldOutlined : MenuFoldOutlined;
  return <Btn onClick={onClick} style={{fontSize: "30px", color: "white"}}/>;
}

function Logo({collapsed}: any) {
  const width = collapsed ? miniWidth : normalWidth;
  const desStyle = {
    width: collapsed ? "0" : "auto",
  };
  return (
    <div className={style.logo} style={{width}}>
      <GithubOutlined></GithubOutlined>
      <span className={style.logo_des} style={desStyle}>
        Of_Undefined
      </span>
    </div>
  );
}

export default function ManagerLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const {loading, data: selfInfo} = useSelector(selectSelfInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () =>{
    navigate("/login")
  }

  const Outlet = useOutlet()
  const avatorMenuItems:MenuProps["items"] = [{
    label:(<a onClick={handleLogout}>退出登录</a>),
    key:"logout"
  }]

  useEffect(() => {
    dispatch<any>(asyncSelfInfo())
  }, []);


  return (
    <Layout className={style.layout_container}>
      <Header className={style.header}>
        <div style={{display:"flex",alignItems:"center"}}>
          <Logo collapsed={collapsed}/>
          <TriggerBtn
            collapsed={collapsed}
            onClick={() => setCollapsed(!collapsed)}
          />
        </div>

        <div className={style.head_right}>
          <Dropdown arrow trigger={["click"]} menu={{items:avatorMenuItems}}>
            <Avatar src={selfInfo?.userInfo?.profile} style={{cursor:"pointer"}}/>
          </Dropdown>
        </div>
      </Header>
      <Layout className="site-layout">
        <Sider width={200} className="site-layout-background" trigger={null} collapsible collapsed={collapsed}
               theme="light">
          <DynamicMenu/>
        </Sider>
        <Layout style={{padding: '0 10px 10px'}}>
          <Content
            className={style.content}
            // className="site-layout-background"
            style={{
              padding: 10,
              margin: 0,
              minHeight: 280,
            }}
          >
            {Outlet}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}