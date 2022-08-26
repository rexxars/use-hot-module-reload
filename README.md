# use-hot-module-reload

React hook that triggers a callback after hot-module reloading has been performed (for any module, not just the one it was used in).

Works with modern versions of Webpack and Vite.
Other bundlers may be added if they expose a way to listen for updates.

## Installation

```
npm install --save use-hot-module-reload
```

## Usage

```tsx
import {useState, useCallback} from 'react'
import {useHotModuleReload} from 'use-hot-module-reload'

export function MyComponent() {
  const [lastHMRed, setLastHMRed] = useState('')
  const updateHMRTime = useCallback(() => setLastHMRed(new Date().toISOString()), [])
  useHotModuleReload(updateHMRTime)

  return <div>{lastHMRed && `Last hot module reload at: ${lastHMRed}`}</div>
}
```

## License

MIT © [Espen Hovlandsdal](https://espen.codes/)
