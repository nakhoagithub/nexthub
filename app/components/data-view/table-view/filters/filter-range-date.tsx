"use client";
import { SearchOutlined } from "@ant-design/icons";
import { Button, DatePicker, Divider, Input, InputRef, Space } from "antd";
import { FilterConfirmProps, FilterDropdownProps } from "antd/es/table/interface";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useRef, useState } from "react";

export const filterRangeDateUnitTable = ({ picker }: { picker?: "week" | "month" | "quarter" }) => {
  const [range, setRange] = useState<any>();

  const handleSearch = (selectedKeys: number[], confirm: FilterDropdownProps["confirm"]) => {
    confirm();
    if (selectedKeys.length == 2) {
      setRange([...selectedKeys]);
    }
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setRange([]);
  };

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
    }) => (
      <div style={{ padding: 8 }}>
        <DatePicker.RangePicker
          style={{ marginBottom: 8 }}
          value={range}
          picker={picker ?? undefined}
          format={"DD/MM/YYYY"}
          onChange={(e: any) => {
            setSelectedKeys(e ? [e] : []);
            setRange(e);
          }}
          allowClear={true}
        />
        <div>
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys as number[], confirm)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => {
                clearFilters && handleReset(clearFilters);
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
                confirm({ closeDropdown: false });
                setRange(selectedKeys as number[]);
              }}
            >
              Filter
            </Button>
            <Button type="link" size="small" onClick={() => close()}>
              Close
            </Button>
          </Space>
        </div>
      </div>
    ),
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />,
    // onFilter: (value: any, record: any) => {
    //   return record[dataIndex]
    //     ? dayjs.unix(record[dataIndex]).unix() >= dayjs(value[0]).unix() &&
    //         dayjs.unix(record[dataIndex]).unix() <= dayjs(value[1]).unix()
    //     : true;
    // },
    onFilterDropdownOpenChange: (visible: boolean) => {},
  };
};
