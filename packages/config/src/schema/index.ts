import app from './app'
import root from './root'
import server from './server'

export const TemplConfigSchema = {
  ...app,
  ...root,
  ...server,
}
