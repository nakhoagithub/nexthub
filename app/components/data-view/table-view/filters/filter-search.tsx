"use client";
import { SearchOutlined } from "@ant-design/icons";
import { Button, Divider, Input, InputRef, Space } from "antd";
import { FilterConfirmProps, FilterDropdownProps } from "antd/es/table/interface";
import React, { useEffect, useRef, useState } from "react";

/**
 * @param reset khi giá `reset` thay đổi thì sẽ reset toàn bộ filter
 */
export const filterSearchTable = () => {
  const [searchText, setSearchText] = useState("");
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (selectedKeys: string[], confirm: FilterDropdownProps["confirm"]) => {
    confirm();
    setSearchText(selectedKeys[0]);
  };

  const handleReset = (clearFilters?: () => void) => {
    clearFilters && clearFilters();
    setSearchText("");
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
    }) => {
      return (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            ref={searchInput}
            placeholder={`Search`}
            value={selectedKeys[0]}
            onChange={(e) => {
              setSelectedKeys(e.target.value ? [e.target.value] : []);
            }}
            onPressEnter={() => handleSearch(selectedKeys as string[], confirm)}
            style={{ marginBottom: 8, display: "block" }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys as string[], confirm)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
                setSearchText((selectedKeys as string[])[0]);
              }}
            >
              Filter
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
    filterIcon: (filtered: boolean) => <SearchOutlined style={{ color: filtered ? "#1677ff" : undefined }} />,
    // onFilter: (value: any, record: any) => {
    //   return record[dataIndex]
    //     .toString()
    //     .toLowerCase()
    //     .includes((value as string).toLowerCase());
    // },
    onFilterDropdownOpenChange: (visible: boolean) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  };
};
