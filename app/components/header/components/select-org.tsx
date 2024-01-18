"use client";
import app from "@/utils/axios";
import { App, Button, Checkbox, Col, Popover, Tree } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context-provider";
import { CheckboxOptionType, CheckboxValueType } from "antd/es/checkbox/Group";
import { CheckboxChangeEvent } from "antd/es/checkbox/Checkbox";

const SelecteOrg = () => {
  const [loading, setLoading] = useState(false);
  const useApp = App.useApp();
  const store = useContext(StoreContext);
  const { user } = store.getState();
  const [orgs, setOrgs] = useState<any[]>([]);
  const [datas, setDatas] = useState<any[]>([]);

  async function fetchOrg() {
    try {
      if (!user) return;
      let filter = { _id: { $in: user.idsOrg ?? [] }, active: true };
      const {
        data: { code, message, datas },
      } = await app.get(`/api/db/org?filter=${JSON.stringify(filter)}`);

      if (code === 200) {
        setOrgs(datas);
        if (Array.isArray(datas)) {
          let newDatas = [];
          for (var data of datas) {
            let name =
              data.shortName && data.shortName !== "" ? data.shortName : data.name && data.name !== "" ? data.name : "";
            newDatas.push({ value: data._id, label: name });
          }
          setDatas(newDatas);
        }
      }
    } catch (error) {
      useApp.message.error(error?.toString() ?? "");
    }
  }

  async function updateIdsOrgForUser(ids: any[]) {
    try {
      if (!user) return;
      const {
        data: { code, message, datas },
      } = await app.patch(`/api/user/update-current-org`, { ids: ids });
      if (code === 200) {
        useApp.message.success("Success");
      }
    } catch (error) {
      useApp.message.error(error?.toString() ?? "");
    }
  }

  const onChange = (list: CheckboxValueType[]) => {
    updateIdsOrgForUser(list);
  };

  async function fetchData() {
    setLoading(true);
    fetchOrg();
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {user && datas.length > 0 && (
        <Popover
          content={
            <Checkbox.Group
              options={datas}
              onChange={onChange}
              defaultValue={(user?.idsCurrentOrg ?? []).filter((e) => orgs.find((org) => org._id === e))}
            />
          }
          title="Select Organization"
          trigger="click"
        >
          <Button>Org</Button>
        </Popover>
      )}
    </div>
  );
};

export default SelecteOrg;
