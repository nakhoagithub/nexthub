import { AccessRightModel } from "@/interfaces/access-right-model";
import { pageSizeOptions } from "@/interfaces/page-size-options";
import app from "@/utils/axios";
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined, SettingOutlined } from "@ant-design/icons";
import { App, Button, Form, FormInstance, Space, Table, TableColumnsType, TablePaginationConfig } from "antd";
import { SizeType } from "antd/es/config-provider/SizeContext";
import { FilterValue, SorterResult, TableRowSelection } from "antd/es/table/interface";
import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context-provider";
import { translate } from "@/utils/translate";
import { apiResultCode, getParamFilter } from "@/utils/tool";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  hideActionDelete,
  formLayout,
  customValuesFinish,
  customValuesInit,
  updateField,
  ids,
  dataIdsCallback,
  distincts,
  dataDistinctsCallback,
  actions,
  dataFormDefault,
  modelExpandable,
  fieldExpandable,
  columnsExpandable,
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
  hideActionDelete?: boolean;
  formLayout?: ({
    store,
    form,
    viewType,
    onFinish,
    disabled,
    total,
  }: {
    store: StoreApi<StoreApp>;
    form: FormInstance<any>;
    viewType: string | null;
    onFinish: (value: any) => void;
    disabled?: boolean;
    total?: number;
  }) => React.ReactNode;
  customValuesFinish?: (values: any) => any;
  customValuesInit?: (values: any) => any;
  updateField?: string;
  ids?: {
    [modelName: string]: {
      api?: string;
      fields: string[];
      filter?: any;
      sort?: any;
    };
  }[];
  dataIdsCallback?: (value: any) => void;
  distincts?: {
    [key: string]: {
      model: string;
      field: string;
      filter?: any;
    };
  }[];
  dataDistinctsCallback?: (value: any) => void;
  actions?: (keys?: any[]) => React.ReactNode[];
  dataFormDefault?: any;
  modelExpandable?: string;
  fieldExpandable?: string;
  columnsExpandable?: TableColumnsType<any>;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const viewType = searchParams.get("viewType");
  const viewId = searchParams.get("viewId");
  const useApp = App.useApp();
  const [loading, setLoading] = useState(false);
  const [accessRightModel, setAccessRightModel] = useState<AccessRightModel>();
  const [loadingReload, setLoadingButtonReload] = useState(false);
  const [openModalCustom, setOpenModalCustom] = useState(false);
  const [datas, setDatas] = useState<any[]>([]);
  const [total, setTotalDatas] = useState<number>(0);
  const [dataIds, setDataIds] = useState<any>();
  const [dataDistincts, setDataDistincts] = useState<any>();
  const store = useContext(StoreContext);
  const { languageData, setLanguageData } = store.getState();
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
  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: any[], info: any) => {
    let dataCurrentKeys = datas.map((e) => (updateField ? e[`${updateField}`] : e._id));
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
    let check = selectedRowKeys.find((e) => e === (updateField ? record[`${updateField}`] : record._id));
    let indexCheck = selectedRowKeys.findIndex((e) => e === (updateField ? record[`${updateField}`] : record._id));
    let newSelectedRowKeys: React.Key[] = [...selectedRowKeys];
    if (selected) {
      if (!check || selectedRowKeys.length === 0) {
        newSelectedRowKeys.push(updateField ? record[`${updateField}`] : record._id);
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
      } = await app.get(`/api/db/${model}/access`);

      if (code === 200) {
        setAccessRightModel(access);
      }
    } catch (error) {
      let { message, content } = apiResultCode({ error: error, store });
      useApp.notification.error({
        message: message,
        description: <span style={{ whiteSpace: "pre-line" }}>{content}</span>,
      });
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
        `/api/db/${model}?filter=${JSON.stringify(newFilter)}&sort=${JSON.stringify(newSort)}&limit=${
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
        setTotalDatas(total);
      }
    } catch (error) {
      let { message, content } = apiResultCode({ error: error, store });
      useApp.notification.error({
        message: message,
        description: <span style={{ whiteSpace: "pre-line" }}>{content}</span>,
      });
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

            let sort: any = {};
            if (idsKey[model].sort) {
              sort = idsKey[model].sort;
            }

            let api: string;
            if (idsKey[model]?.api) {
              api = idsKey[model].api!;
            }

            const {
              data: { datas, code, total },
            } = await app.get(
              api! ??
                `/api/db/${model}?fields=${idsKey[model].fields}&filter=${JSON.stringify(filter)}&sort=${JSON.stringify(
                  sort
                )}`
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
      let { message, content } = apiResultCode({ error: error, store });
      useApp.notification.error({
        message: message,
        description: <span style={{ whiteSpace: "pre-line" }}>{content}</span>,
      });
    }
  }

  /**
   * Lấy dữ liệu cho distinct
   */
  async function getDataDistincts() {
    try {
      if (!distincts || dataDistincts) return;
      let newDataIds: any = {};
      for (var distinctKey of distincts) {
        if (Object.keys(distinctKey).length > 0) {
          for (var key of Object.keys(distinctKey)) {
            if (newDataIds[key] !== undefined) continue;

            let filter: any = {};
            if (distinctKey[key].filter) {
              filter = distinctKey[key].filter;
            }

            const {
              data: { datas, code, total },
            } = await app.get(
              `/api/db/${distinctKey[key].model}/distinct?fieldName=${distinctKey[key].field}&filter=${JSON.stringify(
                filter
              )}`
            );

            if (code === 200) {
              newDataIds = { ...newDataIds, [key]: datas };
            }
          }
        }
      }

      setDataDistincts(newDataIds);
      if (dataDistinctsCallback) {
        dataDistinctsCallback(newDataIds);
      }
    } catch (error) {
      let { message, content } = apiResultCode({ error: error, store });
      useApp.notification.error({
        message: message,
        description: <span style={{ whiteSpace: "pre-line" }}>{content}</span>,
      });
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
          try {
            const {
              data: { code },
            } = await app.delete(`/api/db/${model}`, { data: { fieldId: "_id", datas: newIds } });

            if (code === 200) {
              useApp.message.success(translate({ store: store, source: "Deleted" }));
            }
          } catch (error) {
            let { message, content } = apiResultCode({ error: error, store });
            useApp.notification.error({
              message: message,
              description: <span style={{ whiteSpace: "pre-line" }}>{content}</span>,
            });
          }
          getDatas();
          setSelectedRowKeys([]);
        },
      });
    } catch (error) {
      let { message, content } = apiResultCode({ error: error, store });
      useApp.notification.error({
        message: message,
        description: <span style={{ whiteSpace: "pre-line" }}>{content}</span>,
      });
    }
  }

  /**
   * Get dữ liệu ngôn ngữ theo model
   */
  async function fetchLanguageModel() {
    try {
      const {
        data: { code, datas },
      } = await app.get(`/api/language/get?modelName=${model}`);

      if (code === 200) {
        let newLanguageData = [...languageData];
        for (var language of datas) {
          if (
            !newLanguageData.find((e) => e.sourceTerm === language.sourceTerm && e.modelName === language.modelName)
          ) {
            newLanguageData.push(language);
          }
        }
        setLanguageData({ datas: newLanguageData });
      }
    } catch (error) {}
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

  /**
   * Expandedable
   */
  const expandedRowRender = () => {
    return <Table columns={columnsExpandable} dataSource={[]} pagination={false} size="small" />;
  };

  useEffect(() => {
    fetchData();
    getDataIds();
    getDataDistincts();
    fetchLanguageModel();
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

            {selectedRowKeys.length > 0 && (
              <Button type="dashed" onClick={() => setSelectedRowKeys([])}>
                Clear selected: {selectedRowKeys.length}
              </Button>
            )}

            {!(hideActionCreate === true) && accessRightModel?.create && (
              <Button icon={<PlusOutlined />} onClick={onCreate} type="primary">
                New
              </Button>
            )}
            {!(hideActionDelete === true) && accessRightModel?.delete && selectedRowKeys.length > 0 && (
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
        rowKey={(record) => (updateField ? record[`${updateField}`] : record._id)}
        columns={newColumnsTable}
        dataSource={datas}
        loading={loadingReload || loading}
        pagination={{ ...tableParams.pagination, position: ["topLeft"] }}
        onChange={(pargination, filters, sorter) => handleTableChange(pargination, filters, sorter)}
        expandable={columnsExpandable && { expandedRowRender }}
      />

      <ModalCustom
        open={openModalCustom}
        setOpen={setOpenModalCustom}
        formLayout={(onFinish) =>
          formLayout && formLayout({ store, form, viewType, onFinish, disabled: getDisableForm(), total: total })
        }
        store={store}
        model={model}
        fetchData={getDatas}
        updateField={updateField}
        form={form}
        dataFormDefault={dataFormDefault}
        customValuesFinish={customValuesFinish}
        customValuesInit={customValuesInit}
      />
    </div>
  );
};

export default TableView;
