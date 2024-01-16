import { Bench } from 'tinybench'
import { consola } from 'consola'
import { table } from 'table'
import { getRootDirAsync, getRootDirSync } from '@templ/utils'

const bench = new Bench({ time: 1000 })

bench
  .add('Path Get Root Dir Async', async () => {
    await getRootDirAsync()
  })
  .add('Path Get Root Dir Sync', () => {
    getRootDirSync()
  })

await bench.warmup()
await bench.run()

consola.box(
  table([['Task Name', 'ops/sec', 'Average Time (ns)', 'Margin', 'Samples'], ...bench.table().map(i => [i?.['Task Name'], i?.['ops/sec'], i?.['Average Time (ns)'], i?.Margin, i?.Samples])]),
)
