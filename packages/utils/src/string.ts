import wrapAnsi from 'wrap-ansi'

export function getWrappedStr(msg: string, column: number = 100) {
  return wrapAnsi(msg, column)
}
