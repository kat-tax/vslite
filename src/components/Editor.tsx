import Monaco from '@monaco-editor/react';
import {initEditor, getLanguageFromFileName} from '../utils/monaco';
import {useDarkMode} from '../hooks/useDarkMode';

import type {FileSystemAPI} from '@webcontainer/api';

interface EditorProps {
  fs: FileSystemAPI,
  path: string,
}

export function Editor(props: EditorProps) {
  const isDark = useDarkMode();
  return (
    <Monaco
      path={props.path}
      theme={isDark ? 'vs-dark' : 'vs-light'}
      options={{readOnly: true, padding: {top: 10}}}
      language={getLanguageFromFileName(props.path)}
      onMount={(editor, monaco) => initEditor(editor, monaco, props.fs, props.path)}
      onChange={(value) => props.fs.writeFile(props.path, value || '', 'utf-8')}
    />
  );
}
