import React from 'react';
import ReactDOM from 'react-dom/client';
import Shell from './Shell';
import './index.less';
import { ConfigProvider } from 'antd';
import './tracker';
import { px2remTransformer, StyleProvider } from '@ant-design/cssinjs';

console.log(
  `
    __ _____ _____ _____ _____ _____ _____ _____ _____ 
 __|  |     |  _  |   | |   __|  |  |     |  |  |   __|
|  |  |-   -|     | | | |  |  |  |  |  |  |    -|   __|
|_____|_____|__|__|_|___|_____|_____|_____|__|__|_____|
`
);
console.log(
  '%c          这是一个在浏览器里执行的脚本Shell',
  'color: #43bb88; font-weight: bold; '
);
console.log(
  '%c        https://github.com/JianGuoKe/webshell',
  'font-weight: bold; '
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#202124',
        },
      }}
    >
      <StyleProvider
        transformers={[
          px2remTransformer({
            rootValue: 16,
          }),
        ]}
      >
        <Shell />
      </StyleProvider>
    </ConfigProvider>
  </React.StrictMode>
);
