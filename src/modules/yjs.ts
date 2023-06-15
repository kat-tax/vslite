import {WebrtcProvider} from 'y-webrtc';
import {MonacoBinding} from 'y-monaco';
import * as Y from 'yjs';

import type {Editor} from './monaco';

export type Session = {
  document: Y.Doc,
  provider: WebrtcProvider,
};

export function connect(key: string): Session {
  const document = new Y.Doc();
  const provider = new WebrtcProvider(key, document);
  return {document, provider};
}

export function monaco(editor: Editor, document: Y.Doc, provider: WebrtcProvider) {
  const path = editor.getModel()?.uri.path;
  const model = editor.getModel();
  const $type = document.getText(path);
  if (model) {
    return new MonacoBinding($type, model, new Set([editor]), provider.awareness);
  } else {
    throw new Error('Model not found');
  }
}
