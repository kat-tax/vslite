// @ts-ignore
import {WebsocketProvider} from 'y-websocket';
import {MonacoBinding} from 'y-monaco';
import * as Y from 'yjs';

import {Editor} from './monaco';

export type Session = {
  document: Y.Doc,
  provider: WebsocketProvider,
};

export function connect(key: string): Session {
  const document = new Y.Doc();
  const provider = new WebsocketProvider('ws://localhost:1234', key, document);
  return {document, provider};
}

export function monaco(editor: Editor, document: Y.Doc, provider: WebsocketProvider) {
  const type = document.getText('monaco');
  const model = editor.getModel();
  if (model) {
    return new MonacoBinding(type, model, new Set([editor]), provider.awareness);
  } else {
    throw new Error('Model not found');
  }
}
