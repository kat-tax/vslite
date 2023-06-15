import {useMonaco} from '@monaco-editor/react';
import {useRef, useEffect} from 'react';
import {useLaunchQueue} from '../hooks/useLaunchQueue';
import {useCollab} from '../hooks/useCollab';
import {useShell} from '../hooks/useShell';
import {openFolder} from '../modules/webcontainer';
import * as panels from '../modules/panels';

import type {MutableRefObject} from 'react';
import type {DockviewApi, GridviewApi, PaneviewApi} from 'dockview';

export function useStartup(
  grid: MutableRefObject<GridviewApi | undefined>,
  dock: MutableRefObject<DockviewApi | undefined>,
  panes: MutableRefObject<PaneviewApi | undefined>,
) {
  const shell = useShell();
  const monaco = useMonaco();
  const collab = useCollab(shell);
  const launch = useLaunchQueue();

  const initTerm = useRef(false);
  const initLaunch = useRef(false);
  const initFileTree = useRef(false);

  // Open terminal when shell is ready
  useEffect(() => {
    if (initTerm.current) return;
    if (shell && grid.current && dock.current) {
      initTerm.current = true;
      panels.openTerminal(shell, grid.current, dock.current);
    }
  }, [shell]);

  // Open file tree when FS is ready
  useEffect(() => {
    if (initFileTree.current) return;
    if (shell.container?.fs && panes.current && dock.current) {
      initFileTree.current = true;
      panels.openFileTree(shell.container.fs, panes.current, dock.current, collab);
    }
  }, [shell]);

  // PWA launch queue
  useEffect(() => {
    if (initLaunch.current) return;
    const fs = shell?.container?.fs;
    const api = dock.current;
    if (!fs || !api || !monaco) return;
    // Open files
    if (launch.files.length > 0) {
      // TODO: ask for containing folder access
      launch.files.forEach(file => panels.openStartFile(file, fs, api, collab));
    // Execute action
    } else if (launch.action) {
      switch (launch.action) {
        case 'open_folder': {
          // TODO: trigger via a dialog due to security
          openFolder(fs, api);
          break;
        }
      }
    // Open blank file (if no URL)
    } else if (location.pathname === '/') {
      panels.openUntitledFile(fs, api, collab);
    }
    initLaunch.current = true;
  }, [monaco, launch, shell]);
}
