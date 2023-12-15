export const getParamFilter = (params: any) => {
  let newResult: any = { sort: {} };
  if (Array.isArray(params?.sorter)) {
    let newSort: any = {};

    for (var sort of params.sorter) {
      newSort = { ...newSort, [sort.field]: sort.order === "ascend" ? 1 : -1 };
    }

    newResult = { ...newResult, sort: newSort };
  } else if (Object.keys(params?.sorter ?? {}).length > 0 && params?.sorter?.column) {
    newResult = { ...newResult, sort: { [params?.sorter.field]: params?.sorter.order === "ascend" ? 1 : -1 } };
  }

  let pageSize = params?.pagination?.pageSize ?? 0;
  let page = params?.pagination?.current ?? 1;

  return {
    sort: newResult.sort,
    limit: pageSize,
    skip: pageSize * (page - 1),
  };
};

export function getItemInArray(list: any[], key: any, keyname?: string) {
  if (list.length > 0 && key) {
    return list.find((e) => e[keyname ?? "_id"] === key);
  }
  return null;
}

export function replaceUndefinedWithNull(obj: any) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] === undefined) {
      obj[key] = null;
    }
  }

  return obj;
}
