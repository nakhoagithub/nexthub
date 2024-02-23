"use client";
import { StoreApp } from "@/store/store";
import app from "@/utils/axios";
import { apiResultCode } from "@/utils/tool";
import { App, Button, Drawer } from "antd";
import dynamic from "next/dynamic";
import React, { useMemo, useState } from "react";
import { StoreApi } from "zustand";

const JoditEditor = dynamic(() => import("jodit-react"), {
  ssr: false,
});

const ModalEditorContent = ({
  open,
  setOpen,
  keyData,
  data,
  placeholder,
  store,
  model,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  keyData: string;
  data: any;
  placeholder?: string;
  store?: StoreApi<StoreApp>;
  model: string;
}) => {
  const [text, setText] = useState(data?.[`${keyData}` ?? ""]);
  const useApp = App.useApp();

  const initialValue = {
    readonly: false,
    placeholder: placeholder || "Start typings...",
    removeButtons: ["speechRecognize", "spellcheck"],
  };
  const config = useMemo(() => initialValue, [placeholder]);

  const save = async () => {
    if (!data._id) {
      useApp.message.error("Error: Can't found _id");
      return;
    }

    try {
      let values = {
        [keyData]: text,
      };

      const {
        data: { code, errors, message },
      } = await app.patch(`/api/db/${model}`, {
        fieldId: "_id",
        datas: [{ ...values, _id: data._id }],
      });

      if (code === 200) {
        useApp.message.success("Success");
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
      if (store) {
        let { message, content } = apiResultCode({ error: error, store });
        useApp.notification.error({
          message: message,
          description: <span style={{ whiteSpace: "pre-line" }}>{content}</span>,
        });
      }
    }
  };

  return (
    <Drawer
      open={open}
      onClose={() => setOpen(false)}
      extra={
        <Button onClick={() => save()} type="primary">
          Save
        </Button>
      }
      width={800}
    >
      <div>
        <JoditEditor
          config={config}
          value={data?.[`${keyData}`] ?? ""}
          onChange={(value) => {
            setText(value);
          }}
        />
      </div>
    </Drawer>
  );
};

export default ModalEditorContent;
