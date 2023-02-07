import React from "react";
import {Menu, MenuProps} from "antd";
import {RouteObject, useNavigate} from "react-router";
import localMenuConfig from "@/components/layout/managerLayout/dynamicMenu/localMenuConfig";
import routers from "@/routers";
import {ItemType} from "antd/es/menu/hooks/useItems";

function genMenuItems() {
  const res: ItemType[] = []
  // common
  const commonRouter = routers.find(item => item.id?.includes("common"))

  function push(menu: ItemType, router: RouteObject) {
    const [_, label = ""] = router.id!.split("-");
    const item: any = {
      ...menu,
      label,
      children: (router.children || []).map(r => {
        const [key = "", label = ""] = r.id!.split("-");
        return {
          key,
          label,
          data: {
            path: r.path
          }
        }
      })
    }

    if (!item.children.length) {
      item.data = {
        path: router.path
      }
      item.children = null;
    }
    res.push(item)
  }

  if (commonRouter) {
    commonRouter.children?.forEach(r => {
      const [key = "", name = ""] = r.id!.split("-");
      localMenuConfig.forEach(item => {
        if (item.key === key) {
          push(item, r)
        }
      })
    })
  }

  localMenuConfig.forEach(item => {
    routers.forEach(r => {
      const [key = "", name = ""] = r.id!.split("-");
      if (key == item.key) {
        push(item, r)
      }
    })
  })
  return res;
}

export default React.memo(function () {
  let defaultSelectedKeys = ["home"]
  const navigator = useNavigate()
  const handleMenuChange: MenuProps["onSelect"] = function ({item, key, keyPath}: any) {
    defaultSelectedKeys = [key]
    navigator(item.props.data.path)
  };
  return (<Menu
      onSelect={handleMenuChange}
      theme="light"
      mode="inline"
      defaultSelectedKeys={defaultSelectedKeys}
      items={genMenuItems()}
    />
  )
})