const {count} = require('./count')

const counterStyle = {
  position: 'absolute',
  bottom: '10px',
  right: '10px',
  fontSize: '20px',
}

function Counter() {
  return <div style={counterStyle}>{count}</div>
}

module.exports = {Counter}
