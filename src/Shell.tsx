import './Shell.less';
import { trackClick } from './tracker';
import { Editor } from './Editor';
import { Button } from 'antd';

export default function ({}: {}) {
  return (
    <div className="wsh">
      <div className="wsh-toolbar">
        <Button type="primary">执行</Button>
        <Button type="primary">调试</Button>
        <Button type="primary">格式化</Button>
      </div>
      <Editor></Editor>
    </div>
  );
}
