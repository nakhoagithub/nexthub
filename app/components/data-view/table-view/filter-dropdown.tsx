import { Button } from "antd";
import { FilterDropdownProps } from "antd/es/table/interface";
import React from "react";

const FilterDropdown = ({ props }: { props: FilterDropdownProps }) => {
  return <Button onClick={() => props.close()}></Button>;
};

export default FilterDropdown;
