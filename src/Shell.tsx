import './Shell.less';
import { trackClick } from './tracker';
import { Editor } from './Editor';
import { Button, Switch, message } from 'antd';
import {
  CaretRightOutlined,
  ClearOutlined,
  FormatPainterOutlined,
} from '@ant-design/icons';
import { useShortKey } from 'use-short-key';
import { useEffect, useState } from 'react';
import createWorkerBox from 'workerboxjs';

const win: any = window;

async function runScript() {
  trackClick('runScript', '执行脚本');
  const script = win.editor?.getValue();
  const { run, destroy } = await createWorkerBox(null);
  const scope = {};
  try {
    const ret = await run(script, scope);
    if (ret) {
      message.success('成功：' + ret);
    } else {
      message.success('成功');
    }
  } catch (err) {
    message.error('失败' + (err as any).message);
  } finally {
    destroy();
  }
}

async function formatScript() {
  trackClick('formatScript', '格式化脚本');
}

async function clearScript() {
  trackClick('clearScript', '清理脚本');
  win.editor.setValue('');
}

async function handleKeyDown(e: KeyboardEvent) {
  trackClick('keydown', '快捷键', e.key);
  e.preventDefault();
  if (e.key === 'F5') {
    return runScript();
  }
  if (e.key === 'F2') {
    return formatScript();
  }
  if (e.key === 'F9') {
    return clearScript();
  }
}

export default function () {
  useShortKey({ code: 'F5', keydown: handleKeyDown, includeFormField: true });
  useShortKey({ code: 'F2', keydown: handleKeyDown, includeFormField: true });
  useShortKey({ code: 'F9', keydown: handleKeyDown, includeFormField: true });

  const [theme, setTheme] = useState(
    localStorage.getItem('wsh.theme') || 'dark'
  );
  useEffect(() => localStorage.setItem('wsh.theme', theme), [theme]);

  return (
    <div className={'wsh ' + theme}>
      <div className={'wsh-toolbar'}>
        <Button
          type="primary"
          icon={<CaretRightOutlined />}
          title="F5执行脚本"
          onClick={runScript}
        ></Button>
        <Button
          type="primary"
          title="F2格式化脚本"
          icon={<FormatPainterOutlined />}
          onClick={formatScript}
        ></Button>
        <Button
          type="primary"
          title="F9清空脚本"
          icon={<ClearOutlined />}
          onClick={clearScript}
        ></Button>
        <Switch
          className="theme"
          checkedChildren="深色"
          unCheckedChildren="浅色"
          checked={theme === 'dark'}
          onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
        />
      </div>
      <Editor theme={theme === 'dark' ? 'vs-dark' : 'default'}></Editor>
    </div>
  );
}
