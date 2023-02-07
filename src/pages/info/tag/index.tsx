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
  addTag,
  findTag,
  findTagPaging,
  updateTag,
  deleteTag
} from "@/api/tag";
import {checkDescription} from "@/utils/rules/common";
import {useDispatch, useSelector} from "react-redux";
import {asyncTagTypes, selectTagTypeList} from "@/store/reducers/tag";

type TagDrawerState = {
  mode: "add" | "edit" | "detail" | "";
  id?: string;
  open: boolean;
}
type TagDrawerProps = TagDrawerState & {
  onClose: () => void
  onSubmit: () => void
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

function TagDrawer(props: TagDrawerProps) {
  const {mode, id = "", open, onClose, onSubmit} = props;

  const formAutoSize = {xxl: 12, xl: 12, lg: 12, md: 12, sm: 24, xs: 24};
  const titleMap = {
    "": "",
    add: "新增标签",
    edit: "编辑标签",
    detail: "标签详情"
  }

  const [userForm] = Form.useForm()
  const {loading: tagTypeLoading, data: typeList} = useSelector(selectTagTypeList)
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [permissionDetail, setTagDetail] = useState({} as ResTagDetail);

  const getDetail = () => {
    setDrawerLoading(true)
    findTag({id}).then(res => {
      const {data} = res;

      // 编译错误 ？ 没有判断会提示 变量无声明
      if (res.code == 200) {
        ["edit", "add"].includes(mode)
          ? userForm.setFieldsValue(data)
          : setTagDetail(data)
      }

    }).finally(() => setDrawerLoading(false))
  }

  const onAddTag = (params: ReqAddTagBody) => {
    return addTag(params).then(res => {
      message.success("添加成功")
      return res
    })
  }

  const onUpdateTag = (params: ReqUpdateTagBody) => {
    setDrawerLoading(true)
    return updateTag(params).then(res => {
      message.success("修改成功")
      return res
    })
  }


  const submitForm = (formData: ReqAddTagBody) => {
    setDrawerLoading(true)
    Promise.resolve().then(() => {
      return mode == "add"
        ? onAddTag(formData)
        : onUpdateTag({id, ...formData})
    }).then(_ => {
      onSubmit()
      handleClose()
    }).finally(() => setDrawerLoading(false))

    setDrawerLoading(false)
  }

  const handleClose = () => {
    setTagDetail({} as ResTagDetail)
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
        <Descriptions.Item label="标签名" span={2}>{permissionDetail.name}</Descriptions.Item>
        <Descriptions.Item label="类型" span={2}>{permissionDetail.type}</Descriptions.Item>
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
              label="标签名"
              name="name"
              rules={[{required: true, message: "请输入标签名"}, {
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
              <Select
                showArrow
                fieldNames={{label: "name", value: "id"}}
                tagRender={tagRender}
                loading={tagTypeLoading}
                options={typeList}>
              </Select>
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

function genColumns(onDetail: any, onEdit: any, onDelete: any): ColumnsType<ResTagPaging> {
  return [
    {
      title: '标签名',
      dataIndex: 'name',
      key: 'name',
      render: (text, {id}) => {
        return <a onClick={() => onDetail(id)}>{text}</a>
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (data, {type}) => {
        return (
          < Tag color="green"> {type}</Tag>
        )
      }
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

function TagManager() {
  const initFormData = {
    name: "",
    type: [],
    value: "",
    description: "",
    id: "",
  }

  const {loading: tagTypeLoading, data: typeList} = useSelector(selectTagTypeList)
  const [drawerState, setDrawerState] = useState({id: "", mode: "detail", open: false} as TagDrawerState);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const ref = useRef() as any
  const [model, modelContextHolder] = Modal.useModal()

  const onSearch = (params: ReqFindTagPagingBody) => {
    return findTagPaging(params).then(res => res.data) as Promise<ResTableData<ResUserBaseInfo>>
  }

  const onAddTag = () => {
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
          deleteTag({ids}).then(() => {
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
          label="标签名"
        ><Input/></Form.Item>
        <Form.Item
          name="type"
          label="类型"
        >
          <Select
            showArrow
            mode="multiple"
            fieldNames={{label: "name", value: "id"}}
            tagRender={tagRender}
            loading={tagTypeLoading}
            options={typeList}>
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
          onAddTag()
        }}>新增</Button>
        <Button type="primary" danger onClick={() => {
          onDelete(ref?.current?.getRowSelKeys())
        }}>批量删除</Button>
      </Space>
    )
  }

  const columns = useMemo(() => genColumns(onDetail, onEdit, onDelete), []);

  useEffect(() => {
    dispatch<any>(asyncTagTypes())
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
      <TagDrawer onSubmit={onDataChange} onClose={() => {
        setDrawerState({
          mode: "", open: false, id: ""
        })
      }} {...drawerState}/>
      {modelContextHolder}
    </SearchTableTemp>
  )
}

export default TagManager