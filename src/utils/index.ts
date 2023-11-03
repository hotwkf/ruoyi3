// 首字母大小
export function titleCase(string_: string) {
  return string_.replaceAll(/( |^)[a-z]/g, (L) => L.toUpperCase());
}

// 下划转驼峰
export function camelCase(string_: string) {
  return string_.replaceAll(/_[a-z]/g, (string1) =>
    string1.slice(-1).toUpperCase()
  );
}

export function isNumberString(string_: string) {
  return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(string_);
}
