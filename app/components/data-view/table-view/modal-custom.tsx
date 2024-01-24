"use client";
import { ColumnModel } from "@/interfaces/model";
import { StoreApp } from "@/store/store";
import app from "@/utils/axios";
import { apiResultCode, replaceUndefinedWithNull } from "@/utils/tool";
import { translate } from "@/utils/translate";
import { App, Button, Drawer, Form, FormInstance, Modal } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { StoreApi } from "zustand";

const ModalCustom = ({
  open,
  setOpen,
  formLayout,
  store,
  model,
  fetchData,
  updateField,
  form,
  dataFormDefault,
  customValuesFinish,
  customValuesInit,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  formLayout?: (onFinish: (value: any) => Promise<void>) => React.ReactNode;
  store: StoreApi<StoreApp>;
  model: string;
  fetchData?: () => Promise<void>;
  updateField?: string;
  form: FormInstance<any>;
  dataFormDefault?: any;
  customValuesFinish?: (values: any) => any;
  customValuesInit?: (values: any) => any;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const viewType = searchParams.get("viewType");
  const viewId = searchParams.get("viewId");
  const useApp = App.useApp();

  async function onFinish(values: any) {
    values = replaceUndefinedWithNull(values);
    if (viewType === "create") {
      try {
        let newDefault = {};
        if (Object.keys(dataFormDefault ?? {}).length > 0) {
          newDefault = dataFormDefault;
        }

        const {
          data: { code, message, errors },
        } = await app.post(`/api/db/${model}`, { data: { ...values, ...newDefault } });
        if (code === 200) {
          useApp.message.success("Success");
          setOpen(false);
          form.resetFields();
          fetchData && fetchData();
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
        console.log(error);
        let { message, content } = apiResultCode({ error: error, store });
        useApp.notification.error({
          message: message,
          description: <span style={{ whiteSpace: "pre-line" }}>{content}</span>,
        });
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
        } = await app.patch(`/api/db/${model}`, {
          fieldId: updateField ?? "_id",
          datas: [{ ...values, _id: viewId }],
        });

        if (code === 200) {
          useApp.message.success("Success");
          fetchData && fetchData();
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
        let { message, content } = apiResultCode({ error: error, store });
        useApp.notification.error({
          message: message,
          description: <span style={{ whiteSpace: "pre-line" }}>{content}</span>,
        });
      }
    }
  }

  function removeQueryParams(paramKeys: string[] = []) {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    paramKeys.forEach((paramKey) => {
      current.delete(paramKey);
    });
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  }

  async function fetchDataFormUpdate() {
    try {
      if (!viewId) return;

      let newFilter: any = { _id: viewId };
      const {
        data: { datas, code },
      } = await app.get(`/api/db/${model}?filter=${JSON.stringify(newFilter)}`);

      if (code === 200) {
        form.resetFields();
        if (customValuesInit) {
          form?.setFieldsValue({ ...customValuesInit({ ...datas[0] }) });
        } else {
          form?.setFieldsValue({ ...datas[0] });
        }
      }
    } catch (error) {
      let { message, content } = apiResultCode({ error: error, store });
      useApp.notification.error({
        message: message,
        description: <span style={{ whiteSpace: "pre-line" }}>{content}</span>,
      });
    }
  }

  useEffect(() => {
    fetchDataFormUpdate();
  }, [viewType, viewId]);

  return (
    <Drawer
      open={open}
      onClose={() => {
        if (viewType == "create") {
          viewType && removeQueryParams(["viewType"]);
        } else if (viewType == "update") {
          viewType && viewId && removeQueryParams(["viewType", "viewId"]);
        }
        setOpen(false);
        form.resetFields();
      }}
      width={800}
      extra={[
        <Button key="save" type="primary" onClick={() => form.submit()}>
          {translate({ store, source: "Save" })}
        </Button>,
      ]}
    >
      {formLayout &&
        formLayout((values) => {
          if (customValuesFinish) {
            return onFinish(customValuesFinish(values));
          } else {
            return onFinish(values);
          }
        })}
    </Drawer>
  );
};

export default ModalCustom;
