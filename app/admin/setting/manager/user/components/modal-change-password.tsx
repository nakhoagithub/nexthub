import { StoreContext } from "@/app/components/context-provider";
import app from "@/utils/axios";
import { apiResultCode } from "@/utils/tool";
import { translate } from "@/utils/translate";
import { App, Form, Input, Modal } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useContext } from "react";

const ModalChangePassword = ({
  open,
  setOpen,
  id,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  id?: string;
}) => {
  const [form] = useForm();
  const useApp = App.useApp();
  const store = useContext(StoreContext);

  async function onFinish(values: any) {
    try {
      const {
        data: { code, errors, message },
      } = await app.patch(`/api/user/change-password`, { ...values, _id: id });
      if (code === 200) {
        useApp.message.success("Success");
        setOpen(false);
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
      useApp.notification.error({ message: message, description: content });
    }
  }

  return (
    <Modal
      title="Change password"
      open={open}
      onCancel={() => setOpen(false)}
      onOk={() => form.submit()}
      afterClose={() => form.resetFields()}
      afterOpenChange={() => form.resetFields()}
    >
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          name="password"
          rules={[{ required: true, message: translate({ store: store, source: "This field cannot be left blank" }) }]}
        >
          <Input.Password placeholder="New password" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalChangePassword;
