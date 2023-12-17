import fg from 'fast-glob'
import { COMPLETED, STARTED } from './constant'

async function main() {
  const cleanNMTxt = 'Clean node_modules directories and re-install packages'
  try {
    console.log(`[${STARTED}]: ${cleanNMTxt}`)
    const findings = fg.globSync('**/node_modules', {
      absolute: false,
    })
    console.log(findings)
    console.log(`[${COMPLETED}]: ${cleanNMTxt}`)
  }
  catch (error) {
    console.error(error)
  }
}

main()
