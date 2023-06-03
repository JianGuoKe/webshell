import { useRef, useState, useEffect } from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import 'monaco-editor/esm/vs/editor/editor.all.js';
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';
import 'monaco-editor/esm/vs/language/json/monaco.contribution';

import './Editor.less';

const win: any = window;
let timer: any;

function saveCode() {
  if (win.editor) {
    localStorage.setItem('wsh.script', win.editor.getValue());
  }
  timer = setTimeout(saveCode, 2000);
}

export const Editor = (props: any) => {
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoEl = useRef(null);

  useEffect(() => {
    if (monacoEl) {
      setEditor((editor) => {
        win.editor = editor;
        if (!timer) {
          timer = setTimeout(saveCode, 2000);
        }
        if (editor) return editor;

        const inst = (win.editor = monaco.editor.create(monacoEl.current!, {
          value: localStorage.getItem('wsh.script') || '',
          language: 'javascript',
          theme: props.theme || 'vs-dark',
        }));

        timer = setTimeout(saveCode, 2000);

        return inst;
      });
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      win.editor = null;
      editor?.dispose();
    };
  }, [monacoEl.current]);

  useEffect(() => {
    if (editor) {
      (editor as any)._themeService.setTheme(props.theme);
    }
  }, [props.theme]);

  return <div className="wsh-editor" ref={monacoEl}></div>;
};
