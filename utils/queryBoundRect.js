export default function queryBoundRact(selector) {
  return new Promise(resolve => {
    // 创建查询实例
    const query = wx.createSelectorQuery()
    query.select(selector).boundingClientRect();
    // query.selectViewport().scrollOffset();

    // 执行查询
    query.exec(resolve);
  })

}
