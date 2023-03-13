import React from 'react'
import {render, screen} from '@testing-library/react'
import {useHotModuleReload} from 'use-hot-module-reload'

import '@testing-library/jest-dom'

function SomeComponent() {
  useHotModuleReload(() => console.log('it reloaded'))
  return React.createElement('div', {role: 'test'}, 'hello')
}

test('does not crash when using', async () => {
  render(React.createElement(SomeComponent, {}))
  await screen.findByRole('test')
  expect(screen.getByRole('test')).toHaveTextContent('hello')
})
