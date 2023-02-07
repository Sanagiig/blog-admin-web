import {Card, LayoutProps, Spin} from "antd";
import {LoadingOutlined} from '@ant-design/icons';
import ComLoading from "@/components/loading/comLoading";
import style from "./style.module.scss"
import {ReactNode} from "react";

export type SearchTableLayoutProps = LayoutProps & {
  isLoading?: boolean;
  search: JSX.Element;
  table: JSX.Element;
  children: ReactNode | ReactNode[];
}

function SearchTableLayout(props: SearchTableLayoutProps) {
  const {search, table, isLoading = false, children} = props
  return (
    <div className={style.container}>
      <ComLoading spinning={isLoading}>
        <Card>
          <div className={style.search_block}>
            {search}
          </div>
        </Card>
        <br/>
        <Card>
          <div className={style.table_block}>
            {table}
          </div>
        </Card>
        {children}
      </ComLoading>

    </div>
  )
}

export default SearchTableLayout