import './Shell.less';
import { trackClick } from './tracker';
import MonacoEditor from 'react-monaco-editor';
import { Button, Drawer, Popover, Space, Switch, message } from 'antd';
import {
  CaretRightOutlined,
  ClearOutlined,
  FormatPainterOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { useShortKey } from 'use-short-key';
import { useEffect, useState } from 'react';
import createWorkerBox from 'workerboxjs';
import 'monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution';
import 'monaco-editor/esm/vs/language/json/monaco.contribution';
import { editor } from 'monaco-editor/esm/vs/editor/editor.api';
// import 'monaco-editor/esm/vs/editor/editor.all.js';
import prettier from 'prettier/esm/standalone.mjs';
import typescript from 'prettier/esm/parser-typescript';
import stringify from 'safe-stable-stringify';
import JSONC from 'jsonc-simple-parser';
import { DataTable } from './DataTable';
import { DataText } from './DataText';

let theeditor: editor.IStandaloneCodeEditor;

const dataResults: { [key: string]: any } = {
  table: DataTable,
  text: DataText,
};

export default function () {
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState<any>();
  const [dataView, setDataView] = useState('table');
  const [isFull, setFull] = useState(false);

  async function runScript() {
    trackClick('runScript', '执行脚本');
    const script = theeditor?.getValue();
    const { run, destroy } = await createWorkerBox(null);
    const scope = {
      table: (data: any) => {
        setDataView('table');
        setData(data);
        setOpen(true);
      },
      text: (data: any) => {
        setDataView('text');
        setData(data);
        setOpen(true);
      },
    };
    try {
      const ret = await run(script, scope);
      if (ret) {
        messageApi.success(ret);
      }
    } catch (err) {
      message.error('失败' + (err as any).message);
    } finally {
      destroy();
    }
  }

  async function formatScript() {
    trackClick('formatScript', '格式化脚本');
    try {
      theeditor.setValue(
        prettier.format(theeditor.getValue(), {
          parser: 'typescript',
          plugins: [typescript],
        })
      );
    } catch (err) {
      messageApi.error((err as any).message);
    }
  }

  async function formatJSON() {
    trackClick('formatJSON', '格式化JSON');
    try {
      theeditor.setValue(
        stringify(JSONC.parse(theeditor.getValue()), null, 2) || ''
      );
    } catch (err) {
      messageApi.error((err as any).message);
    }
  }

  async function clearScript() {
    trackClick('clearScript', '清理脚本');
    theeditor.setValue('');
  }

  async function undo() {
    trackClick('undo', '撤销');
    theeditor.trigger(null, 'undo', null);
  }
  async function redo() {
    trackClick('redo', '重做');
    theeditor.trigger(null, 'redo', null);
  }

  async function handleKeyDown(e: KeyboardEvent) {
    trackClick('keydown', '快捷键', {
      key: e.key,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
    });
    e.preventDefault();
    if (e.key === 'F5') {
      runScript();
    }
    if (e.key === 'F2') {
      formatScript();
    }
    if (e.key === 'F4') {
      formatJSON();
    }
    if (e.key === 'F9') {
      clearScript();
    }
    if ((e.key == 'z' || e.key == 'Z') && e.ctrlKey) {
      undo();
    }
    if (
      (e.key == 'y' || ((e.key == 'z' || e.key == 'Z') && e.shiftKey)) &&
      e.ctrlKey
    ) {
      redo();
    }
  }

  useShortKey({ code: 'F5', keydown: handleKeyDown, includeFormField: true });
  useShortKey({ code: 'F2', keydown: handleKeyDown, includeFormField: true });
  useShortKey({ code: 'F4', keydown: handleKeyDown, includeFormField: true });
  useShortKey({ code: 'F9', keydown: handleKeyDown, includeFormField: true });
  useShortKey({
    code: 'z',
    key: 'Control',
    keydown: handleKeyDown,
    includeFormField: true,
  });
  useShortKey({
    code: 'y',
    key: 'Control',
    keydown: handleKeyDown,
    includeFormField: true,
  });
  useShortKey({
    code: 'Z',
    key: 'Control',
    keydown: handleKeyDown,
    includeFormField: true,
  });
  useShortKey({
    code: 'Y',
    key: 'Control',
    keydown: handleKeyDown,
    includeFormField: true,
  });
  useShortKey({
    code: 'z',
    key: 'Command',
    keydown: handleKeyDown,
    includeFormField: true,
  });
  useShortKey({
    code: 'z',
    key: 'Command',
    shiftKey: true,
    keydown: handleKeyDown,
    includeFormField: true,
  });
  useShortKey({
    code: 'Z',
    key: 'Command',
    keydown: handleKeyDown,
    includeFormField: true,
  });
  useShortKey({
    code: 'Z',
    key: 'Command',
    shiftKey: true,
    keydown: handleKeyDown,
    includeFormField: true,
  });

  const [theme, setTheme] = useState(
    localStorage.getItem('wsh.theme') || 'dark'
  );
  const [code, setCode] = useState(
    localStorage.getItem('wsh.code') || 'table([1,2,3]);'
  );
  useEffect(() => localStorage.setItem('wsh.theme', theme), [theme]);
  useEffect(() => localStorage.setItem('wsh.code', code), [code]);
  const [open, setOpen] = useState(false);

  function onClose() {
    setOpen(false);
  }

  function editorDidMount(editor: editor.IStandaloneCodeEditor) {
    theeditor = editor;
    theeditor.focus();
  }

  const ResultView = dataResults[dataView] as any;

  return (
    <div className={'wsh ' + theme}>
      <div className={'wsh-toolbar'}>
        <Space className="left">
          <Button
            type="primary"
            className="run"
            icon={<CaretRightOutlined />}
            title="F5执行脚本"
            onClick={runScript}
          >
            F5
          </Button>
          <Popover
            content={
              <div>
                <p>table: 可以显示一个数据集合, 例如:table([xxx,xxx])</p>
                <p>text: 可以显示一个json文本, 例如:text(xxxx)</p>
              </div>
            }
            title="数据集函数"
          >
            <Button
              type="primary"
              icon={<TableOutlined />}
              title="执行结果"
              onClick={() => setOpen(true)}
            >
              结果
            </Button>
          </Popover>
        </Space>
        <div className="center">
          <Space>
            <Button
              type="primary"
              title="F2格式化脚本"
              icon={<FormatPainterOutlined />}
              onClick={formatScript}
            >
              格式化脚本
            </Button>
            <Button
              type="primary"
              className="json"
              title="F4格式化JSON"
              icon={<FormatPainterOutlined />}
              onClick={formatJSON}
            >
              格式化JSON
            </Button>
          </Space>
        </div>
        <Space className="right">
          <Button
            type="primary"
            title="F9清空脚本"
            icon={<ClearOutlined />}
            onClick={clearScript}
          ></Button>
          <Switch
            className="theme"
            checkedChildren="深"
            unCheckedChildren="浅"
            checked={theme === 'dark'}
            onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          />
        </Space>
      </div>
      <MonacoEditor
        theme={theme === 'dark' ? 'vs-dark' : 'default'}
        value={code}
        onChange={setCode}
        language="typescript"
        options={{
          automaticLayout: true,
          scrollbar: {
            // vertical: 'hidden',
          },
          minimap: {
            // autohide: true,
            enabled: false,
          },
        }}
        editorDidMount={editorDidMount}
      ></MonacoEditor>
      <Drawer
        title="执行结果"
        placement={'bottom'}
        closable={false}
        onClose={onClose}
        open={open}
        height={isFull ? '100%' : ''}
        extra={
          <Space>
            <Button
              type="text"
              title="放大"
              icon={
                isFull ? <FullscreenExitOutlined /> : <FullscreenOutlined />
              }
              onClick={() => setFull(!isFull)}
            ></Button>
            <Button
              type="text"
              icon={<ClearOutlined />}
              onClick={() => {
                setData([]);
                setOpen(false);
              }}
              title="清空数据结果"
            ></Button>
          </Space>
        }
        className="wsh-result"
      >
        <ResultView data={data} isFull={isFull}></ResultView>
      </Drawer>
      {contextHolder}
    </div>
  );
}
