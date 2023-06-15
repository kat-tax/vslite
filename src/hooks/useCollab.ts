import {useRef, useCallback, useEffect} from 'react';

import Debug from '../utils/debug';

import type {ShellInstance} from './useShell';
import type {Editor} from '../modules/monaco';
import type * as YJS from '../modules/yjs';

const debug = Debug('useCollab');

export type CollabInstance = {
  session: React.MutableRefObject<YJS.Session | null>,
  syncEditor: (editor: Editor) => void,
};

export function useCollab(shell: ShellInstance): CollabInstance {
  const init = useRef(false);
  const session = useRef<YJS.Session | null>(null);
  const syncMonaco = useRef<typeof YJS.monaco | null>(null);
  const syncEditor = useCallback((editor: Editor) => {
    if (!session.current || !syncMonaco.current) return;
    debug('Editor sync enabled.');
    syncMonaco.current(editor, session.current.document, session.current.provider);
  }, []);

  useEffect(() => {
    if (init.current) return;
    if (shell && shell.container?.fs) {
      init.current = true;
      const syncKey = location.hash;
      if (!syncKey) return;
      debug('Setting up sync using key:', syncKey);
      // Import sync module & connect
      import('../modules/yjs').then(sync => {
        session.current = sync.connect(syncKey);
        syncMonaco.current = sync.monaco;
        debug('Connected to sync.');
      });
    }
  }, [shell]);

  return {session, syncEditor};
}
