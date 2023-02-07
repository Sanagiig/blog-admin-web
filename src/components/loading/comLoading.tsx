import {Spin, SpinProps} from "antd";
import {LoadingOutlined} from "@ant-design/icons";

export type ComLoadingProps = SpinProps
const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;

function ComLoading(props: ComLoadingProps) {
  return (
    <Spin delay={50} indicator={antIcon} style={{width:"100%",height:"100%"}} {...props}>
    </Spin>
  )
}

export default ComLoading