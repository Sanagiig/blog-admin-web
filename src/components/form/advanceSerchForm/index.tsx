import React, {useState, Fragment, ReactNode, Children, ReactElement} from "react";
import {Button, Col, Form, FormProps, Row} from "antd";
import {DownOutlined, UpOutlined} from "@ant-design/icons";

export type AdvFormProps = FormProps & {
  children: ReactNode //| ReactNode[]
}
const AdvancedSearchForm = (props: AdvFormProps) => {
  let {children} = props
  const [expand, setExpand] = useState(false);
  const [form] = Form.useForm();
  const disChildren: JSX.Element[] = [];
  const minItemCount = 6
  // @ts-ignore
  const curChildren = children.type && children.type == Fragment
    // @ts-ignore
    ? children.props.children
    : Children.toArray(children)

const getFields = () => {
  const count = expand ? curChildren.length : minItemCount;
  for (let i = 0; i < count; i++) {
    disChildren.push(
      <Col span={8} key={`col-${i}`}>
        {curChildren[i]}
      </Col>,
    );
  }
  return disChildren;
};

const getSearchBtn = () => {
  const expandBtn = curChildren.length <= minItemCount
    ? null
    : <a
      style={{fontSize: 12}}
      onClick={() => {
        setExpand(!expand);
      }}
    >
      {expand
        ? (<span><UpOutlined/>收起 </span>)
        : (<span><DownOutlined/>展开 </span>)
      }
    </a>

  return (

    <Col span={24} style={{textAlign: 'right'}}>
      <Button type="primary" htmlType="submit">
        查询
      </Button>
      <Button
        style={{margin: '0 8px'}}
        onClick={() => {
          form.resetFields();
        }}
      >
        清除
      </Button>
      {expandBtn}
    </Col>

  )
}


return (
  <Form
    form={form}
    name="advanced_search"
    className="ant-advanced-search-form"
    labelCol={{span: 6}}
    {...props}
  >
    <Row gutter={24}>{getFields()}</Row>
    <Row>{getSearchBtn()}</Row>
  </Form>
);
}
;

export default AdvancedSearchForm