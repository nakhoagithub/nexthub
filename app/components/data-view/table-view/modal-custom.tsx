"use client";
import { ColumnModel } from "@/interfaces/model";
import { StoreApp } from "@/store/store";
import app from "@/utils/axios";
import { replaceUndefinedWithNull } from "@/utils/tool";
import { translate } from "@/utils/translate";
import { App, Button, Drawer, Form, FormInstance, Modal } from "antd";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { StoreApi } from "zustand";

const ModalCustom = ({
  open,
  setOpen,
  formLayout,
  columnsModal,
  store,
  model,
  fetchData,
  updateField,
  form,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  formLayout?: (onFinish: (value: any) => Promise<void>) => React.ReactNode;
  columnsModal: ColumnModel[];
  store: StoreApi<StoreApp>;
  model: string;
  fetchData?: () => Promise<void>;
  updateField?: string;
  form: FormInstance<any>;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const drawerCustomType = searchParams.get("drawerCustomType");
  const viewId = searchParams.get("viewId");
  const useApp = App.useApp();

  async function onFinish(values: any) {
    values = replaceUndefinedWithNull(values);
    if (drawerCustomType === "create") {
      try {
        const {
          data: { code, data, message, errors },
        } = await app.post(`/api/model/${model}/create`, { data: { ...values } });
        if (code === 200) {
          useApp.message.success("Success");
          setOpen(false);
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
        useApp.notification.error({ message: "Internal Server Error" });
      }
    }

    if (drawerCustomType === "update") {
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
        useApp.notification.error({ message: "Internal Server Error" });
      }
    }
  }

  function removeQueryParam(paramKey?: string) {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    current.delete(paramKey ?? "");

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
  }, [drawerCustomType]);

  return (
    <Drawer
      open={open}
      onClose={() => {
        drawerCustomType && removeQueryParam("drawerCustomType");
        viewId && removeQueryParam("viewId");
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
      {formLayout && formLayout(onFinish)}
    </Drawer>
  );
};

export default ModalCustom;
