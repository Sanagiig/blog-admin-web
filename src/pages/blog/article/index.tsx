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
  Tag, TreeSelect
} from "antd";
import {ColumnsType} from "antd/es/table";
import SearchTableTemp from "@/components/templates/searchTableTemp";
import ComLoading from "@/components/loading/comLoading";
import {rules} from "@/utils";
import {
  addArticle,
  findArticle,
  findArticlePaging,
  updateArticle,
  deleteArticle
} from "@/api/article";
import {TableRowSelection} from "antd/es/table/interface";
import {checkDescription} from "@/utils/rules/common";
import {useDispatch, useSelector} from "react-redux";
import {asyncTagList, selectTagList} from "@/store/reducers/tag";
import {asyncCategoryTree, selectCategoryTree} from "@/store/reducers/category";

import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

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

type ArticleDrawerState = {
  mode: "add" | "edit" | "detail" | "";
  id?: string;
  open: boolean;
}
type ArticleDrawerProps = ArticleDrawerState & {
  onClose: () => void
  onSubmit: () => void
}

function ArticleDrawer(props: ArticleDrawerProps) {
  const {mode, id = "", open, onClose, onSubmit} = props;

  const formAutoSize = {xxl: 12, xl: 12, lg: 12, md: 12, sm: 24, xs: 24};
  const titleMap = {
    "": "",
    add: "新增文章",
    edit: "编辑文章",
    detail: "文章详情"
  }

  const [userForm] = Form.useForm()
  const [drawerLoading, setDrawerLoading] = useState(false);
  const {loading: tagLoading, data: tagList} = useSelector(selectTagList);
  const {loading: categoryTreeLoading, data: categoryTree} = useSelector(selectCategoryTree);
  const [articleDetail, setArticleDetail] = useState({
    tags: [] as string[],
  } as any);

  const getDetail = () => {
    setDrawerLoading(true)
    findArticle({id}).then(res => {
      const {data} = res;
      // 编译错误 ？ 没有判断会提示 变量无声明
      if (res.code == 200) {

        ["edit", "add"].includes(mode)
          ? userForm.setFieldsValue({
            ...data,
            categoryID: data.category.id,
            tags: data.tags.map(tag => tag.id)
          })
          : setArticleDetail({
            ...data,
            category: data.category.name,
            tags: data.tags.map(tag => tag.name)
          })
      }

    }).finally(() => setDrawerLoading(false))
  }

  const onAddArticle = (params: ReqAddArticleBody) => {
    return addArticle(params).then(res => {
      message.success("添加成功")
      return res
    })
  }

  const onUpdateArticle = (params: ReqUpdateArticleBody) => {
    setDrawerLoading(true)
    return updateArticle(params).then(res => {
      message.success("修改成功")
      return res
    })
  }


  const submitForm = (formData: ReqAddArticleBody) => {
    setDrawerLoading(true)
    Promise.resolve().then(() => {
      return mode == "add"
        ? onAddArticle(formData)
        : onUpdateArticle({id, ...formData})
    }).then(_ => {
      onSubmit()
      handleClose()
    }).finally(() => setDrawerLoading(false))

    setDrawerLoading(false)
  }

  const handleClose = () => {
    setArticleDetail({} as ResArticleDetail)
    userForm.resetFields()
    onClose()
  }

  const onFinish: FormProps["onFinish"] = async (formData) => {
    submitForm(formData)
  }

  const genDetail = () => (
    <>
      <Descriptions bordered>
        <Descriptions.Item label="id" span={4}>{articleDetail.id}</Descriptions.Item>
        <Descriptions.Item label="文章名" span={2}>{articleDetail.title}</Descriptions.Item>
        <Descriptions.Item label="分类" span={2}>
          <Tag color="blue">{articleDetail.category}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="标签" span={4}>
          {(articleDetail.tags || []).map((tag: string) => {
            return <Tag color="green">{tag}</Tag>
          })}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间" span={2}>{articleDetail.createdAt}</Descriptions.Item>
        <Descriptions.Item label="修改时间" span={2}>{articleDetail.updatedAt}</Descriptions.Item>
        <Descriptions.Item label="描述" span={4}>{articleDetail.description}</Descriptions.Item>
        <Descriptions.Item span={4}>
          <ReactQuill value={articleDetail.content} />
        </Descriptions.Item>
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
    const modules = {
      toolbar: [
        [{'header': [1, 2, false]}],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        ['clean']
      ],
    }

    const formats = [
      'header',
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link', 'image'
    ]
    return (
      <>
        <Form
          name="userForm"
          form={userForm}
          initialValues={articleDetail}
          layout="vertical"
          labelCol={{span: "100px"}}
          wrapperCol={{span: 24}}
          onFinish={onFinish}
        >
          <Row gutter={[16, 0]} wrap>
            <Col {...formAutoSize} >
              <Form.Item
                label="文章标题"
                name="title"
                rules={[{required: true, message: "请输入文章标题"}, {
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
                label="分类"
                name="categoryID"
                rules={[{required: true, message: '请选择类型!'}]}
              >
                <TreeSelect
                  loading={categoryTreeLoading}
                  fieldNames={{label: "name", value: "id", children: "children"}}
                  treeData={categoryTree}
                />
              </Form.Item>
            </Col>

            <Col {...formAutoSize} >
              <Form.Item
                label="标签"
                name="tags"
                rules={[{required: true, message: '请选择标签!'}]}
              >
                <Select
                  showArrow
                  mode="multiple"
                  loading={tagLoading}
                  fieldNames={{label: "name", value: "id"}}
                  tagRender={tagRender}
                  options={tagList}/>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item
                label="内容"
                name="content"
                style={{height: "660px"}}
                rules={[{required: true, message: '请编辑内容!'}]}
              >
                <ReactQuill style={{height: "600px"}} theme="snow" formats={formats} modules={modules}/>
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

function genColumns(onDetail: any, onEdit: any, onDelete: any): ColumnsType<ResArticlePaging> {
  return [
    {
      title: '文章名',
      dataIndex: 'title',
      key: 'title',
      render: (text, {id}) => {
        return <a onClick={() => onDetail(id)}>{text}</a>
      },
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author',
      render: (data, {author}) => {
        return < Tag color="green"> {author.nickname}</Tag>
      }
    },
    {
      title: '标签',
      dataIndex: 'tag',
      key: 'tag',
      render: (data, {tags}) => {
        return tags.map(tag => {
          return < Tag color="green"> {tag.name}</Tag>
        })
      }
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      render: (data, {category}) => {
        return (
          < Tag color="green"> {category.name}</Tag>
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

function ArticleManager() {
  const initFormData = {
    title: "",
    tags: [],
    categories: [],
    description: "",
    content: "",
  }

  const [drawerState, setDrawerState] = useState({id: "", mode: "detail", open: false} as ArticleDrawerState);
  const [isLoading, setIsLoading] = useState(false);
  const [selTableKeys, setSelTableKeys] = useState([] as any[]);
  const {loading: tagLoading, data: tagList} = useSelector(selectTagList);
  const {loading: categoryTreeLoading, data: categoryTree} = useSelector(selectCategoryTree);

  const ref = useRef() as any
  const [model, modelContextHolder] = Modal.useModal()
  const dispatch = useDispatch();

  const onSearch = (params: ReqFindArticlePagingBody) => {
    return findArticlePaging(params).then(res => res.data) as Promise<ResTableData<ResArticlePaging>>
  }

  const onAddArticle = () => {
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
          deleteArticle({ids}).then(() => {
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
          name="title"
          label="文章标题"
        >
          <Input/>
        </Form.Item>
        <Form.Item
          name="categories"
          label="分类"
        >
          <TreeSelect
            treeLine
            treeCheckable
            loading={categoryTreeLoading}
            fieldNames={{label: "name", value: "id", children: "children"}}
            tagRender={tagRender}
            treeData={categoryTree}
          />
        </Form.Item>
        <Form.Item
          name="tags"
          label="标签"
        >
          <Select
            showArrow
            mode="multiple"
            loading={tagLoading}
            fieldNames={{label: "name", value: "id"}}
            tagRender={tagRender}
            options={tagList}/>
        </Form.Item>
        <Form.Item
          name="description"
          label="描述"
        >
          <Input/>
        </Form.Item>
        <Form.Item
          name="content"
          label="内容"
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
          onAddArticle()
        }}>新增</Button>
        <Button type="primary" danger onClick={() => {
          onDelete(ref?.current?.getRowSelKeys())
        }}>批量删除</Button>
      </Space>
    )
  }

  const columns = useMemo(() => genColumns(onDetail, onEdit, onDelete), []);

  useEffect(() => {
    dispatch<any>(asyncTagList({}))
    dispatch<any>(asyncCategoryTree())
  }, [])

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
      <ArticleDrawer onSubmit={onDataChange} onClose={() => {
        setDrawerState({
          mode: "", open: false, id: ""
        })
      }} {...drawerState}/>
      {modelContextHolder}
    </SearchTableTemp>
  )
}

export default ArticleManager