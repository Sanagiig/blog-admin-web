type Key =  string | symbol | number
type TreeNode = {
  [k: Key]: any
}

type NodeMatchInfo = {
  parentID?:Key
}

function walk<N extends TreeNode>(
  node: N | N[],
  childrenKey: string | number | symbol,
  matchFn: (n: N,info:NodeMatchInfo | null) => boolean | void): N | void {
  const children: N[] = Array.isArray(node) ? node : node[childrenKey] || []

  if (!Array.isArray(node) && matchFn(node,null)) {
    return node
  }

  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    let res = walk(child, childrenKey, matchFn)
    if (res) {
      return res
    }
  }
}

function findNode(treeData: TreeNode[], searchInfo: any, option?: any): TreeNode | void {
  const {childrenKey = "children"} = option
  const searchKeys = Object.keys(searchInfo)
  let res: TreeNode;

  return walk(treeData, childrenKey, function (node) {
    return !!searchKeys.find((k: any) => node[k] === searchInfo[k])
  })
}

function findFuzzyNode(treeData: TreeNode[], searchInfo: any, option: any): TreeNode | void {
  const {childrenKey = "children"} = option
  const searchKeys = Object.keys(searchInfo)
  let res: TreeNode;

  return walk(treeData, childrenKey, function (node) {
    return !!searchKeys.find((k: any) => {
      const val: any = node[k];
      if (typeof val === "string") {
        return val.includes(searchInfo[k].toString())
      }
      return node[k] == searchInfo[k]
    })
  })
}

export {
  walk,
  findNode,
  findFuzzyNode,
}