import {
  Space,
  Tag,
  Form,
  Input,
  Select,
  SelectProps,
  Button,
  Drawer,
  Modal,
  message,
  Descriptions,
  Row,
  Col, Upload, UploadProps, FormProps, Image, TableProps
} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import React, {memo, useEffect, useMemo, useRef, useState} from 'react';
import SearchTableTemp from "@/components/templates/searchTableTemp";
import {addUser, updateUser, findUserDetail, findUserPaging, deleteUser} from "@/api/user";
import ComLoading from "@/components/loading/comLoading";
import {PlusCircleFilled} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import {UploadFile} from "antd/es";
import {getBase64} from "@/utils/file";
import {uploadFile, uploadFile2QiNiu} from "@/api/upload";
import {objOmit, rules} from "@/utils";
import {TableRowSelection} from "antd/es/table/interface";
import {useDispatch, useSelector, useStore} from "react-redux";
import {asyncRoleList, selectRoleList, syncRoleList} from "@/store/reducers/role";
import {checkEmail, checkPhone} from "@/utils/rules/common";
import {checkNickname, checkPassword, checkUsername} from "@/utils/rules/user";

function genColumns(onDetail: any, onEditUser: any, onDeleteUser: any): ColumnsType<ResUserBaseInfo> {
  return [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      render: (text, {id}) => {
        return <a onClick={() => onDetail(id)}>{text}</a>
      },
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      render: (data, record) => {
        const {sex = "unkonw"} = record;
        const sexMap: any = {
          man: {text: "男", color: "blue"},
          woman: {text: "女", color: "pink"},
          unkonw: {text: "保密", color: "gray"}
        }

        return (
          < Tag color={sexMap[sex].color}> {sexMap[sex].text}</Tag>
        )
      }
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '电话',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, {id}) => (
        <>
          <Button type="link" onClick={() => {
            onEditUser(id)
          }}>编辑</Button>
          <Button type="link" danger onClick={() => {
            onDeleteUser([id])
          }}>删除</Button>
        </>
      ),
    },
  ];
}

const tagRender: SelectProps["tagRender"] = (props) => {
  const {label, value, closable, onClose} = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      color={"blue"}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{marginRight: 3}}
    >
      {label}
    </Tag>
  );
};

type ProfileUploaderProps = {
  value?: string | UploadFile
  onChange?: (file?: UploadFile) => void
}

const ProfileUploader = memo(function ProfileUploader(props: ProfileUploaderProps) {
  const {value = "", onChange} = props;
  const [previewOpen, setPreviewOpen] = useState(false);
  const [profileList, setProfileList] = useState<UploadFile[]>([]);
  const previewURL = useMemo(() => {
    return profileList.length && profileList[0].url || ""
  }, [profileList[0]]);

  const handleChange: UploadProps["onChange"] = async (info) => {
    const {fileList} = info;
    setProfileList(fileList)
    onChange?.(fileList[0])
  }

  const handlePreview = async (file: UploadFile) => {
    setPreviewOpen(true);
  };

  const onModalOK = async (file: any) => {
    const url = await getBase64(file)
    const fileList = [{originFileObj: file, uid: Date.now().toString(), name: file.name, url: url}]
    setProfileList(fileList);
    onChange?.(fileList[0])
  }

  const genUploadButton = () => {
    return (<div>
        <PlusCircleFilled/>
        <div style={{marginTop: 8}}>上传头像</div>
      </div>
    );
  }

  useEffect(() => {
    if (!value) {
      setProfileList([])
    } else if (typeof value == "object") {
      setProfileList([value])
    } else {
      setProfileList([{url: value, uid: Date.now().toString(), name: "profile"}])
    }
  }, [value]);


  return (
    <>
      <ImgCrop zoom rotate grid onModalOk={onModalOK}>
        <Upload
          listType="picture-card"
          maxCount={1}
          fileList={profileList}
          customRequest={() => Promise.resolve()}
          onChange={handleChange}
          onPreview={handlePreview}
        >
          {genUploadButton()}
        </Upload>
      </ImgCrop>
      <Modal open={previewOpen} title="预览" footer={null} onCancel={() => {
        setPreviewOpen(false)
      }}>
        <img style={{width: '100%'}} src={previewURL} alt="preview"/>
      </Modal>
    </>

  )
})

type UserDrawerState = {
  mode: "add" | "edit" | "detail" | "";
  id?: string;
  open: boolean;
}
type UserDrawerProps = UserDrawerState & {
  onClose: () => void
  onSubmit: () => void
}
type UserDetailData = Omit<ResUserDetailInfo, "userInfo"> & ResUserDetailInfo["userInfo"]

function UserDrawer(props: UserDrawerProps) {
  const {mode, id, open, onClose, onSubmit} = props;

  const desAutoSize = {xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1};
  const formAutoSize = {xxl: 12, xl: 12, lg: 12, md: 12, sm: 24, xs: 24};
  const titleMap = {
    "": "",
    add: "新增用户",
    edit: "编辑用户",
    detail: "用户详情"
  }
  const sexMap = {
    man: "男",
    woman: "女",
    unknown: "保密"
  }

  const [userForm] = Form.useForm()
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [userDetail, setUserDetail] = useState({} as UserDetailData);
  const {loading: roleListLoading, data: roleList} = useSelector(selectRoleList);


  const onAddUser = (params: ReqAddUserBody) => {
    return addUser(params).then(res => {
      message.success("添加成功")
      return res
    })
  }

  const getDetail = () => {
    setDrawerLoading(true)
    findUserDetail({id}).then(res => {
      const {data} = res;
      const detail: UserDetailData = {
        ...data.userInfo,
        ...objOmit(data, ["userInfo"]),
        roles: data.roles
      }
      // 编译错误 ？ 没有判断会提示 变量无声明
      if (res.code == 200) {
        if (["edit", "add"].includes(mode)) {
          userForm.setFieldsValue({
            ...detail,
            roles: detail.roles.map(item => item.id)
          })
        } else {
          setUserDetail(detail)
        }
      }
    }).finally(() => setDrawerLoading(false))
  }

  const submitForm = (formData: any) => {
    let {profile = ""} = formData
    let task = Promise.resolve()
    console.log("form",formData)
    setDrawerLoading(true)
    task.then(() => {
      if (typeof profile != "string") {
        return uploadFile({
          file: profile.originFileObj,
          uploadType: "profile",
          username: formData.username
        }).then(({data}) => {
          return Object.assign({}, formData, {profile: data})
        })
      }
      return formData
    }).then((params) => {
      const roles = (params.roles || []).map((r: any) => r.id || r)
      if (mode == "add") {
        return onAddUser(Object.assign(
          {},
          params,
          {roles}))
      }
      return onUpdateUser(Object.assign(
        {id},
        params,
        {roles}
      ))
    }).then(_ => {
      onSubmit()
      handleClose()
    }).finally(() => setDrawerLoading(false))

  }

  const onUpdateUser = (params: ReqAddUserBody) => {
    setDrawerLoading(true)
    return updateUser(params).then(res => {
      message.success("修改成功")
      return res
    })
  }

  const handleClose = () => {
    setUserDetail({} as UserDetailData)
    userForm.resetFields()
    onClose()
  }

  const onFinish: FormProps["onFinish"] = async (formData) => {
    submitForm(formData)
  }

  const genDetail = () => {
    console.log("userDetail",userDetail)
    return (<>
      <Descriptions bordered>
        <Descriptions.Item span={4} label="头像">
          <Image width="200px" src={userDetail.profile}/>
        </Descriptions.Item>
        <Descriptions.Item label="id" span={2}>{userDetail.id}</Descriptions.Item>
        <Descriptions.Item label="用户名" span={2}>{userDetail.username}</Descriptions.Item>
        <Descriptions.Item label="昵称" span={2}>{userDetail.nickname}</Descriptions.Item>
        <Descriptions.Item label="性别" span={2}>{sexMap[userDetail.sex as keyof typeof sexMap]}</Descriptions.Item>
        <Descriptions.Item label="手机号" span={2}>{userDetail.phone}</Descriptions.Item>
        <Descriptions.Item label="email" span={4}>{userDetail.email}</Descriptions.Item>
        <Descriptions.Item label="角色" span={4}>
          {(userDetail.roles || []).map(r => {
            return <Tag color="green">{r.name}</Tag>
          })}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间" span={2}>{userDetail.createdAt}</Descriptions.Item>
        <Descriptions.Item label="修改时间" span={2}>{userDetail.updatedAt}</Descriptions.Item>
        <Descriptions.Item label="描述" span={4}>{userDetail.description}</Descriptions.Item>
      </Descriptions>
    </>)
  }

  const genSubmitBlock = () => {
    return !["add", "edit"].includes(mode) ? null : (
      <Space>
        <Button onClick={userForm.submit} type="primary">
          提交
        </Button>
        <Button onClick={onClose}>取消</Button>
      </Space>)
  }

  const genForm = () => {
    const selRoles = (userDetail.roles || []).map(r => r.id);
    return (<>
        <Form
          name="userForm"
          form={userForm}
          initialValues={userDetail}
          layout="vertical"
          labelCol={{span: "100px"}}
          wrapperCol={{span: 24}}
          onFinish={onFinish}
        >
          <div style={{display: "flex", justifyContent: "center"}}>
            <Form.Item name="profile">
              <ProfileUploader/>
            </Form.Item>
          </div>

          <Row gutter={[16, 0]} wrap>
            <Col {...formAutoSize} >
              <Form.Item
                label="用户名"
                name="username"
                rules={[{required: true, message: "请输入用户名"}, {
                  validator(rule, value, callback) {
                    callback(checkUsername(value))
                  }
                }]}
              >
                <Input disabled={mode != "add"}/>
              </Form.Item>
            </Col>

            <Col {...formAutoSize} >
              <Form.Item
                label="昵称"
                name="nickname"
                rules={[{required: true, message: '请输入昵称!'}, {
                  validator(rule, value, callback) {
                    callback(checkNickname(value))
                  }
                }]}
              >
                <Input/>
              </Form.Item>
            </Col>

            {
              mode == "add"
                ? (<Col {...formAutoSize} >
                  <Form.Item
                    label="密码"
                    name="password"
                    rules={[{required: true, message: '请输入密码!'}, {
                      validator(rule, value, callback) {
                        callback(checkPassword(value))
                      }
                    }]}
                  >
                    <Input.Password/>
                  </Form.Item>
                </Col>)
                : null
            }

            <Col {...formAutoSize} >
              <Form.Item
                label="角色"
                name="roles"
              >
                <Select
                  mode="multiple"
                  fieldNames={{label: "name", value: "id"}}
                  loading={roleListLoading}
                  options={roleList}
                  value={selRoles}
                  tagRender={tagRender}
                />
              </Form.Item>
            </Col>
            <Col {...formAutoSize} >
              <Form.Item
                label="性别"
                name="sex"
                rules={[{required: true, message: '请输入性别!'}]}
              >
                <Select>
                  <Select.Option key="man">男</Select.Option>
                  <Select.Option key="woman">女</Select.Option>
                  <Select.Option key="unknown">保密</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col {...formAutoSize} >
              <Form.Item
                label="手机号"
                name="phone"
                rules={[{required: true, message: '请输入手机号!'}, {
                  validator(ruleObj, val, callback) {
                    callback(checkPhone(val))
                  }
                }]}
              >
                <Input/>
              </Form.Item>
            </Col>

            <Col {...formAutoSize} >
              <Form.Item
                label="邮箱"
                name="email"
                rules={[{required: true, message: '请输入邮箱"!'}, {
                  validator(ruleObj, val, callback) {
                    callback(checkEmail(val))
                  }
                }]}
              >
                <Input/>
              </Form.Item>
            </Col>


            <Col span={24}>
              <Form.Item
                label="描述"
                name="description"
              >
                <Input.TextArea
                  allowClear
                  showCount
                  maxLength={100}
                  autoSize={{maxRows: 6, minRows: 2}}
                  style={{height: 500}}/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </>
    );
  }

  useEffect(() => {
      if (open && (["edit", "detail"].includes(mode) && id)) {
        getDetail()
      }
    }, [open, mode, id]
  )

  return (
    <Drawer
      title={titleMap[mode]}
      placement="right"
      width={"50%"}
      onClose={handleClose}
      open={open}
      style={{position: 'absolute'}}
      extra={genSubmitBlock()}
    >
      <ComLoading spinning={drawerLoading}>
        {mode && (mode == "detail" ? genDetail() : genForm())}
      </ComLoading>
    </Drawer>
  )
}

export default function UserList() {
  const initFormData = {
    username: "",
    email: "",
    phone: "",
    roles: [],
  }

  const [drawerState, setDrawerState] = useState({id: "", mode: "detail", open: false} as UserDrawerState);
  const [isLoading, setIsLoading] = useState(false);
  const [selTableKeys, setSelTableKeys] = useState([] as any[]);
  const [model, modelContextHolder] = Modal.useModal()
  const dispatch = useDispatch()
  const ref = useRef() as any
  const {loading: roleListLoading, data: roleList} = useSelector(selectRoleList);

  const onSearch = (params: ReqFindUserPagingBody) => {
    return findUserPaging(params).then(res => res.data) as Promise<ResTableData<ResUserBaseInfo>>
  }

  const onAddUser = () => {
    setDrawerState({id: "", mode: "add", open: true})
  }

  const onEditUser = (id: string) => {
    setDrawerState({id, mode: "edit", open: true})
  }

  const onDetail = (id: string) => {
    setDrawerState({id, mode: "detail", open: true})
  }

  const onDeleteUser = (ids: string[]) => {
    if (!ids.length) {
      message.warning("请选择要删除的数据")
    } else {
      model.confirm({
        title: "警告",
        content: <h1>该操作将会删除 <Tag color={"red"}>{ids.length}</Tag>条数据,请确认</h1>,
        okText: "确定",
        cancelText: "取消",
        onOk() {
          setIsLoading(true)
          deleteUser({ids}).then(() => {
            message.success("删除成功")
            onDataChange()
          }).finally(() => setIsLoading(false))
        },
      })
    }
  }

  const onDataChange = () => {
    ref.current.reqSearch()
  }

  const onTableChange: TableRowSelection<ResUserBaseInfo>["onChange"] = (selectedRowKeys, selectedRows, info) => {
    setSelTableKeys(selectedRowKeys)
  }

  const genSearchFormItems = () => {
    return (
      <>
        <Form.Item
          name="username"
          label="用户名"
        ><Input placeholder="placeholder"/></Form.Item>
        <Form.Item
          name="email"
          label="邮箱"
        ><Input placeholder="placeholder"/></Form.Item>
        <Form.Item
          name="phone"
          label="电话号码"
        ><Input placeholder="placeholder"/></Form.Item>
        <Form.Item
          name="roles"
          label="角色"
        >
          <Select
            mode="multiple"
            showArrow
            fieldNames={{label: "name", value: "id"}}
            tagRender={tagRender}
            loading={roleListLoading}
            options={roleList}>
          </Select>
        </Form.Item>
      </>
    )
  }
  const genOperationBtn = () => {
    return (
      <Space>
        <Button type="primary" onClick={() => {
          onAddUser()
        }}>新增</Button>
        <Button type="primary" danger onClick={() => {
          onDeleteUser(ref?.current?.getRowSelKeys())
        }}>批量删除</Button>
      </Space>
    )
  }

  useEffect(() => {
    dispatch<any>(asyncRoleList({}))
  }, []);

  const columns = useMemo(() => genColumns(onDetail, onEditUser, onDeleteUser), []);
  return (
    <SearchTableTemp
      ref={ref}
      isLoading={isLoading}
      initFormData={initFormData}
      formItems={genSearchFormItems()}
      tableProps={{
        rowSelection: {
          onChange: onTableChange,
          selectedRowKeys: selTableKeys,
        }
      }}
      columns={columns}
      onSearch={onSearch}
      operationBlock={genOperationBtn()}>
      <UserDrawer onSubmit={onDataChange} onClose={() => {
        setDrawerState({
          mode: "", open: false, id: ""
        })
      }} {...drawerState}/>
      {modelContextHolder}
    </SearchTableTemp>
  )
}