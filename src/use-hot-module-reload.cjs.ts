import {useEffect} from 'react'

// Allow us to short-circuit in production/non-HMR environments
const hasHMR = () => {
  try {
    return Boolean(typeof module !== 'undefined' && module.hot)
  } catch (err) {
    return false
  }
}

/**
 * Trigger a callback after hot-module reloads (any, not only the module using the hook).
 * Use it to force recomputation of stale values and state that do not automatically update.
 * This should be an escape hatch - ideally you shouldn't need this.
 *
 * @param callback - The callback to be triggered after hot-module reloads.
 */
export function useHotModuleReload(callback: () => void): void {
  if (!hasHMR) {
    return undefined
  }

  return useCJSHotModuleReload(callback)
}

function useCJSHotModuleReload(callback: () => void): void {
  useEffect(() => {
    if (typeof module.hot === 'undefined' || typeof module.hot?.addStatusHandler !== 'function') {
      return undefined
    }

    // Webpack in CommonJS mode
    const statusHandler = (status: string): void => (status === 'idle' ? callback() : undefined)
    module.hot.addStatusHandler(statusHandler)

    return () => module.hot?.removeStatusHandler(statusHandler)
  }, [callback])
}
