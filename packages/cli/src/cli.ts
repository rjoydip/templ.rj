import sade from 'sade'
import { serializeError } from 'serialize-error'
import { generateReport } from '@grft/core'
import pkg from '../package.json'

const prog = sade(pkg.cliname)

prog.version(pkg.version)

prog
  .command('generate')
  .describe('Generate reports')
  .option('-d, --data-dir', 'Data directory')
  .option('-o, --output-dir', 'Output directory')
  .option('-t, --template-dir', 'Template directory')
  .example('generate -o output')
  .example('generate -template-dir template')
  .example('generate -d data -t template')
  .example('generate -data-dir data -output-dir output')
  .action(async (opts) => {
    try {
      if (!opts.d && !opts.o && !opts.t) throw new Error('No options specified')

      const output = await generateReport({
        output_dir: opts.o || '',
        template_dir: opts.t || '',
        data_dir: opts.d || '',
      })
      console.log(output)
    } catch (err) {
      const error = new Error(String(err))
      const serialized = serializeError(error)
      console.error(serialized.message)
    }
  })

prog.parse(process.argv)
