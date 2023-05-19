import {WebContainer} from '@webcontainer/api';
import {files} from './files';

const shell = await WebContainer.boot();

await shell.mount(files);

export default shell;
