import React, {forwardRef, useImperativeHandle, useState} from "react";
import {PaginationProps, Table, TableProps} from "antd";
import {TableRowSelection} from "antd/es/table/interface";
import {Arr} from "@/utils";

export type ComTableProps<T = any> = TableProps<T> & {
  page?: number;
  pageSize?: number;
  total?: number;
  withSelection?: "checkbox" | "radio";
  onPageChange?: (pageInfo: ReqPaging) => void
}
export default forwardRef(function ComTable(props: ComTableProps, ref) {
  const {
    page = 1,
    pageSize = 10,
    total = 0,
    columns,
    dataSource = [], withSelection, onPageChange
  } = props;
  const [pageInfo, setPageInfo] = useState({page, pageSize})

  const [tableSelKes, setTableSelKes] = useState([] as any[]);

  const rowSelection =
    !withSelection ? undefined : {
      type: withSelection,
      selectedRowKeys: tableSelKes,
      selections: [
        {
          key: "all",
          text: "全选",
          onSelect(currentRowKeys) {
            Arr.unrepeatedAdd(tableSelKes, ...currentRowKeys)
            setTableSelKes(tableSelKes.slice())
          }
        },
        {
          key: "invert",
          text: "反选",
          onSelect(currentRowKeys) {
            const curSelKeys: any[] = [];
            currentRowKeys.forEach((ck) => {
              if (tableSelKes.includes(ck)) {
                curSelKeys.push(ck)
              }
            })

            Arr.unrepeatedAdd(tableSelKes, ...currentRowKeys)
            Arr.unrepeatedRemove(tableSelKes, ...curSelKeys)
            setTableSelKes(tableSelKes.slice())
          }
        },
        {
          key: 'odd',
          text: '选单数行',
          onSelect: (currentRowKeys) => {
            let removeKeys = currentRowKeys
              .filter((_, index) => {
                return index % 2 !== 0;
              });
            Arr.unrepeatedAdd(tableSelKes, ...currentRowKeys)
            Arr.unrepeatedRemove(tableSelKes, ...removeKeys)
            setTableSelKes(tableSelKes.slice())
          },
        },
        {
          key: 'even',
          text: '选双数行',
          onSelect: (currentRowKeys) => {
            let removeKeys = currentRowKeys
              .filter((_, index) => {
                return index % 2 === 0;
              });
            Arr.unrepeatedAdd(tableSelKes, ...currentRowKeys)
            Arr.unrepeatedRemove(tableSelKes, ...removeKeys)
            setTableSelKes(tableSelKes.slice())
          },
        },
        {
          key: 'clear',
          text: '清除本页',
          onSelect: (currentRowKeys) => {
            Arr.unrepeatedRemove(tableSelKes, ...currentRowKeys)
            setTableSelKes(tableSelKes.slice())
          },
        },
        {
          key: 'clearAll',
          text: '清除所有',
          onSelect: (currentRowKeys) => {
            setTableSelKes([])
          },
        },
      ],
      onSelect(record, selected, selectedRows) {
        disposeTableSelKey(selected, [record[getTableRowKey()]])
        setTableSelKes(tableSelKes.slice())
      },
      onSelectAll(selected, selectedRows, changeRows) {
        const keys = Arr.extractVal(changeRows, getTableRowKey())

        disposeTableSelKey(selected, keys)
        setTableSelKes(tableSelKes.slice())
      },
    } as TableRowSelection<any>

  const getTableRowKey = () => {
    return (props && props.rowKey || "id") as string
  }

  const disposeTableSelKey = (selected: boolean, selectedKeys: any[]) => {
    selected
      ? Arr.unrepeatedAdd(tableSelKes, ...selectedKeys)
      : Arr.unrepeatedRemove(tableSelKes, ...selectedKeys)
  }

  const handlePageChange: PaginationProps["onChange"] = (page, pageSize) => {
    const pageInfo = {page, pageSize}
    setPageInfo(pageInfo)
    onPageChange && onPageChange(pageInfo)
  }

  useImperativeHandle(ref,() => {
    return {
      getRowSelKeys() {
        return tableSelKes
      }
    }
  }, [tableSelKes])

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={dataSource}
      rowSelection={rowSelection}
      {...props}
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        hideOnSinglePage: true,
        total: total,
        defaultPageSize: pageSize,
        onChange: handlePageChange,
        current: pageInfo.page,
        pageSize: pageInfo.pageSize
      }}/>

  )
})
