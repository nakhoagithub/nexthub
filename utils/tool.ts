import { StoreApp } from "@/store/store";
import { AxiosError } from "axios";
import { StoreApi } from "zustand";
import { translate } from "./translate";
import dayjs from "dayjs";
import mongoose from "mongoose";

function isNumber(value: string): boolean {
  if (!isNaN(Number(value))) {
    return true; // là số
  } else {
    return false; // không phải số
  }
}

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
    let newFiltersAND: any[] = [];
    // for (var filter in params?.filters ?? {}) {
    //   if (params?.filters[filter]) {
    //     newFilters = { ...newFilters, [filter]: { $in: params?.filters[filter] } };
    //   }
    // }

    for (var filter in params?.filters ?? {}) {
      if (Array.isArray(params?.filters[filter])) {
        let newAnd: any = { $or: [] };
        let arrayDataFilter = params?.filters[filter];

        for (var data of arrayDataFilter) {
          if (data != "") {
            if (isNumber(data)) {
              newAnd.$or.push({ [filter]: data });
            } else if (Array.isArray(data)) {
              console.log(1);
              // check data là mảng ngày
              if (data.length == 2 && dayjs(data[0]).isValid() && dayjs(data[1]).isValid()) {
                newFiltersAND.push({ [filter]: { $gte: dayjs(data[0]).startOf("day").unix() } });
                newFiltersAND.push({ [filter]: { $lte: dayjs(data[1]).startOf("day").unix() } });
              }
            } else if (typeof data === "string" && data.length === 24 && mongoose.Types.ObjectId.isValid(data)) {
              newAnd.$or.push({ [filter]: data });
            } else {
              newAnd.$or.push({ [filter]: { $regex: data, $options: "i" } });
            }
          }
        }
        if (Array.isArray(newAnd.$or) && newAnd.$or.length > 0) {
          newFiltersAND.push(newAnd);
        }
      }
    }

    if (newFiltersAND.length > 0) {
      newFilters = { ...newFilters, $and: newFiltersAND };
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

export function apiResultCode({ store, error }: { store?: StoreApi<StoreApp>; error: any }): {
  message: string;
  content: string;
} {
  const code = error?.response?.status;
  const messageError = error?.response?.data?.message;
  const errors = error?.response?.data?.errors;

  let result = {
    message: "",
    content: messageError,
  };

  let newMessageErrors = "";
  if (Array.isArray(errors) && errors.length > 0) {
    for (var e of errors) {
      let error = e.error;
      newMessageErrors += `- ${error}\n`;
    }
  }

  if (result.content) {
    result.content += `\n${newMessageErrors}`;
  } else {
    result.content = newMessageErrors;
  }

  if (code === 200) {
    if (store) result.message = translate({ store, source: "Success" });
    else result.message = "Success";
  }
  if (code === 400) {
    if (store) result.message = translate({ store, source: "Bad Request" });
    else result.message = "Bad Request";
  }
  if (code === 401) {
    if (store) result.message = translate({ store, source: "Unauthorized" });
    else result.message = "Unauthorized";
  }
  if (code === 403) {
    if (store) result.message = translate({ store, source: "Forbidden" });
    else result.message = "Forbidden";
  }
  if (code === 404) {
    if (store) result.message = translate({ store, source: "Not Found" });
    else result.message = "Not Found";
  }
  if (code === 500) {
    if (store) result.message = translate({ store, source: "Internal Server Error" });
    else result.message = "Internal Server Error";
  }
  return result;
}
