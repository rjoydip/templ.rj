import { useState } from 'preact/hooks'

export const Counter = (): JSX.Element => {
  const [value, setValue] = useState(0)

  return (
    <>
      <div>Counter: {value}</div>
      <button onClick={() => setValue(value + 1)}>Increment</button>
      <button onClick={() => setValue(value - 1)}>Decrement</button>
    </>
  )
}
