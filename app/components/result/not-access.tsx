import { Button, Result } from "antd";
import { useRouter } from "next/navigation";
import React from "react";

const NotAccess = () => {
  const router = useRouter();
  return (
    <div className="page-result">
      <Result
        status="error"
        title="Not Access"
        subTitle="You can not access this page."
        extra={[
          <Button key="back" type="primary" onClick={() => router.push("/")}>
            Back Home
          </Button>,
        ]}
      >
        {/* <div className="desc">
        <Paragraph>
          <Text
            strong
            style={{
              fontSize: 16,
            }}
          >
            The content you submitted has the following error:
          </Text>
        </Paragraph>
        <Paragraph>
          <CloseCircleOutlined className="site-result-demo-error-icon" /> Your account has been frozen.{" "}
          <a>Thaw immediately &gt;</a>
        </Paragraph>
        <Paragraph>
          <CloseCircleOutlined className="site-result-demo-error-icon" /> Your account is not yet eligible to apply.{" "}
          <a>Apply Unlock &gt;</a>
        </Paragraph>
      </div> */}
      </Result>
    </div>
  );
};

export default NotAccess;
