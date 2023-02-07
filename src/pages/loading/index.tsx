import {LoadingOutlined} from "@ant-design/icons";
import {Spin} from "antd";
import style from "./style.module.scss";
const icon = <LoadingOutlined style={{fontSize: 50}} spin />;

export default function Loading() {
  return (
    <div className={style.loading_container}>
      <Spin indicator={icon} />
    </div>
  );
}
