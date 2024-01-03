import { AccessRightModel } from "@/interfaces/access-right-model";
import { pageSizeOptions } from "@/interfaces/page-size-options";
import app from "@/utils/axios";
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, SettingOutlined } from "@ant-design/icons";
import { App, Button, Checkbox, Form, FormInstance, Space, Table, TablePaginationConfig, Tag } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { ColumnType, ColumnsType, FilterValue, SorterResult, TableRowSelection } from "antd/es/table/interface";
import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context-provider";
import { ColumnModel, ColumnViewModel } from "@/interfaces/model";
import { translate } from "@/utils/translate";
import { getParamFilter } from "@/utils/tool";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Column from "antd/es/table/Column";
import ModalCustom from "./modal-custom";
import { StoreApp } from "@/store/store";
import { StoreApi } from "zustand";

const TableView = ({
  model,
  bordered,
  width,
  scrollY,
  scrollX,
  size,
  columnsTable,
  columnsView,
  selectedRowKeys,
  setSelectedRowKeys,
  sort,
  filter,
  pageSize,
  hideActionUpdate,
  formLayout,
  updateField,
}: {
  model: string;
  bordered?: boolean;
  width?: number;
  scrollY?: string | number | undefined;
  scrollX?: string | number | undefined;
  size?: SizeType;
  columnsTable?: any[];
  columnsView?: ColumnViewModel[];
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: (value: React.Key[]) => void;
  sort?: any;
  filter?: any;
  pageSize?: number;
  hideActionUpdate?: boolean;
  formLayout?: ({
    store,
    form,
    viewType,
    onFinish,
    disabled,
  }: {
    store: StoreApi<StoreApp>;
    form: FormInstance<any>;
    viewType: string | null;
    onFinish: (value: any) => void;
    disabled?: boolean;
  }) => React.ReactNode;
  updateField?: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const viewType = searchParams.get("viewType");
  const viewId = searchParams.get("viewId");
  const useApp = App.useApp();
  const [loading, setLoading] = useState(false);
  const [accessRightModel, setAccessRightModel] = useState<AccessRightModel>();
  const [columnsModel, setColumnsModel] = useState<ColumnModel[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [loadingReload, setLoadingButtonReload] = useState(false);
  const [openModalCustom, setOpenModalCustom] = useState(false);
  const [datas, setDatas] = useState<any[]>([]);
  const store = useContext(StoreContext);
  const { setLanguageData } = store.getState();
  const [form] = Form.useForm();

  const [tableParams, setTableParams] = useState<any>({
    pagination: {
      current: 1,
      pageSize: pageSize ?? 10,
      pageSizeOptions: pageSizeOptions,
    },
  });

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

  function setQueryParams(params: { [key: string]: string }) {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    // Set each query parameter from the params object
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        current.set(key, params[key]);
      }
    }

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  }

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange,
    columnWidth: "40px",
  };

  async function getAccess() {
    try {
      const {
        data: { access, code },
      } = await app.get(`/api/model/${model}/access`);

      if (code === 200) {
        setAccessRightModel(access);
      }
    } catch (error) {
      useApp.notification.error({ message: "Internal Server Error" });
    }
  }

  async function getColumns() {
    try {
      let fields = (columnsView ?? []).map((e) => e.field);
      const {
        data: { code, datas },
      } = await app.get(`/api/model/${model}/columns?fields=${fields}`);

      if (code === 200) {
        setColumnsModel(datas);
      }
    } catch (error) {}
  }

  async function renderColumn() {
    if (columnsTable) {
      setColumns(columnsTable);
      return;
    }
    let newColumns = [];

    for await (var columnData of columnsView ?? columnsModel) {
      let columnModel = columnsModel.find((e) => e.field === columnData.field);
      let newColumn: ColumnType<any> = {
        title: translate({ store, modelName: model, source: columnData.title ?? columnData.field }),
        key: columnData.field,
        width: columnData.width ?? 200,
        align: columnData.align,
        render: !columnData?.renderItem
          ? undefined
          : (value, record, index) => {
              return columnData.renderItem(record, index);
            },
      };

      if (
        columnModel?.type === "String" ||
        columnModel?.type === "Date" ||
        columnModel?.type === "Number" ||
        columnModel?.type === "ObjectId"
      ) {
        newColumn = { ...newColumn, dataIndex: columnData.field };
      }

      if (columnModel?.type === "Boolean") {
        newColumn = {
          ...newColumn,
          render: (value, record, index) => {
            return <Checkbox checked={record[columnData.field]} />;
          },
        };
      }

      // if (columnModel?.type === "ObjectId") {
      //   newColumn = {
      //     ...newColumn,
      //     render: (value, record, index) => {
      //       return <div>{columnModel?.field && <Tag>{record[`${columnModel?.field}`] ?? ""}</Tag>}</div>;
      //     },
      //   };
      // }

      newColumns.push(newColumn);
    }

    // thêm action update
    if (!(hideActionUpdate === true)) {
      newColumns.push({
        title: "",
        width: 50,
        fixed: "right",
        align: "center",
        render: (value: any, record: any, index: number) => {
          return (
            <Space>
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => {
                  setQueryParams({ drawerCustomType: "update", viewId: record._id });
                  setOpenModalCustom(true);
                }}
              />
            </Space>
          );
        },
      });
    }

    setColumns(newColumns);
  }

  async function fetchLanguageModel() {
    try {
      const {
        data: { code, datas },
      } = await app.get(`/api/language/get?modelName=${model}`);

      if (code === 200) {
        setLanguageData({ datas: datas });
      }
    } catch (error) {
      useApp.notification.error({ message: "Internal Server Error" });
    }
  }

  async function getDatas() {
    try {
      let newQuery = getParamFilter(tableParams);
      let newSort = newQuery.sort;
      if (sort) {
        newSort = sort;
      }

      let newFilter: any = {};

      if (filter) {
        newFilter = filter;
      }

      const {
        data: { datas, code, total },
      } = await app.get(
        `/api/model/${model}/get?filter=${JSON.stringify(newFilter)}&sort=${JSON.stringify(newSort)}&limit=${
          newQuery.limit
        }&skip=${newQuery.skip}`
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
      }
    } catch (error) {
      useApp.notification.error({ message: "Internal Server Error" });
    }
  }

  async function fetchData() {
    setLoading(true);
    await getAccess();
    await getColumns();
    await fetchLanguageModel();
    setLoading(false);
  }

  async function onReload() {
    setLoadingButtonReload(true);
    await getDatas();
    setLoadingButtonReload(false);
  }

  async function onCreate() {
    setQueryParams({ drawerCustomType: "create" });
    setOpenModalCustom(true);
  }

  async function onDelete() {
    try {
      let newIds: string[] = [];
      newIds = selectedRowKeys.map((e) => e.toString());
      if (viewType === "update" && viewId) {
        newIds = [viewId];
      }

      useApp.modal.confirm({
        title: translate({ store: store, source: "Comfirm" }),
        content: translate({ store: store, source: "Delete selected data" }),
        okText: translate({ store: store, source: "Yes" }),
        cancelText: translate({ store: store, source: "Cancel" }),
        onOk: async () => {
          const {
            data: { code, message, statusError },
          } = await app.delete(`/api/model/${model}/delete`, { data: { fieldId: "_id", datas: newIds } });

          if (code === 200) {
            useApp.message.success(translate({ store: store, source: "Deleted" }));
            getDatas();
            setSelectedRowKeys([]);
          } else {
            if (message) {
              if (statusError === "warning") {
                useApp.message.warning(message ?? "");
              } else {
                useApp.message.error(message ?? "");
              }
            }
          }
        },
      });
    } catch (error) {
      useApp.notification.error({ message: "Internal Server Error" });
    }
  }

  const getDisableForm = () => {
    if (viewType === "update") {
      return !accessRightModel?.update ?? false;
    }
    if (viewType === "create") {
      return !accessRightModel?.create ?? false;
    }
    return true;
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    renderColumn();
  }, [columnsModel]);

  useEffect(() => {
    getDatas();
  }, [JSON.stringify(tableParams)]);

  return (
    <div className="table-view">
      <div className="table-view-header">
        <div className="table-view-header-left">
          <Space wrap>
            <Button icon={<ReloadOutlined />} loading={loadingReload} onClick={onReload} />
            {accessRightModel?.create && (
              <Button icon={<PlusOutlined />} onClick={onCreate} type="primary">
                New
              </Button>
            )}

            {accessRightModel?.delete && selectedRowKeys.length > 0 && (
              <Button icon={<DeleteOutlined />} onClick={onDelete} danger>
                Delete
              </Button>
            )}
          </Space>
        </div>
        <div className="table-view-header-right">
          <Space>
            <Button icon={<SettingOutlined />} />
          </Space>
        </div>
      </div>
      <Table
        sticky
        style={{ width: width }}
        scroll={{ y: scrollY ?? "100%", x: scrollX ?? "hidden" }}
        size={size ?? "small"}
        rowSelection={rowSelection}
        bordered={bordered ?? true}
        rowKey={(record) => record?._id}
        columns={columns}
        dataSource={datas}
        loading={loadingReload || loading}
        pagination={{ ...tableParams.pagination, position: ["topLeft"] }}
        onChange={(pargination, filters, sorter) => handleTableChange(pargination, filters, sorter)}
      />

      <ModalCustom
        open={openModalCustom}
        setOpen={setOpenModalCustom}
        formLayout={(onFinish) =>
          formLayout && formLayout({ store, form, viewType, onFinish, disabled: getDisableForm() })
        }
        columnsModal={columnsModel}
        store={store}
        model={model}
        fetchData={getDatas}
        updateField={updateField}
        form={form}
      />
    </div>
  );
};

export default TableView;
