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
  selectedRowKeys,
  setSelectedRowKeys,
  sort,
  filter,
  pageSize,
  hideActionUpdate,
  hideActionCreate,
  formLayout,
  updateField,
  ids,
  dataIdsCallback,
  actions,
  dataFormDefault,
}: {
  model: string;
  bordered?: boolean;
  width?: number;
  scrollY?: string | number | undefined;
  scrollX?: string | number | undefined;
  size?: SizeType;
  columnsTable?: any[];
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: (value: React.Key[]) => void;
  sort?: any;
  filter?: any;
  pageSize?: number;
  hideActionUpdate?: boolean;
  hideActionCreate?: boolean;
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
  ids?: {
    [modelName: string]: {
      api?: string;
      fields: string[];
      filter?: any;
    };
  }[];
  dataIdsCallback?: (value: any) => void;
  actions?: (keys?: any[]) => React.ReactNode[];
  dataFormDefault?: any;
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
  const [loadingReload, setLoadingButtonReload] = useState(false);
  const [openModalCustom, setOpenModalCustom] = useState(false);
  const [datas, setDatas] = useState<any[]>([]);
  const [dataIds, setDataIds] = useState<any>();
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

  /**
   * Thêm QueryParams vào url
   */
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

  /**
   * Lắng nghe thay đổi khi chọn record
   */
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: onSelectChange,
    columnWidth: "40px",
  };

  /**
   * Thêm cột action update cho table
   */
  let newColumnsTable = [...(columnsTable ?? [])];
  if (!(hideActionUpdate === true)) {
    newColumnsTable.push({
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
                setQueryParams({ viewType: "update", viewId: record._id });
                setOpenModalCustom(true);
              }}
            />
          </Space>
        );
      },
    });
  }

  /**
   * Lấy quyền của model muốn kết nối
   */
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

  /**
   * Lấy dữ liệu model
   */
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

      if (newQuery.filter) {
        newFilter = { ...newFilter, ...newQuery.filter };
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

  /**
   * Lấy dữ liệu cho ids
   */
  async function getDataIds() {
    try {
      if (!ids || dataIds) return;
      let newDataIds: any = {};
      for (var idsKey of ids) {
        if (Object.keys(idsKey).length > 0) {
          for (var model of Object.keys(idsKey)) {
            if (newDataIds[model] !== undefined) continue;

            let filter: any = {};
            if (idsKey[model].filter) {
              filter = idsKey[model].filter;
            }

            let api: string;
            if (idsKey[model]?.api) {
              api = idsKey[model].api!;
            }

            const {
              data: { datas, code, total },
            } = await app.get(
              api! ?? `/api/model/${model}/get?fields=${idsKey[model].fields}&filter=${JSON.stringify(filter)}`
            );

            if (code === 200) {
              newDataIds = { ...newDataIds, [model]: datas };
            }
          }
        }
      }

      setDataIds(newDataIds);
      if (dataIdsCallback) {
        dataIdsCallback(newDataIds);
      }
    } catch (error) {
      useApp.notification.error({ message: "Internal Server Error" });
    }
  }

  /**
   * Làm mới dữu liệu
   */
  async function fetchData() {
    setLoading(true);
    await getAccess();
    setLoading(false);
  }

  /**
   * Reload dữ liệu
   */
  async function onReload() {
    setLoadingButtonReload(true);
    await getDatas();
    setLoadingButtonReload(false);
  }

  /**
   * Mở model create
   */
  async function onCreate() {
    setQueryParams({ viewType: "create" });
    setOpenModalCustom(true);
  }

  /**
   * Xóa dữ liệu được chọn
   */
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

  /**
   * Disable Form khi không có quyền `update` hoặc quyền `create` trên model đó
   */
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
    getDataIds();
  }, []);

  useEffect(() => {
    getDatas();
  }, [JSON.stringify(tableParams)]);

  return (
    <div className="table-view">
      <div className="table-view-header">
        <div className="table-view-header-left">
          <Space wrap>
            <Button icon={<ReloadOutlined />} loading={loadingReload} onClick={onReload} />

            {!(hideActionCreate === true) && accessRightModel?.create && (
              <Button icon={<PlusOutlined />} onClick={onCreate} type="primary">
                New
              </Button>
            )}

            {accessRightModel?.delete && selectedRowKeys.length > 0 && (
              <Button icon={<DeleteOutlined />} onClick={onDelete} danger>
                Delete
              </Button>
            )}

            {actions !== undefined && actions(selectedRowKeys).map((e, index) => <div key={index}>{e}</div>)}
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
        columns={newColumnsTable}
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
        store={store}
        model={model}
        fetchData={getDatas}
        updateField={updateField}
        form={form}
        dataFormDefault={dataFormDefault}
      />
    </div>
  );
};

export default TableView;
