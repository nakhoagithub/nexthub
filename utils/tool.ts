export const getParamFilter = (params: any) => {
  let newResult: any = { sort: {}, filter: {} };
  if (Array.isArray(params?.sorter)) {
    let newSort: any = {};

    for (var sort of params.sorter) {
      newSort = { ...newSort, [sort.field]: sort.order === "ascend" ? 1 : -1 };
    }

    newResult = { ...newResult, sort: newSort };
  } else if (Object.keys(params?.sorter ?? {}).length > 0 && params?.sorter?.column) {
    newResult = { ...newResult, sort: { [params?.sorter.field]: params?.sorter.order === "ascend" ? 1 : -1 } };
  }

  if (Object.keys(params?.filters ?? {}).length > 0) {
    let newFilters: any = {};
    for (var filter in params?.filters ?? {}) {
      if (params?.filters[filter]) {
        newFilters = { ...newFilters, [filter]: { $in: params?.filters[filter] } };
      }
    }

    newResult = { ...newResult, filter: newFilters };
  }

  let pageSize = params?.pagination?.pageSize ?? 0;
  let page = params?.pagination?.current ?? 1;

  return {
    filter: newResult.filter,
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
