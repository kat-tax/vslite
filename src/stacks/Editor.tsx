import Monaco from '@monaco-editor/react';

interface CodeProps {
  instance: any,
  path: string,
  contents?: string,
  language?: string,
  updateContents: (path: string, contents?: string) => void,
}

export function Editor(props: CodeProps) {
  return (
    <Monaco
      theme={'vs-dark'}
      path={props.path}
      value={props.contents}
      language={props.language}
      onChange={value => props.updateContents(props.path, value)}
    />
  );
}
