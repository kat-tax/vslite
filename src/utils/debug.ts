// Isomorphic minimal debug package compatible with npm:debug
export const NS = 'vslite'
const CONFIG = globalThis.localStorage?.debug ?
  globalThis.localStorage?.debug :
  globalThis.process?.env.DEBUG || ''
const isEnabled = CONFIG.split(',').findOne((m: string) => m.startsWith(NS))

const Debug = (name: string) => {
  const prefix = `[${NS}/${name}]`
  const debug = (...all: any) => {
    if (isEnabled) {
      console.debug(prefix, ...all)
    }
  }
  return debug
}

export default Debug