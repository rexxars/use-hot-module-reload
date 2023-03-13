const React = require('react')
const {render, screen} = require('@testing-library/react')
const {useHotModuleReload} = require('use-hot-module-reload')

require('@testing-library/jest-dom')

function SomeComponent() {
  useHotModuleReload(() => console.log('it reloaded'))
  return React.createElement('div', {role: 'test'}, 'hello')
}

test('does not crash when using', async () => {
  render(React.createElement(SomeComponent, {}))
  await screen.findByRole('test')
  expect(screen.getByRole('test')).toHaveTextContent('hello')
})
