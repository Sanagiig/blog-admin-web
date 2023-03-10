import React, {useEffect, useMemo, useRef, useState} from "react";
import {
  Button,
  Col,
  Descriptions, Drawer,
  Form,
  FormProps,
  Image,
  Input, Layout,
  message, Modal,
  Row,
  Select,
  SelectProps,
  Space,
  Tag, Tooltip, TreeSelect
} from "antd";
import {ColumnsType} from "antd/es/table";
import SearchTableTemp from "@/components/templates/searchTableTemp";
import ComLoading from "@/components/loading/comLoading";
import {rules} from "@/utils";
import {
  addDictionary,
  findDictionary,
  findDictionaryPaging,
  updateDictionary,
  deleteDictionary, findDictionaryList
} from "@/api/dictionary";
import {TableRowSelection} from "antd/es/table/interface";
import {checkCode, checkDescription} from "@/utils/rules/common";
import {asyncDictionaryTree, selectDictionaryTree} from "@/store/reducers/dictionary";
import {useDispatch, useSelector} from "react-redux";
import {genComLimitText} from "@/utils/str";
import SearchTreeTableTemp from "@/components/templates/searchTreeTableTemp";
import {asyncCategoryTree} from "@/store/reducers/category";

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

type DictionaryDrawerState = {
  mode: "add" | "edit" | "detail" | "";
  parentID?: string;
  id?: string;
  open: boolean;
}
type DictionaryDrawerProps = DictionaryDrawerState & {
  onClose: () => void
  onSubmit: () => void
}

function DictionaryDrawer(props: DictionaryDrawerProps) {
  const {mode,parentID = "", id = "", open, onClose, onSubmit} = props;

  const desAutoSize = {xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1};
  const formAutoSize = {xxl: 12, xl: 12, lg: 12, md: 12, sm: 24, xs: 24};
  const titleMap = {
    "": "",
    add: "????????????",
    edit: "????????????",
    detail: "????????????"
  }

  const [userForm] = Form.useForm()
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [dictionaryDetail, setDictionaryDetail] = useState({} as ResDictionaryDetail);

  const getDetail = () => {
    setDrawerLoading(true)
    findDictionary({id}).then(res => {
      const {data} = res;

      // ???????????? ??? ????????????????????? ???????????????
      if (res.code == 200) {
        ["edit", "add"].includes(mode)
          ? userForm.setFieldsValue(data)
          : setDictionaryDetail(data)
      }

    }).finally(() => setDrawerLoading(false))
  }

  const onAddDictionary = (params: ReqAddDictionaryBody) => {
    return addDictionary(params).then(res => {
      message.success("????????????")
      return res
    })
  }

  const onUpdateDictionary = (params: ReqUpdateDictionaryBody) => {
    setDrawerLoading(true)
    return updateDictionary(params).then(res => {
      message.success("????????????")
      return res
    })
  }

  const submitForm = (formData: ReqAddDictionaryBody) => {
    setDrawerLoading(true)
    Promise.resolve().then(() => {
      return mode == "add"
        ? onAddDictionary({...formData,parentID})
        : onUpdateDictionary({id, ...formData})
    }).then(_ => {
      onSubmit()
      handleClose()
    }).finally(() => setDrawerLoading(false))

    setDrawerLoading(false)
  }

  const handleClose = () => {
    setDictionaryDetail({} as ResDictionaryDetail)
    userForm.resetFields()
    onClose()
  }

  const onFinish: FormProps["onFinish"] = async (formData) => {
    submitForm(formData)
  }

  const genDetail = () => (
    <>
      <Descriptions bordered>
        <Descriptions.Item label="id" span={4}>{dictionaryDetail.id}</Descriptions.Item>
        <Descriptions.Item label="parentID" span={4}>{dictionaryDetail.parentID}</Descriptions.Item>
        <Descriptions.Item label="??????" span={2}>{dictionaryDetail.name}</Descriptions.Item>
        <Descriptions.Item label="code" span={2}>{dictionaryDetail.code}</Descriptions.Item>
        <Descriptions.Item label="????????????" span={2}>{dictionaryDetail.createdAt}</Descriptions.Item>
        <Descriptions.Item label="????????????" span={2}>{dictionaryDetail.updatedAt}</Descriptions.Item>
        <Descriptions.Item label="??????" span={4}>{dictionaryDetail.description}</Descriptions.Item>
      </Descriptions>
    </>
  )

  const genSubmitBlock = () => {
    return !["add", "edit"].includes(mode) ? null : (
      <Space>
        <Button onClick={userForm.submit} type="primary">
          ??????
        </Button>
        <Button onClick={onClose}>??????</Button>
      </Space>)
  }

  const genForm = () => (
    <>
      <Form
        name="userForm"
        form={userForm}
        initialValues={dictionaryDetail}
        layout="vertical"
        labelCol={{span: "100px"}}
        wrapperCol={{span: 24}}
        onFinish={onFinish}
      >
        <Row gutter={[16, 0]} wrap>
          <Col {...formAutoSize} >
            <Form.Item
              label="??????"
              name="name"
              rules={[{required: true, message: "???????????????"}, {
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
              label="code"
              name="code"
              rules={[{required: true, message: '?????????code!'}, {
                validator(ruleObj, value, callback) {
                  callback(checkCode(value))
                }
              }]}
            >
              <Input/>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="??????"
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

function genColumns(onDetail: any, onEdit: any, onDelete: any): ColumnsType<ResDictionaryPaging> {
  return [
    {
      title: '??????',
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
      render: (data, {code}) => {
        return (
          < Tag color="green"> {code}</Tag>
        )
      }
    },
    {
      title: '??????',
      dataIndex: 'description',
      key: 'description',
      render: (data, {description}) => {
        const {tip, text} = genComLimitText(description)
        return (
          <Tooltip color="blue" title={tip}>
            <span>{text}</span>
          </Tooltip>
        )
      }
    },
    {
      title: '????????????',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '????????????',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
    },
    {
      title: '??????',
      key: 'action',
      render: (_, {id}) => (
        <>
          <Button type="link" onClick={() => {
            onEdit(id)
          }}>??????</Button>
          <Button type="link" danger onClick={() => {
            onDelete([id])
          }}>??????</Button>
        </>
      ),
    },
  ];
}

function DictionaryManager() {
  const initFormData = {
    name: "",
    type: [],
    description: "",
  }

  const [drawerState, setDrawerState] = useState({id: "", mode: "detail", open: false} as DictionaryDrawerState);
  const [isLoading, setIsLoading] = useState(false);
  const [parentID, setParentID] = useState(null as any);
  const {loading: treeLoading, data: treeData} = useSelector(selectDictionaryTree)
  const dispatch = useDispatch()
  const ref = useRef() as any
  const [model, modelContextHolder] = Modal.useModal()

  const onSearch = (params: ReqFindDictionaryPagingBody) => {
    return findDictionaryPaging({
      ...params,
      parentID
    }).then(res => res.data) as Promise<ResTableData<ResDictionaryPaging>>
  }

  const onAddDictionary = () => {
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
      message.warning("???????????????????????????")
    } else {
      model.confirm({
        title: "??????",
        content: <h1>????????????????????? <Tag color={"red"}>{ids.length}</Tag>?????????,?????????</h1>,
        okText: "??????",
        cancelText: "??????",
        onOk() {
          setIsLoading(true)
          deleteDictionary({ids}).then(() => {
            message.success("????????????")
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
    dispatch<any>(asyncDictionaryTree())
    ref.current.reqSearch()
  }

  const genSearchFormItems = () => {
    return (
      <>
        <Form.Item
          name="name"
          label="??????"
        ><Input/></Form.Item>
        <Form.Item
          name="code"
          label="code"
        >
          <Input/>
        </Form.Item>
        <Form.Item
          name="description"
          label="??????"
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
          onAddDictionary()
        }}>??????</Button>
        <Button type="primary" danger onClick={() => {
          onDelete(ref?.current?.getRowSelKeys())
        }}>????????????</Button>
      </Space>
    )
  }

  const columns = useMemo(() => genColumns(onDetail, onEdit, onDelete), []);

  useEffect(() => {
    dispatch<any>(asyncDictionaryTree())
  }, []);

  useEffect(() => {
    ref.current.reqSearch()
  }, [parentID]);


  return (
    <Layout>
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
        <DictionaryDrawer onSubmit={onDataChange} onClose={() => {
          setDrawerState({
            mode: "", open: false, id: ""
          })
        }} {...drawerState}/>
        {modelContextHolder}
      </SearchTreeTableTemp>
    </Layout>

  )
}

export default DictionaryManager