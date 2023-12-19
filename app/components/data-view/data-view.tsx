"use client";
import React, { useContext, useEffect, useState } from "react";
import PageHeader from "../body/page-header";
import TableView from "./table/table";
import { AccessRightModel } from "@/interfaces/access-right-model";
import app from "@/utils/axios";
import { App, Button, Form, FormInstance, Space, TablePaginationConfig } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FormView from "./form/form-view";
import { getParamFilter, replaceUndefinedWithNull } from "@/utils/tool";
import { FilterValue, SorterResult } from "antd/es/table/interface";
import { pageSizeOptions } from "@/interfaces/page-size-options";
import { translate } from "@/utils/translate";
import { StoreContext } from "../context-provider";
import KanbanView from "./kanban/kanban";
import { StoreApi } from "zustand";
import { StoreApp } from "@/store/store";

const DataView = ({
  titleHeader,
  model,
  columnsTable,
  renderItemKanban,
  tableBoder,
  filter,
  sort,
  formLayout,
  updateField,
  hideActionCreate,
  hideActionUpdate,
  actions,
  ids,
  dataIdsCallback,
}: {
  titleHeader?: string;
  model: string;
  columnsTable?: any[];
  renderItemKanban?: (value: any, index: number, fetchData?: () => Promise<void>) => React.ReactNode;
  tableBoder?: boolean;
  filter?: Object;
  sort?: Object;
  formLayout?: ({
    store,
    form,
    onFinish,
    viewType,
    disabled,
  }: {
    store: StoreApi<StoreApp>;
    form: FormInstance<any>;
    onFinish: (value: any) => void;
    viewType: string;
    disabled?: boolean;
  }) => React.ReactNode;
  updateField?: string;
  hideActionCreate?: boolean;
  hideActionUpdate?: boolean;
  actions?: (keys?: any[]) => React.ReactNode[];
  ids?: {
    [modelName: string]: {
      api?: string;
      fields: string[];
      filter?: any;
    };
  }[];
  dataIdsCallback?: (value: any) => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const viewType = searchParams.get("viewType");
  const viewId = searchParams.get("viewId");
  const useApp = App.useApp();
  const [loading, setLoading] = useState(false);
  const [initData, setInitData] = useState(false);
  const [accessRightModel, setAccessRightModel] = useState<AccessRightModel>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [datas, setDatas] = useState<any[]>([]);
  const [dataIds, setDataIds] = useState<any>();
  const [form] = Form.useForm();
  const store = useContext(StoreContext);
  const { setLanguageData } = store.getState();

  const getDisableForm = () => {
    if (viewType === "update") {
      return !accessRightModel?.update ?? false;
    }
    if (viewType === "create") {
      return !accessRightModel?.create ?? false;
    }
    return true;
  };

  const [tableParams, setTableParams] = useState<any>({
    pagination: {
      current: 1,
      pageSize: 20,
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

  /// Kiểu xem
  let viewTypes: string[] = [];

  /// Kiểu xem bảng
  if (columnsTable && !viewTypes.includes("table")) {
    viewTypes.push("table");
  }

  /// Kiểu xem form tạo
  if (formLayout && !viewTypes.includes("create")) {
    viewTypes.push("create");
  }

  /// Kiểu xem form cập nhật
  if (formLayout && !viewTypes.includes("update")) {
    viewTypes.push("update");
  }

  /// Kiểu xem kanban
  if (renderItemKanban && !viewTypes.includes("kanban")) {
    viewTypes.push("kanban");
  }

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
              }}
            />
          </Space>
        );
      },
    });
  }

  async function onFinishForm(values: any) {
    values = replaceUndefinedWithNull(values);
    if (viewType === "create") {
      try {
        const {
          data: { code, data, message, errors },
        } = await app.post(`/api/model/${model}/create`, { data: { ...values } });
        if (code === 200) {
          useApp.message.success("Success");
          router.back();
          fetchData();
        } else {
          if (Array.isArray(errors)) {
            for (var error of errors) {
              useApp.message.error(`${error.error ?? ""}`);
            }
          }
          if (message) {
            useApp.message.error(message ?? "");
          }
        }
      } catch (error) {
        useApp.notification.error({ message: "Internal Server Error" });
      }
    }

    if (viewType === "update") {
      if (!updateField && !viewId) {
        useApp.message.error("Error: Can't found _id");
        return;
      }

      try {
        const {
          data: { code, errors, message },
        } = await app.patch(`/api/model/${model}/update`, {
          fieldId: updateField ?? "_id",
          datas: [{ ...values, _id: viewId }],
        });

        if (code === 200) {
          useApp.message.success("Success");
          fetchData();
        } else {
          if (Array.isArray(errors)) {
            for (var error of errors) {
              useApp.message.error(`${error.error ?? ""}`);
            }
          }

          if (message) {
            useApp.message.error(message ?? "");
          }
        }
      } catch (error) {
        useApp.notification.error({ message: "Internal Server Error" });
      }
    }
  }

  async function deleteRecord() {
    try {
      let newIds: string[] = [];
      newIds = selectedRowKeys.map((e) => e.toString());
      if (viewType === "update" && viewId) {
        newIds = [viewId];
      }

      useApp.modal.confirm({
        title: "Comfirm",
        content: "Delete selected data",
        okText: "Yes",
        cancelText: "Cancel",
        onOk: async () => {
          const {
            data: { code, message, statusError },
          } = await app.delete(`/api/model/${model}/delete`, { data: { fieldId: "_id", datas: newIds } });

          if (code === 200) {
            useApp.message.success("Deleted");
            fetchData();
            setSelectedRowKeys([]);
            if (viewType === "update") {
              router.back();
            }
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

  // function setQueryParam(paramKey: string, value: string) {
  //   const current = new URLSearchParams(Array.from(searchParams.entries()));
  //   current.set(paramKey, value);
  //   const search = current.toString();
  //   const query = search ? `?${search}` : "";
  //   router.push(`${pathname}${query}`);
  // }

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

  function removeQueryParam(paramKey: string) {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.delete(paramKey);

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  }

  const fetchViewType = async () => {
    try {
      if (!viewTypes) return;
      if (viewType && viewTypes.includes(viewType)) return;
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      if (viewTypes.length > 0) {
        current.set("viewType", viewTypes[0]);
        const search = current.toString();
        const query = search ? `?${search}` : "";
        router.push(`${pathname}${query}`);
      }
    } catch (error) {
      useApp.notification.error({ message: "Internal Server Error" });
    }
  };

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

  async function fetchData() {
    setLoading(true);
    setInitData(true);
    await getAccess();
    await getDatas();
    await fetchViewType();
    await fetchLanguageModel();
    setInitData(false);
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
    getDataIds();
  }, []);

  useEffect(() => {
    if (initData) return;
    getDatas();
  }, [JSON.stringify(tableParams)]);

  function fetchForm() {
    if (viewType === "create") {
      form.resetFields();
    }

    if (viewType !== "update" && viewType !== "create") {
      // form.resetFields();
    }
  }

  useEffect(() => {
    fetchForm();
  }, [viewType]);

  async function fetchDataFormUpdate() {
    try {
      if (!viewId) return;

      let newFilter: any = { _id: viewId };
      const {
        data: { datas, code },
      } = await app.get(`/api/model/${model}/get?filter=${JSON.stringify(newFilter)}`);

      if (code === 200) {
        form.resetFields();
        form?.setFieldsValue({ ...datas[0] });
      }
    } catch (error) {
      useApp.notification.error({ message: "Internal Server Error" });
    }
  }

  useEffect(() => {
    fetchDataFormUpdate();
  }, [viewId]);

  useEffect(() => {}, []);

  return (
    <div>
      <PageHeader
        title={translate({ store: store, modelName: model, source: titleHeader ?? "(No title)" })}
        action={
          <Space wrap>
            {(viewType === "create" || viewType === "update") && <Button onClick={() => router.back()}>Back</Button>}
            {viewType === "create" && (
              <Button type="primary" onClick={() => form.submit()}>
                Create
              </Button>
            )}
            {accessRightModel?.update === true && viewType === "update" && (
              <Button type="primary" onClick={() => form.submit()}>
                Save
              </Button>
            )}
            {accessRightModel?.create === true &&
              viewType !== "create" &&
              viewType !== "update" &&
              !(hideActionCreate === true) && (
                <Button
                  onClick={() => {
                    setQueryParams({ viewType: "create" });
                    setSelectedRowKeys([]);
                  }}
                >
                  Create
                </Button>
              )}
            {accessRightModel?.delete === true && (selectedRowKeys.length > 0 || viewId) && (
              <Button danger onClick={deleteRecord}>
                Delete
              </Button>
            )}
            {actions !== undefined && actions(selectedRowKeys).map((e, index) => <div key={index}>{e}</div>)}
          </Space>
        }
      />

      {viewType === "table" && (
        <div className="page-content">
          <TableView
            model={model}
            columnsTable={newColumnsTable}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
            bordered={tableBoder}
            datas={datas}
            fetchData={getDatas}
            tableParams={tableParams}
            handleTableChange={handleTableChange}
          />
          <div style={{ height: 100 }}></div>
        </div>
      )}

      {(viewType === "create" || viewType === "update") && formLayout !== undefined && (
        <div className="page-content">
          <FormView
            formLayout={formLayout({ store, form, onFinish: onFinishForm, viewType, disabled: getDisableForm() })}
          />
        </div>
      )}

      {viewType === "kanban" && (
        <div>
          <KanbanView
            datas={datas}
            renderItemKanban={(value, index) => renderItemKanban && renderItemKanban(value, index, getDatas)}
          />
        </div>
      )}
    </div>
  );
};

export default DataView;
