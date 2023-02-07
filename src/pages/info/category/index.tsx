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
  addCategory,
  findCategory,
  findCategoryPaging,
  updateCategory,
  deleteCategory
} from "@/api/category";
import {TableRowSelection} from "antd/es/table/interface";
import {checkDescription} from "@/utils/rules/common";
import {asyncDictionaryTree, selectDictionaryTree} from "@/store/reducers/dictionary";
import {
  asyncCategoryTree,
  asyncCategoryTypes,
  selectCategoryTree,
  selectCategoryTypeList
} from "@/store/reducers/category";
import {useDispatch, useSelector} from "react-redux";
import SearchTreeTableTemp from "@/components/templates/searchTreeTableTemp";
import {selectTagTypeList} from "@/store/reducers/tag";

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

type CategoryDrawerState = {
  mode: "add" | "edit" | "detail" | "";
  parentID?: string;
  id?: string;
  open: boolean;
}
type CategoryDrawerProps = CategoryDrawerState & {
  onClose: () => void
  onSubmit: () => void
}

function CategoryDrawer(props: CategoryDrawerProps) {
  const {mode,parentID = "", id = "", open, onClose, onSubmit} = props;

  const formAutoSize = {xxl: 12, xl: 12, lg: 12, md: 12, sm: 24, xs: 24};
  const titleMap = {
    "": "",
    add: "新增分类",
    edit: "编辑分类",
    detail: "分类详情"
  }

  const [userForm] = Form.useForm()
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [permissionDetail, setCategoryDetail] = useState({} as ResCategoryDetail);
  const {data: typeList} = useSelector(selectCategoryTypeList)

  const getDetail = () => {
    setDrawerLoading(true)
    findCategory({id}).then(res => {
      const {data} = res;

      // 编译错误 ？ 没有判断会提示 变量无声明
      if (res.code == 200) {
        ["edit", "add"].includes(mode)
          ? userForm.setFieldsValue(data)
          : setCategoryDetail(data)
      }

    }).finally(() => setDrawerLoading(false))
  }

  const onAddCategory = (params: ReqAddCategoryBody) => {
    return addCategory(params).then(res => {
      message.success("添加成功")
      return res
    })
  }

  const onUpdateCategory = (params: ReqUpdateCategoryBody) => {
    setDrawerLoading(true)
    return updateCategory(params).then(res => {
      message.success("修改成功")
      return res
    })
  }


  const submitForm = (formData: ReqAddCategoryBody) => {
    setDrawerLoading(true)
    Promise.resolve().then(() => {
      return mode == "add"
        ? onAddCategory({...formData,parentID})
        : onUpdateCategory({id, ...formData})
    }).then(_ => {
      onSubmit()
      handleClose()
    }).finally(() => setDrawerLoading(false))

    setDrawerLoading(false)
  }

  const handleClose = () => {
    setCategoryDetail({} as ResCategoryDetail)
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
        <Descriptions.Item label="分类名" span={2}>{permissionDetail.name}</Descriptions.Item>
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
              label="分类名"
              name="name"
              rules={[{required: true, message: "请输入分类名"}, {
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
                options={typeList}/>
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

function genColumns(onDetail: any, onEdit: any, onDelete: any): ColumnsType<ResCategoryPaging> {
  return [
    {
      title: '分类名',
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

function CategoryManager() {
  const initFormData = {
    name: "",
    type: [],
    description: "",
  }

  const [drawerState, setDrawerState] = useState({id: "", mode: "detail", open: false} as CategoryDrawerState);
  const [isLoading, setIsLoading] = useState(false);
  const [parentID, setParentID] = useState(null as any);
  const {loading: treeLoading, data: treeData} = useSelector(selectCategoryTree)
  const {data: typeList} = useSelector(selectCategoryTypeList)
  const dispatch = useDispatch()
  const ref = useRef() as any
  const [model, modelContextHolder] = Modal.useModal()

  const onSearch = (params: ReqFindCategoryPagingBody) => {
    return findCategoryPaging({
      ...params,
      parentID
    }).then(res => res.data) as Promise<ResTableData<ResCategoryPaging>>
  }

  const onAddCategory = () => {
    setDrawerState({id: "", parentID, mode: "add", open: true})
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
          deleteCategory({ids}).then(() => {
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
    dispatch<any>(asyncCategoryTree())
    ref.current.reqSearch()
  }

  const genSearchFormItems = () => {
    return (
      <>
        <Form.Item
          name="name"
          label="分类名"
        ><Input/></Form.Item>
        <Form.Item
          name="type"
          label="类型"
        >
          <Select
            showArrow
            tagRender={tagRender}
            mode="multiple"
            fieldNames={{label: "name", value: "id"}}
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
          onAddCategory()
        }}>新增</Button>
        <Button type="primary" danger onClick={() => {
          onDelete(ref?.current?.getRowSelKeys())
        }}>批量删除</Button>
      </Space>
    )
  }

  const columns = useMemo(() => genColumns(onDetail, onEdit, onDelete), []);

  useEffect(() => {
    dispatch<any>(asyncCategoryTree())
    dispatch<any>(asyncCategoryTypes())
  }, []);

  useEffect(() => {
    ref.current.reqSearch()
  }, [parentID]);

  return (
    <SearchTreeTableTemp
      ref={ref}
      isLoading={isLoading}
      initFormData={initFormData}
      formItems={genSearchFormItems()}
      columns={columns}
      withSelection="checkbox"
      onSearch={onSearch}
      operationBlock={genOperationBtn()}
      treeData={treeData}
      treeProps={{
        fieldNames: {title: "name", key: "id", children: "children"},
        onSelect(selKeys) {
          setParentID(selKeys[0])
        }
      }}>
      <CategoryDrawer onSubmit={onDataChange} onClose={() => {
        setDrawerState({
          mode: "", open: false, id: ""
        })
      }} {...drawerState}/>
      {modelContextHolder}
    </SearchTreeTableTemp>
  )
}

export default CategoryManager