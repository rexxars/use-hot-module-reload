import {useState, useCallback} from 'react'
import {useHotModuleReload} from 'use-hot-module-reload'
import {Counter} from './Counter'

function App() {
  const [lastHMRed, setLastHMRed] = useState('')
  const updateHMRTime = useCallback(() => setLastHMRed(new Date().toISOString()), [])
  useHotModuleReload(updateHMRTime)

  return (
    <>
      <h1>useHotModuleReload() demo</h1>

      <p>
        {lastHMRed
          ? `Last hot module reload at: ${lastHMRed}`
          : 'Edit some file to trigger an updated lastHMR'}
      </p>

      <Counter />
    </>
  )
}

export default App
