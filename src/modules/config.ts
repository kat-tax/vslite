// localStorage.vslite = JSON.stringify({ rootSecrets: {'NSA_TOKEN': 'jibirish'} }, null,2)
import { join as pathJoin } from 'node:path';
import { homedir } from 'node:os';

type Config = {
  showHidden: boolean;
  // TODO: Make tool that exposes a secret to the current URL
  rootSecrets: { [key: string]: string }; // https://vslite.dev/
  // globalSecrets // Not exposed to any origin by default
  // staticSecrets // Exposed to origin with strict string comparison
  // dynamicSecrets // Exposed with regex or picomatch
}

let cache: Config

export function getConfig() {
  if (!cache) {
    cache = JSON.parse(globalThis.localStorage?.getItem('vslite') || '{}');
  }
  return cache
}

export function setConfig(config: Config) {
  localStorage.setItem('vslite', JSON.stringify(config, null, 2));
}

export function getConfigPath() {
  return pathJoin(homedir(), '.vslite');
}
