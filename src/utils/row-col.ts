// 表格单元格合并多列
const [spanObject, pos] = [{}, {}];
// spanObj 存储每个key 对应的合并值
// pos  存储的是 key合并值得索引 大概吧
export const dataMethod = (data, isH) => {
  // 循环数据

  for (const index in data) {
    const dataI = data[index];
    // 循环数据内对象，查看有多少key
    for (const index_ in dataI) {
      // 如果只有一条数据时默认为1即可，无需合并
      if (index === "0") {
        spanObject[index_] = [1];
        pos[index_] = 0;
      } else {
        const [e, k] = [dataI, data[index - 1]];
        // 判断上一级别是否存在 ，
        // 存在当前的key是否和上级别的key是否一样
        // 判断是否有数组规定只允许那几列需要合并单元格的
        if (
          k &&
          e[index_] === k[index_] &&
          (!isH || isH.length === 0 || isH.includes(index_))
        ) {
          // 如果上一级和当前一级相当，数组就加1 数组后面就添加一个0
          spanObject[index_][pos[index_]] += 1;
          spanObject[index_].push(0);
        } else {
          spanObject[index_]?.push(1);
          pos[index_] = index;
        }
      }
    }
  }
  // TODO:合并仓库名称同时也合并品种名称
  spanObject.createBy =
    spanObject.remark =
    spanObject.operation =
    spanObject.breedName =
      spanObject.name;

  return spanObject;
};
