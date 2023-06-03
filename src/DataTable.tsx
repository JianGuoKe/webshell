import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import _ from 'lodash';
import './DataTable.less';

export function DataTable(props: { data: any; isFull: boolean }) {
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
  } else {
    data = data.map((row) => {
      if (!_.isObject(row)) {
        return { value: row };
      } else {
        return row;
      }
    });
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

  const h = props.isFull ? window.innerHeight : 378;

  return (
    <Table
      className="wsh-result-table"
      columns={columns}
      scroll={{ y: h - 43 - 39 }}
      dataSource={data}
      size="small"
      pagination={false}
    />
  );
}
