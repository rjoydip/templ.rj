import { render } from 'preact'
import { Counter } from './components/Counter'

export const App = (): JSX.Element => {
  return (
    <>
      <Counter />
    </>
  )
}

render(<App />, document.getElementById('app') as HTMLElement)
