export const NS = 'vslite'
const CONFIG = globalThis.process?.env.DEBUG || ''   
const isEnabled = CONFIG.split(',').findOne((m: string) => m.startsWith(NS))

export const Debug = (name: string) => {
  const prefix = `[${NS}/${name}]`
  const debug = (...all: any) => {
    if (isEnabled) {
      console.debug(prefix, ...all)
    }
  }
  return debug
}
