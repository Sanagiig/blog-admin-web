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
import {rules} from "@/utils";
import {
  addPermission,
  findPermission,
  findPermissionPaging,
  updatePermission,
  deletePermission
} from "@/api/permission";
import {TableRowSelection} from "antd/es/table/interface";
import {checkDescription} from "@/utils/rules/common";

type PermissionDrawerState = {
  mode: "add" | "edit" | "detail" | "";
  id?: string;
  open: boolean;
}
type PermissionDrawerProps = PermissionDrawerState & {
  onClose: () => void
  onSubmit: () => void
}

function PermissionDrawer(props: PermissionDrawerProps) {
  const {mode, id = "", open, onClose, onSubmit} = props;

  const desAutoSize = {xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1};
  const formAutoSize = {xxl: 12, xl: 12, lg: 12, md: 12, sm: 24, xs: 24};
  const titleMap = {
    "": "",
    add: "新增权限",
    edit: "编辑权限",
    detail: "权限详情"
  }

  const [userForm] = Form.useForm()
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [permissionDetail, setPermissionDetail] = useState({} as ResPermissionDetail);

  const getDetail = () => {
    setDrawerLoading(true)
    findPermission({id}).then(res => {
      const {data} = res;

      // 编译错误 ？ 没有判断会提示 变量无声明
      if (res.code == 200) {
        ["edit", "add"].includes(mode)
          ? userForm.setFieldsValue(data)
          : setPermissionDetail(data)
      }

    }).finally(() => setDrawerLoading(false))
  }

  const onAddPermission = (params: ReqAddPermissionBody) => {
    return addPermission(params).then(res => {
      message.success("添加成功")
      return res
    })
  }

  const onUpdatePermission = (params: ReqUpdatePermissionBody) => {
    setDrawerLoading(true)
    return updatePermission(params).then(res => {
      message.success("修改成功")
      return res
    })
  }


  const submitForm = (formData: ReqAddPermissionBody) => {
    setDrawerLoading(true)
    Promise.resolve().then(() => {
      return mode == "add"
        ? onAddPermission(formData)
        : onUpdatePermission({id, ...formData})
    }).then(_ => {
      onSubmit()
      handleClose()
    }).finally(() => setDrawerLoading(false))

    setDrawerLoading(false)
  }

  const handleClose = () => {
    setPermissionDetail({} as ResPermissionDetail)
    userForm.resetFields()
    onClose()
  }

  const onFinish: FormProps["onFinish"] = async (formData) => {
    submitForm(formData)
  }

  const genDetail = () => (
    <>
      <Descriptions bordered>
        <Descriptions.Item label="id" span={4}>{permissionDetail.id}</Descriptions.Item>
        <Descriptions.Item label="权限名" span={2}>{permissionDetail.name}</Descriptions.Item>
        <Descriptions.Item label="类型" span={2}>{permissionDetail.type}</Descriptions.Item>
        <Descriptions.Item label="code" span={2}>{permissionDetail.code}</Descriptions.Item>
        <Descriptions.Item label="权限值" span={2}>{permissionDetail.value}</Descriptions.Item>
        <Descriptions.Item label="创建时间" span={2}>{permissionDetail.createdAt}</Descriptions.Item>
        <Descriptions.Item label="修改时间" span={2}>{permissionDetail.updatedAt}</Descriptions.Item>
        <Descriptions.Item label="描述" span={4}>{permissionDetail.description}</Descriptions.Item>
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

  const genForm = () => (
    <>
      <Form
        name="userForm"
        form={userForm}
        initialValues={permissionDetail}
        layout="vertical"
        labelCol={{span: "100px"}}
        wrapperCol={{span: 24}}
        onFinish={onFinish}
      >
        <Row gutter={[16, 0]} wrap>
          <Col {...formAutoSize} >
            <Form.Item
              label="权限名"
              name="name"
              rules={[{required: true, message: "请输入权限名"}, {
                validator(rule, value, callback) {
                  const res = rules.common.checkName(value)
                  callback(res)
                }
              }]}
            >
              <Input/>
            </Form.Item>
          </Col>

          <Col {...formAutoSize} >
            <Form.Item
              label="类型"
              name="type"
              rules={[{required: true, message: '请选择类型!'}]}
            >
              <Input/>
            </Form.Item>
          </Col>

          <Col {...formAutoSize} >
            <Form.Item
              label="code"
              name="code"
              rules={[{required: true, message: '请选择code!'}]}
            >
              <Input/>
            </Form.Item>
          </Col>

          <Col {...formAutoSize} >
            <Form.Item
              label="权限值"
              name="value"
              rules={[{required: true, message: '请输入权限值!'}, {
                validator(rule, value, callback) {
                  const res = rules.permission.checkValue(value)
                  callback(res)
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

function genColumns(onDetail: any, onEdit: any, onDelete: any): ColumnsType<ResPermissionPaging> {
  return [
    {
      title: '权限名',
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
      title: 'type',
      dataIndex: 'type',
      key: 'type',
      render: (data, {type}) => {
        return (
          < Tag color="green"> {type}</Tag>
        )
      }
    },
    {
      title: '权限值',
      dataIndex: 'value',
      key: 'value',
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

function PermissionManager() {
  const initFormData = {
    name: "",
    code: "",
    type: "",
    value: "",
    description: "",
    id: "",
    roles: [],
  }

  let roleList: SelectProps["options"] = [
    {label: "1", value: 1},
    {label: "2", value: 2},
    {label: "3", value: 3},
    {label: "4", value: 4}
  ];

  const [drawerState, setDrawerState] = useState({id: "", mode: "detail", open: false} as PermissionDrawerState);
  const [isLoading, setIsLoading] = useState(false);
  const [selTableKeys, setSelTableKeys] = useState([] as any[]);
  const ref = useRef() as any
  const [model, modelContextHolder] = Modal.useModal()

  const onSearch = (params: ReqFindPermissionPagingBody) => {
    return findPermissionPaging(params).then(res => res.data) as Promise<ResTableData<ResUserBaseInfo>>
  }

  const onAddPermission = () => {
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
          deletePermission({ids}).then(() => {
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

  const onTableChange: TableRowSelection<ResUserBaseInfo>["onChange"] = (selectedRowKeys, selectedRows, info) => {
    setSelTableKeys(selectedRowKeys)
  }

  const genSearchFormItems = () => {
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

    return (
      <>
        <Form.Item
          name="roles"
          label="角色"
        >
          <Select mode="multiple" showArrow tagRender={tagRender} options={roleList}>
          </Select>
        </Form.Item>
        <Form.Item
          name="type"
          label="类型"
        >
          <Select showArrow tagRender={tagRender} options={roleList}>
          </Select>
        </Form.Item>
        <Form.Item
          name="name"
          label="权限名"
        ><Input/></Form.Item>
        <Form.Item
          name="code"
          label="code"
        ><Input/></Form.Item>
        <Form.Item
          name="value"
          label="权限值"
        ><Input/></Form.Item>
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
          onAddPermission()
        }}>新增</Button>
        <Button type="primary" danger onClick={() => {
          onDelete(ref?.current?.getRowSelKeys())
        }}>批量删除</Button>
      </Space>
    )
  }

  const columns = useMemo(() => genColumns(onDetail, onEdit, onDelete), []);

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
      <PermissionDrawer onSubmit={onDataChange} onClose={() => {
        setDrawerState({
          mode: "", open: false, id: ""
        })
      }} {...drawerState}/>
      {modelContextHolder}
    </SearchTableTemp>
  )
}

export default PermissionManager