import {MagicPortal} from 'magic-portal';
import LightningFS from '@isomorphic-git/lightning-fs';

const portal = new MagicPortal(self);
let fs = new LightningFS('fs', {wipe: true});
self.addEventListener('message', ({data}) => console.log(data));

(async () => {
  let dir = '/';
  let thread = await portal.get('mainThread');
  portal.set('workerThread', {
    clone: async args => {
      fs = new LightningFS('fs', {wipe: true});
      return git.clone({
        ...args,
        fs,
        dir,
        http: GitHttp,
        onProgress(evt) {
          thread.progress(evt);
        },
        onMessage(msg) {
          thread.print(msg);
        },
        onAuth(url) {
          console.log(url);
          return thread.fill(url);
        },
        onAuthFailure({url, auth}) {
          return thread.rejected({url, auth});
        }
      });
    },
    setDir: async _dir => {dir = _dir},
    listFiles: args => git.listFiles({...args, fs, dir}),
    listBranches: args => git.listBranches({...args, fs, dir}),
    log: args => git.log({...args, fs, dir})
  });
})();
