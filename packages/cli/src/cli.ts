import prompts from 'prompts';

(async () => {
  const response = await prompts([{
    type: 'text',
    name: 'data_directory',
    message: 'What is your data directory?',
  }, {
    type: 'text',
    name: 'tmpl_directory',
    message: 'What is your templates directory?',
  }, {
    type: 'text',
    name: 'output_directory',
    message: 'What will be your output directory?',
  }])

  console.log(response)
})()
