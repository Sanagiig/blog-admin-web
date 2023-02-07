import React, {
  forwardRef,
  useEffect,
  useState,
  memo,
  useRef,
  ReactElement,
  ReactNode,
  useImperativeHandle
} from 'react';
import {
  TableProps,
  FormProps
} from 'antd';
import type {ColumnsType} from 'antd/es/table';
import SearchTableLayout from "@/components/layout/searchTableLayout";
import AdvancedSearchForm, {AdvFormProps} from "@/components/form/advanceSerchForm"
import ComTable, {ComTableProps} from "@/components/table/comTable";
import style from "./style.module.scss"


export type SearchTableTempProps<FDT = any, TDT = any> = {
  initFormData: FDT;
  formItems: JSX.Element;
  formProps?: FormProps;
  tableTitle?: ReactElement;
  columns: ColumnsType<TDT>;
  dataSource?: TDT[];
  withSelection?: "checkbox" | "radio";
  tableProps?: TableProps<TDT>;
  onSearch: (data: FDT & ReqPaging) => Promise<ResTableData<TDT>> | ResTableData<TDT>;
  operationBlock?: JSX.Element | JSX.Element[];
  children?: ReactNode | ReactNode[];
  isLoading?: boolean
}

const SearchTableTemp = forwardRef(function (props: SearchTableTempProps, ref) {
  const {
    isLoading = false,
    initFormData,
    formItems,
    formProps,
    tableTitle,
    columns,
    dataSource = [],
    withSelection,
    onSearch,
    tableProps,
    operationBlock,
    children,
  } = props;

  const tableRef = useRef<any>(null);
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState(initFormData);
  const [pageInfo, setPageInfo] = useState({page: 1, pageSize: 10})
  const [total, setTotal] = useState(0)
  const [tableData, setTableData] = useState(dataSource)

  const reqSearch = () => {
    const params: ReqFindUserPagingBody = {
      ...formData,
      ...pageInfo,
    }

    if (loading) {
      return
    }

    const result = onSearch(params)

    if (result instanceof Promise) {
      setLoading(true)
      result.then(res => {
        setTotal(res.total)
        setTableData(res.list || [])
      }).catch(e => {
        console.error("SearchTableTemp search:", e)
      }).finally(() => setLoading(false))
    } else {
      setTotal(result.total)
      setTableData(result.list || [])
    }
  }

  const genSearch = () => {
    const onFinish: AdvFormProps["onFinish"] = async (values) => {
      setFormData(values)
    }

    return (
      <AdvancedSearchForm initialValues={initFormData} onFinish={onFinish} {...formProps}>
        {formItems}
      </AdvancedSearchForm>
    )
  }

  const genTable = () => {
    const onPageChange: ComTableProps["onPageChange"] = (pageInfo) => {
      setPageInfo(pageInfo)
    }

    return (
      <>
        <div className={style.table_title_bar}>
          <div className={style.title_block}>{tableTitle}</div>
          <div className={style.operation_block}>
            {operationBlock}
          </div>
        </div>

        <ComTable
          ref={tableRef}
          columns={columns}
          dataSource={tableData} total={total}
          onPageChange={onPageChange}
          withSelection={withSelection}
          {...tableProps}/>
      </>
    )
  }
  useImperativeHandle(ref, () => {
    return {
      reqSearch,
      ...tableRef.current
    }
  }, [onSearch])

  useEffect(() => {
    reqSearch()
  }, [formData, pageInfo])

  return (
    <SearchTableLayout search={genSearch()} table={genTable()} isLoading={loading || isLoading}>
      {children}
    </SearchTableLayout>
  )
})

export default memo(SearchTableTemp)