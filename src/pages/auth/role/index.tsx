import React, {useEffect, useMemo, useRef, useState} from "react";
import {
  Button,
  Col,
  Descriptions, Drawer,
  Form,
  FormProps,
  Image,
  Input,
  message, Modal,
  Row,
  Select,
  SelectProps,
  Space,
  Tag
} from "antd";
import {ColumnsType} from "antd/es/table";
import SearchTableTemp from "@/components/templates/searchTableTemp";
import ComLoading from "@/components/loading/comLoading";
import {
  addRole,
  findRole,
  findRolePaging,
  updateRole,
  deleteRole
} from "@/api/role";
import {useDispatch, useSelector} from "react-redux";
import {asyncPermissionList, selectPermissionList} from "@/store/reducers/permission";
import {checkDescription, checkName} from "@/utils/rules/common";

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

type RoleDrawerState = {
  mode: "add" | "edit" | "detail" | "";
  id?: string;
  open: boolean;
}
type RoleDrawerProps = RoleDrawerState & {
  onClose: () => void
  onSubmit: () => void
}

function RoleDrawer(props: RoleDrawerProps) {
  const {mode, id = "", open, onClose, onSubmit} = props;

  const formAutoSize = {xxl: 12, xl: 12, lg: 12, md: 12, sm: 24, xs: 24};
  const titleMap = {
    "": "",
    add: "新增权限",
    edit: "编辑权限",
    detail: "权限详情"
  }

  const [userForm] = Form.useForm()
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [roleDetail, setRoleDetail] = useState({} as ResRoleDetail);
  const [permissionVal, setPermissionVal] = useState([] as any[])
  const {
    loading: permisionListLoading,
    data: permissionList
  } = useSelector(selectPermissionList)

  console.log("permissionVal", permissionVal, roleDetail)
  const getDetail = () => {
    setDrawerLoading(true)
    findRole({id}).then(res => {
      const {data} = res;

      // 编译错误 ？ 没有判断会提示 变量无声明
      if (res.code == 200) {
        if (["edit", "add"].includes(mode)) {
          userForm.setFieldsValue({
            ...data,
            permissions: (data.permissions || []).map(item => item.id),
          })
        } else {
          setRoleDetail(data)
        }
      }

    }).finally(() => setDrawerLoading(false))
  }

  const onAddRole = (params: ReqAddRoleBody) => {
    return addRole(params).then(res => {
      message.success("添加成功")
      return res
    })
  }

  const onUpdateRole = (params: ReqUpdateRoleBody) => {
    setDrawerLoading(true)
    return updateRole(params).then(res => {
      message.success("修改成功")
      return res
    })
  }


  const submitForm = (formData: ReqAddRoleBody) => {
    setDrawerLoading(true)
    Promise.resolve().then(() => {
      return mode == "add"
        ? onAddRole(formData)
        : onUpdateRole({id, ...formData})
    }).then(_ => {
      onSubmit()
      handleClose()
    }).finally(() => setDrawerLoading(false))

    setDrawerLoading(false)
  }

  const handleClose = () => {
    setRoleDetail({} as ResRoleDetail)
    userForm.resetFields()
    onClose()
  }

  const onFinish: FormProps["onFinish"] = async (formData) => {
    submitForm(formData)
  }

  const genDetail = () => (
    <>
      <Descriptions bordered>
        <Descriptions.Item label="id" span={4}>{roleDetail.id}</Descriptions.Item>
        <Descriptions.Item label="角色名" span={2}>{roleDetail.name}</Descriptions.Item>
        <Descriptions.Item label="code" span={2}>{roleDetail.code}</Descriptions.Item>
        <Descriptions.Item label="权限" span={4}>
          {(roleDetail.permissions || []).map(p => {
            return <Tag color="green">{p.name}</Tag>
          })}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间" span={2}>{roleDetail.createdAt}</Descriptions.Item>
        <Descriptions.Item label="修改时间" span={2}>{roleDetail.updatedAt}</Descriptions.Item>
        <Descriptions.Item label="描述" span={4}>{roleDetail.description}</Descriptions.Item>
      </Descriptions>
    </>
  )

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
    return (<>
        <Form
          name="userForm"
          form={userForm}
          initialValues={roleDetail}
          layout="vertical"
          labelCol={{span: "100px"}}
          wrapperCol={{span: 24}}
          onFinish={onFinish}
        >
          <Row gutter={[16, 0]} wrap>
            <Col {...formAutoSize} >
              <Form.Item
                label="角色名"
                name="name"
                rules={[{required: true, message: "请输入角色名"}, {
                  validator(rule, value, callback) {
                    callback(checkName(value))
                  }
                }]}
              >
                <Input/>
              </Form.Item>
            </Col>

            <Col {...formAutoSize} >
              <Form.Item
                label="code"
                name="code"
                rules={[{required: true, message: '请输入code!'}]}
              >
                <Input/>
              </Form.Item>
            </Col>

            <Col {...formAutoSize} >
              <Form.Item
                label="权限"
                name="permissions"
                rules={[{required: true, message: '请选择权限!'}]}
              >
                <Select
                  showArrow
                  allowClear
                  mode="multiple"
                  tagRender={tagRender}
                  loading={permisionListLoading}
                  fieldNames={{label: "name", value: "id"}}
                  value={permissionVal}
                  options={permissionList}/>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="描述"
                name="description"
                rules={[{
                  validator(ruleObj, value, callback) {
                    callback(checkDescription(value))
                  }
                }]}
              >
                <Input.TextArea
                  allowClear
                  showCount
                  maxLength={100}
                  autoSize={{maxRows: 6, minRows: 2}}/>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </>
    )
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

function genColumns(onDetail: any, onEdit: any, onDelete: any): ColumnsType<ResRolePaging> {
  return [
    {
      title: '角色名',
      dataIndex: 'name',
      key: 'name',
      render: (text, {id}) => {
        return <a onClick={() => onDetail(id)}>{text}</a>
      },
    },
    {
      title: 'code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
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
      title: '操作',
      key: 'action',
      render: (_, {id}) => (
        <>
          <Button type="link" onClick={() => {
            onEdit(id)
          }}>编辑</Button>
          <Button type="link" danger onClick={() => {
            onDelete([id])
          }}>删除</Button>
        </>
      ),
    },
  ];
}

function RoleManager() {
  const initFormData = {
    name: "",
    code: "",
    type: "",
    value: "",
    description: "",
    id: "",
    roles: [],
  }

  const [drawerState, setDrawerState] = useState({id: "", mode: "detail", open: false} as RoleDrawerState);
  const [isLoading, setIsLoading] = useState(false);
  const [model, modelContextHolder] = Modal.useModal()
  const dispatch = useDispatch()
  const {
    loading: permisionListLoading,
    data: permissionList
  } = useSelector(selectPermissionList)
  const ref = useRef() as any

  const onSearch = (params: ReqFindRolePagingBody) => {
    return findRolePaging(params).then(res => res.data) as Promise<ResTableData<ResUserBaseInfo>>
  }

  const onAddRole = () => {
    setDrawerState({id: "", mode: "add", open: true})
  }

  const onEdit = (id: string) => {
    setDrawerState({id, mode: "edit", open: true})
  }

  const onDetail = (id: string) => {
    setDrawerState({id, mode: "detail", open: true})
  }

  const onDelete = (ids: string[]) => {
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
          deleteRole({ids}).then(() => {
            message.success("删除成功")
            onDataChange()
          }).finally(() => {
              setIsLoading(false)
            }
          )
        },
      })
    }
  }

  const onDataChange = () => {
    ref.current.reqSearch()
  }

  const genSearchFormItems = () => {
    return (
      <>
        <Form.Item
          name="name"
          label="角色"
        ><Input/></Form.Item>
        <Form.Item
          name="code"
          label="code"
        ><Input/></Form.Item>
        <Form.Item
          name="permissions"
          label="权限"
        >
          <Select
            showArrow
            allowClear
            loading={permisionListLoading}
            mode="multiple"
            tagRender={tagRender}
            fieldNames={{label: "name", value: "id"}}
            options={permissionList}>
          </Select>
        </Form.Item>
        <Form.Item
          name="description"
          label="描述"
        >
          <Input/>
        </Form.Item>
      </>
    )
  }
  const genOperationBtn = () => {
    return (
      <Space>
        <Button type="primary" onClick={() => {
          onAddRole()
        }}>新增</Button>
        <Button type="primary" danger onClick={() => {
          onDelete(ref?.current?.getRowSelKeys())
        }}>批量删除</Button>
      </Space>
    )
  }

  const columns = useMemo(() => genColumns(onDetail, onEdit, onDelete), []);

  useEffect(() => {
    dispatch<any>(asyncPermissionList({}))
  }, []);

  return (
    <SearchTableTemp
      ref={ref}
      isLoading={isLoading}
      initFormData={initFormData}
      formItems={genSearchFormItems()}
      columns={columns}
      withSelection="checkbox"
      onSearch={onSearch}
      operationBlock={genOperationBtn()}>
      <RoleDrawer onSubmit={onDataChange} onClose={() => {
        setDrawerState({
          mode: "", open: false, id: ""
        })
      }} {...drawerState}/>
      {modelContextHolder}
    </SearchTableTemp>
  )
}

export default RoleManager