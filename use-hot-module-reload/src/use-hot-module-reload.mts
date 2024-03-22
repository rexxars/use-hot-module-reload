import {useEffect} from 'react'

// Even accessing `import` for a `typeof` check will throw in non-ESM mode,
// thus the try/catch
const isModule = (() => {
  try {
    return typeof import.meta !== 'undefined'
  } catch (err) {
    return false
  }
})()

// Allow us to short-circuit in production/non-HMR environments
const hasHMR = (() => {
  try {
    return Boolean(isModule && (import.meta.hot || import.meta.webpackHot))
  } catch (err) {
    return false
  }
})()

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

  return typeof import.meta.webpackHot === 'undefined'
    ? // eslint-disable-next-line react-hooks/rules-of-hooks -- Vite vs Webpack won't change at runtime
      useViteHotModuleReload(callback)
    : // eslint-disable-next-line react-hooks/rules-of-hooks -- Vite vs Webpack won't change at runtime
      useWebpackHotModuleReload(callback)
}

function useWebpackHotModuleReload(callback: () => void): void {
  useEffect(() => {
    if (import.meta.webpackHot) {
      // Webpack in CommonJS mode
      const statusHandler = (status: string): void => (status === 'idle' ? callback() : undefined)
      import.meta.webpackHot.addStatusHandler(statusHandler)

      return () => import.meta.webpackHot?.removeStatusHandler(statusHandler)
    }

    return undefined
  }, [callback])
}

function useViteHotModuleReload(callback: () => void): void {
  useEffect(() => {
    // Note: not using early return here in order to optimize tree-shaking
    if (import.meta.hot) {
      /**
       * Unfortunately, there is currently no `vite:afterUpdate` event
       * (see https://github.com/vitejs/vite/pull/9810), and `react-refresh`
       * does not expose a way to listen for flushed updates (the vite HMR only
       * _schedules_ an update - the update is then done asynchronously).
       *
       * Many attempts were done to find a way to know that React actually updated
       * with the new code, but because of layers of timeouts, debouncing, partially
       * updated trees and whatnot; this is complicated.
       *
       * What this actually does is to wait for a `beforeUpdate` event, and then
       * probe for the `__vite_plugin_react_timeout` window global to become non-zero.
       * When it is, it means an update is _scheduled_, which has a 30ms timeout and
       * a 16 ms debounce - so in essence it should be non-zero for about 46ms.
       *
       * Once it goes back to 0, it means the update is done, and we can trigger the
       * callback. Since this is a bit best-effort and not 100% reliable, we also add
       * a 1000ms timeout to make sure we don't wait forever should the update already
       * have been applied before we observed the change, or if vite changes the
       * implementation details (I have requested a callback/event from the vite crew).
       */
      const disposers = new Set<() => void>()
      import.meta.hot.on('vite:beforeUpdate', () => {
        let flushTimeout: number | ReturnType<typeof setTimeout>
        let hasSeenScheduledUpdate = window.__vite_plugin_react_timeout > 0

        const refreshProber = setInterval(() => {
          const now = window.__vite_plugin_react_timeout
          if (hasSeenScheduledUpdate && now === 0) {
            complete()
          } else if (!hasSeenScheduledUpdate && now > 0) {
            hasSeenScheduledUpdate = true
          }
        }, 10)

        const fallbackTimeout = setTimeout(complete, 1000, 'fallback')

        function clear() {
          clearInterval(refreshProber)
          clearTimeout(fallbackTimeout)
          clearTimeout(flushTimeout)
        }

        function complete() {
          clear()

          // While the react refresh has been _triggered_ by this point, it may
          // not be flushed yet. Wait for an additional 50ms to make sure it is.
          flushTimeout = setTimeout(callback, 50)
        }

        disposers.add(clear)
      })

      return () => {
        disposers.forEach((disposer) => disposer())
        disposers.clear()
      }
    }

    return undefined
  }, [callback])
}
