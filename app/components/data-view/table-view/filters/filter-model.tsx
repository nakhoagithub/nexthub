"use client";
import useDebounce from "@/app/components/hook";
import { pageSizeOptions } from "@/interfaces/page-size-options";
import app from "@/utils/axios";
import { getParamFilter } from "@/utils/tool";
import { FilterFilled } from "@ant-design/icons";
import { App, Button, Input, InputRef, Space, Table } from "antd";
import {
  FilterConfirmProps,
  FilterDropdownProps,
  FilterValue,
  SorterResult,
  TablePaginationConfig,
  TableRowSelection,
} from "antd/es/table/interface";
import React, { useEffect, useRef, useState } from "react";

/**
 * @param model tên model truyền vào
 * @param searchKeys tên các field được tìm kiếm bởi regex trong mongodb
 * ví dụ: data `{_id: "xxx", "name": "ABC", "id": "abc"}` searchKeys: `["name", "id"]` thì regex tìm kiếm trong mongo `name` và `id`
 * @param fields các field được lấy về từ model
 * @param keyView ví dụ: data `{_id: "xxx", "name": "ABC"}` => keyView `name` để hiển thị `name` trên danh sách
 * @param keySelect key dùng để so sánh điều kiện với danh sách để lọc danh sách
 * @param sort sắp xếp danh sách mode
 * @param filter lọc danh sách theo filter
 */
export const filterModelTable = ({
  model,
  searchKeys,
  fields,
  keyView,
  keySelect,
  sort,
  filter,
  defaultDatas,
}: {
  model: string;
  searchKeys: string[];
  fields: string[];
  keyView: string;
  keySelect: string;
  sort?: any;
  filter?: any;
  defaultDatas?: Record<string, any>[];
}) => {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const searchInput = useRef<InputRef>(null);
  const useApp = App.useApp();
  const [datas, setDatas] = useState<any[]>([]);
  const [total, setTotalDatas] = useState<number>(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const [tableParams, setTableParams] = useState<any>({
    pagination: {
      current: 1,
      pageSize: 10,
      pageSizeOptions: pageSizeOptions,
    },
  });

  // khởi tạo fields
  if (!fields.find((e) => e == "_id")) {
    fields.push("_id");
  }

  const handleSearch = (selectedKeys: string[], confirm: FilterDropdownProps["confirm"]) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = (clearFilters?: () => void) => {
    clearFilters && clearFilters();
    setSearchText("");
  };

  async function getDatas() {
    try {
      let newQuery = getParamFilter(tableParams);

      let newSort = newQuery.sort ?? {};
      if (sort) {
        newSort = sort;
      }

      let newFilter: any = {};

      if (filter) {
        newFilter = filter;
      }

      let filterOR: any = { $or: [] };

      searchKeys.forEach((filterKey) => {
        if (searchText && searchText != "") {
          filterOR.$or.push({ [filterKey]: { $regex: searchText, $options: "i" } });
        }
      });

      if (Array.isArray(filterOR.$or) && filterOR.$or.length > 0) {
        newFilter = { ...newFilter, ...filterOR };
      }

      const {
        data: { datas, code, total },
      } = await app.get(
        `/api/db/${model}?filter=${JSON.stringify(newFilter)}&sort=${JSON.stringify(newSort)}&limit=${
          newQuery.limit
        }&skip=${newQuery.skip}&fields=${fields.join(",")}`
      );

      if (code === 200) {
        setDatas(datas);
        setTableParams({
          ...tableParams,
          pagination: {
            ...tableParams.pagination,
            total: total,
          },
        });
        setTotalDatas(total);
      }
    } catch (error) {
      useApp.notification.error({
        message: "Error",
      });
    }
  }

  const fetchData = async () => {
    setLoading(true);
    await getDatas();
    setLoading(false);
  };

  const searchHandler = (value?: string) => {
    setSearchText(value ?? "");
  };

  useDebounce(
    async () => {
      if (!defaultDatas) await fetchData();
    },
    [searchText],
    500
  );

  useEffect(() => {
    getDatas();
  }, [JSON.stringify(tableParams)]);

  /**
   * Lắng nghe thay đổi khi chọn record
   */
  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: any[], info: any) => {
    let dataCurrentKeys = datas.map((e) => (keySelect ? e[`${keySelect}`] : e._id));
    // setSelectedRowKeys([...newSelectedRowKeys]);
    let newCustomSelectedRowKeys: React.Key[] = [...selectedRowKeys];
    if (info?.type === "all") {
      if (newSelectedRowKeys.length > 0) {
        newSelectedRowKeys.forEach((key) => {
          let check = selectedRowKeys.find((e) => e === key);

          if (!check) {
            newCustomSelectedRowKeys.push(key);
          }
        });
      } else {
        const result = newCustomSelectedRowKeys.filter((item) => !dataCurrentKeys.includes(item));
        newCustomSelectedRowKeys = result;
      }
      setSelectedRowKeys(newCustomSelectedRowKeys);
    }
  };

  /**
   * Hàm select item table
   */
  const onSelectTable = (record: any, selected: boolean, selectedRows: any[]) => {
    let check = selectedRowKeys.find((e) => e === (keySelect ? record[`${keySelect}`] : record._id));
    let indexCheck = selectedRowKeys.findIndex((e) => e === (keySelect ? record[`${keySelect}`] : record._id));
    let newSelectedRowKeys: React.Key[] = [...selectedRowKeys];
    if (selected) {
      if (!check || selectedRowKeys.length === 0) {
        newSelectedRowKeys.push(keySelect ? record[`${keySelect}`] : record._id);
      }
    } else {
      if (check) {
        newSelectedRowKeys.splice(indexCheck, 1);
      }
    }
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange,
    onSelect: onSelectTable,
    columnWidth: "40px",
  };

  /**
   * Xử lý thay đổi filter, sort, pagination trên table
   */
  const handleTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[]
  ) => {
    setTableParams({
      pagination,
      filters,
      sorter,
    });

    // `dataSource` is useless since `pageSize` changed
    if (pagination.pageSize !== tableParams.pagination?.pageSize) {
      setDatas([]);
    }
  };

  useEffect(() => {
    if (defaultDatas) setDatas(defaultDatas);
  }, []);

  return {
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }: {
      setSelectedKeys: (selectedKeys: React.Key[]) => void;
      selectedKeys: React.Key[];
      /**
       * Confirm filter value, if you want to close dropdown before commit, you can call with
       * {closeDropdown: true}
       */
      confirm: (param?: FilterConfirmProps) => void;
      clearFilters?: () => void;
      /** Only close filterDropdown */
      close: () => void;
    }) => {
      return (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          {/* <Search
            value={searchText}
            placeholder="Search"
            style={{ marginBottom: 8 }}
            onChange={(e) => searchHandler(e.currentTarget.value ?? "")}
          /> */}
          <Input
            ref={searchInput}
            placeholder={`Search`}
            value={searchText}
            onChange={(e) => {
              searchHandler(e.currentTarget.value ?? "");
            }}
            // onPressEnter={() => handleSearch(selectedKeys as string[], confirm)}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Table
            style={{ marginBottom: 8 }}
            scroll={{ y: "200px", x: "300px" }}
            size="small"
            showHeader={false}
            loading={loading}
            dataSource={datas}
            rowSelection={rowSelection}
            pagination={{ ...tableParams.pagination, position: ["topLeft"] }}
            columns={[
              {
                title: "",
                key: keyView,
                dataIndex: keyView,
              },
            ]}
            rowKey={(record) => record._id}
            onChange={(pargination, filters, sorter) => handleTableChange(pargination, filters, sorter)}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => {
                setSelectedKeys(selectedRowKeys);
                confirm({ closeDropdown: true });
              }}
              icon={<FilterFilled />}
              size="small"
              style={{ width: 90 }}
            >
              Filter
            </Button>
            <Button
              onClick={() => {
                clearFilters && handleReset(clearFilters);
                setSelectedRowKeys([]);
                setSelectedKeys([]);
              }}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              Close
            </Button>
          </Space>
        </div>
      );
    },
    filterIcon: (filtered: boolean) => <FilterFilled style={{ color: filtered ? "#1677ff" : undefined }} />,
    onFilterDropdownOpenChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  };
};
