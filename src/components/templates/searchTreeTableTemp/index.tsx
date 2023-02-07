import React, {forwardRef, useState, useMemo, Key} from "react";
import SearchTableTemp, {SearchTableTempProps} from "@/components/templates/searchTableTemp";
import {Button, Card, Input, Layout, Space, Tooltip, Tree, TreeProps} from "antd";
import {DownOutlined, LeftOutlined, MenuFoldOutlined, MenuUnfoldOutlined, RightOutlined} from "@ant-design/icons";
import {walk} from "@/utils/tree";
import {unrepeatedAdd} from "@/utils/array";

const {Sider, Content} = Layout;

function TriggerBtn({collapsed, onClick}: any) {
  const Icon = collapsed ? RightOutlined : LeftOutlined;
  return (
    <Tooltip title="展开或收起树形筛选空间">
      <Button
        onClick={onClick}
        type="primary"
        shape="circle"
        icon={<Icon/>}
        style={{
          position: "absolute",
          top: "50%",
          right: "0",
          zIndex: "999"
        }}/>
    </Tooltip>
  )
}

export type SearchTreeTableTemp = SearchTableTempProps & {
  treeTitle?: string;
  treeData: any[]
  onTreeSearch?: (val: string) => void
  treeProps?: TreeProps;
}
const SearchTreeTableTemp = forwardRef(function (props: SearchTreeTableTemp, ref) {
  const {treeTitle = "节点筛选", treeData = [], treeProps, onTreeSearch, ...searchTableProps} = props
  const {title = "name", key = "id", children = "children"} = treeProps!.fieldNames || {}
  const [collapsed, setCollapsed] = useState(true);
  const [sideWidth, setSideWidth] = useState(0);
  const [expandedKeys, setExpandedKeys] = useState([] as React.Key[]);
  const [searchValue, setSearchValue] = useState("");
  const genTreeDataList = (treeData: any[]) => {
    const res = [] as any[]
    walk(treeData, children, function (node, info) {
      res.push({[key]: node[key], [title]: node[title], parentID: info?.parentID})
    })
    return res;
  }

  const genAllParentKeys = (node: any, list: any[]) => {
    const res = ["", node[key]] as any[];
    let curNode = node;
    while (curNode?.parentID) {
      res.push(curNode.parentID)
      curNode = list.find(item => item[key] == curNode.parentID)
    }
    return res;
  }

  const _treeData = useMemo(() => {
    const loop = (data: any[]): any[] =>
      data.map((item) => {
        const strTitle = item[title] as string;
        const index = strTitle.indexOf(searchValue);
        const beforeStr = strTitle.substring(0, index);
        const afterStr = strTitle.slice(index + searchValue.length);
        const titleText =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="site-tree-search-value" style={{color: "orange"}}>{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{strTitle}</span>
          );
        if (item[children]) {
          return {[title]: titleText, [key]: item[key], [children]: loop(item[children])};
        }

        return {
          [title]: titleText,
          [key]: item[key],
        };
      });

    return loop(treeData);
  }, [searchValue, treeData]);

  const treeDataList = useMemo(() => {
    return genTreeDataList(treeData)
  }, [treeData]);

  const _onTreeSearch = (val: string) => {
    if (onTreeSearch) {
      onTreeSearch(val)
    } else {
      const newExpandedKeys = [] as React.Key[]
      if(val.length){
        treeDataList.forEach(node => {
          if (node[title].includes(val)) {
            unrepeatedAdd(newExpandedKeys,...genAllParentKeys(node,treeDataList))
          }
        })
      }

      setSearchValue(val)
      setExpandedKeys(newExpandedKeys);
    }
  }

  const onExpand:TreeProps["onExpand"] = (keys,info) => {
    setExpandedKeys(keys)
  }
  return (
    <Layout>
      <Layout className="site-layout">
        <Sider width={sideWidth} trigger={null} collapsible
               style={{background: "none"}}>
          {<TriggerBtn
            collapsed={collapsed}
            onClick={() => {
              setSideWidth(!collapsed ? 0 : 280)
              setCollapsed(!collapsed)
            }}/>}
          <Card style={{padding: 0, width: "100%", height: "100%"}}>
            <Space direction="vertical">
              <span style={{fontSize: "18px", fontWeight: "600", lineHeight: "30px"}}>{treeTitle}</span>
              <Input.Search style={{marginBottom: 8}} onSearch={_onTreeSearch}/>
              <Tree
                showLine
                defaultExpandAll
                // autoExpandParent
                treeData={_treeData}
                expandedKeys={expandedKeys}
                fieldNames={{title: "name", key: "id", children: "children"}}
                switcherIcon={<DownOutlined/>}
                onExpand={onExpand}
                {...treeProps}>
              </Tree>
            </Space>
          </Card>
        </Sider>

        <Layout style={{padding: '0 10px 0px'}}>
          <Content>
            <SearchTableTemp ref={ref} {...searchTableProps} />
          </Content>
        </Layout>
      </Layout>
    </Layout>)
})

export default SearchTreeTableTemp