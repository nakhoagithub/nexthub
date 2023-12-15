import { Form, FormInstance } from "antd";
import React from "react";

const FormView = ({ formLayout }: { formLayout: React.ReactNode }) => {
  return <div className="page-form">{formLayout}</div>;
};

export default FormView;
