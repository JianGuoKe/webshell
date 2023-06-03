import React from 'react';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import _ from 'lodash';

export function DataTable(props: { data: any }) {
  let data = props.data;
  if (!_.isArray(data)) {
    if (_.isObject(data)) {
      data = [data];
    } else {
      data = [
        {
          value: data,
        },
      ];
    }
  }

  const columns: ColumnsType<any> = Array.from(
    data.reduce((keys: any, row: any) => {
      Object.keys(row).forEach((key) => keys.add(key));
      return keys;
    }, new Set())
  ).map((key: any) => ({
    title: key,
    dataIndex: key,
    key: key,
    width: 200,
    render: (value) => {
      return JSON.stringify(value);
    },
  }));
  return (
    <Table
      columns={columns}
      dataSource={data}
      size="small"
      pagination={false}
    />
  );
}