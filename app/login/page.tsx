"use client";
import React, { useContext } from "react";
import { StoreContext } from "../components/context-provider";
import { App, Button, Form, Input } from "antd";
import app from "@/utils/axios";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const store = useContext(StoreContext);
  const { login } = store.getState();
  const useApp = App.useApp();
  const onFinish = async (values: any) => {
    try {
      const {
        data: { data, code, message },
      } = await app.post(`/api/login`, { ...values });
      if (code === 200) {
        login(data);
        useApp.message.success("Success");
        window.location.pathname = "/";
      } else {
        if (message) {
          useApp.message.error(message ?? "");
        }
      }
    } catch (error) {
      useApp.message.error(error?.toString() ?? "");
    }
  };

  const onFinishFailed = (errorInfo: any) => {};

  return (
    <div className="login-page">
      <div className="login-title">Login</div>
      <Form
        name="login"
        layout="vertical"
        style={{ maxWidth: 400 }}
        // initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          // label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input placeholder="Username" />
        </Form.Item>

        <Form.Item
          // label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        {/* <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item> */}

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Page;
