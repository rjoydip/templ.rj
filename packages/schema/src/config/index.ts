import app from './app'
import build from './build'
import common from './common'
import dev from './dev'

export default {
  ...app,
  ...build,
  ...common,
  ...dev,
}
