// Added by `vite-plugin-react`
interface Window {
  // eslint-disable-next-line camelcase
  __vite_plugin_react_timeout: number
}

// Added by webpack in CommonJS mode
interface NodeModule {
  hot?: {
    addStatusHandler: (handler: (status: string) => void) => void
    removeStatusHandler: (handler: (status: string) => void) => void
  }
}

interface ImportMeta {
  // Added by webpack in ESM mode
  webpackHot?: {
    addStatusHandler: (handler: (status: string) => void) => void
    removeStatusHandler: (handler: (status: string) => void) => void
  }

  // Added by vite
  hot?: {
    on: (event: 'vite:beforeUpdate', handler: () => void) => void
  }
}
