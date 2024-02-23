"use client";
import { Button } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useContext, useState } from "react";
import { translate } from "@/utils/translate";
import { StoreContext } from "@/app/components/context-provider";
import { getItemInArray } from "@/utils/tool";
import PageHeader from "@/app/components/body/page-header";
import dayjs from "dayjs";
import TableView from "@/app/components/data-view/table-view/table-view";
import { filterSearchTable } from "@/app/components/data-view/table-view/filters/filter-search";
import { filterRangeDateUnitTable } from "@/app/components/data-view/table-view/filters/filter-range-date";
import { filterModelTable } from "@/app/components/data-view/table-view/filters/filter-model";
import { EditOutlined } from "@ant-design/icons";
import ModalEditorContent from "@/app/components/modal-edit-content";

const Page = () => {
  const store = useContext(StoreContext);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [dataIds, setDataIds] = useState<any>();
  const [openEditContent, setOpenEditContent] = useState(false);
  const [dataContent, setDataContent] = useState<any>();

  const columns: ColumnsType<any> = [
    {
      title: translate({ store, source: "Season code" }),
      dataIndex: "codePlantingSchedule",
      width: 200,
      fixed: "left",
      ...filterSearchTable(),
    },
    {
      title: translate({ store, source: "Date" }),
      width: 120,
      align: "center",
      render: (value: any, record: any, index: number) => {
        return <>{record.dateUnix && dayjs.unix(record.dateUnix).format("DD/MM/YYYY")}</>;
      },
      fixed: "left",
      dataIndex: "dateUnix",
      sorter: true,
      ...filterRangeDateUnitTable({}),
    },
    {
      title: translate({ store, source: "Area" }),
      width: 200,
      render: (value, record, index) => {
        let area = record.idArea && getItemInArray(dataIds?.["area"] ?? [], record.idArea, "_id");
        return <div>{area && `${area?.name ?? ""}`}</div>;
      },
      dataIndex: "idArea",
      ...filterModelTable({
        model: "area",
        searchKeys: ["name", "id"],
        fields: ["name"],
        keyView: "name",
        keySelect: "_id",
      }),
    },
    {
      title: translate({ store, source: "Content" }),
      dataIndex: "content",
      width: 500,
      render: (value, record, index) => {
        return (
          <div>
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => {
                setDataContent(record);
                setOpenEditContent(true);
              }}
            />
            <div style={{ margin: 8 }} dangerouslySetInnerHTML={{ __html: record.content ?? "" }} />
          </div>
        );
      },
    },
    { title: "", key: "none" },
  ];

  return (
    <div>
      <ModalEditorContent
        open={openEditContent}
        setOpen={setOpenEditContent}
        data={dataContent}
        keyData="content"
        model="production-document-garden-check-diary"
      />
      <PageHeader title="Production document garden check diary" />
      <div className="page-content">
        <TableView
          model={"production-document-garden-check-diary"}
          columnsTable={columns}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
          pageSize={20}
          ids={[
            {
              area: {
                fields: ["_id", "name"],
                filter: { active: true },
              },
            },
          ]}
          dataIdsCallback={(value) => setDataIds(value)}
          hideActionCreate
          hideActionUpdate
          hideActionDelete
        />
      </div>
    </div>
  );
};

export default Page;
