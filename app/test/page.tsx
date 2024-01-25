"use client";
import React from "react";
import Spreadsheet, { CellBase, Matrix, createFormulaParser } from "react-spreadsheet";

const Page = () => {
  const data = [
    [{ value: "2" }, { value: "1" }],
    [{ value: "=sum(a1, b1)" }, { value: "Cookies" }],
  ];

  const customCreateFormulaParser = (data: Matrix<CellBase>) => createFormulaParser(data, { SUM: undefined });

  return <Spreadsheet data={data} createFormulaParser={customCreateFormulaParser} />;
};

export default Page;
