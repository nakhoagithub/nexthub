"use client";
import app from "@/utils/axios";
import { App, Button, Popover, Tree } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context-provider";
import { DataNode, TreeProps } from "antd/es/tree";

const SelecteOrg = () => {
  const [loading, setLoading] = useState(false);
  const useApp = App.useApp();
  const store = useContext(StoreContext);
  const { user } = store.getState();
  const [orgs, setOrgs] = useState<any[]>([]);
  const [datas, setDatas] = useState<DataNode[]>([]);

  async function fetchOrg() {
    try {
      if (!user) return;
      let filter = { _id: { $in: user.idsOrg ?? [] }, active: true };
      const {
        data: { code, message, datas },
      } = await app.get(`/api/model/org/get?filter=${JSON.stringify(filter)}`);

      if (code === 200) {
        setOrgs(datas);
        if (Array.isArray(datas)) {
          let newDatas: DataNode[] = [];
          for (var data of datas) {
            let name =
              data.shortName && data.shortName !== "" ? data.shortName : data.name && data.name !== "" ? data.name : "";
            newDatas.push({ key: data._id, title: name });
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

  const onCheck: TreeProps["onCheck"] = async (checkedKeys, info) => {
    await updateIdsOrgForUser(checkedKeys as React.Key[]);
  };

  async function fetchData() {
    setLoading(true);
    fetchOrg();
    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const content = (
    <Tree
      treeData={datas}
      checkable
      onCheck={onCheck}
      blockNode
      defaultCheckedKeys={(user?.idsCurrentOrg ?? []).filter((e) => orgs.find((org) => org._id === e))}
    />
  );

  return (
    <div>
      {user && (
        <Popover content={content} title="Select Organization" trigger="click">
          <Button>Org</Button>
        </Popover>
      )}
    </div>
  );
};

export default SelecteOrg;
