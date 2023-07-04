import { readPackageUp } from 'read-pkg-up'

export default async () => {
  const pkg = await readPackageUp()
  return {
    name: pkg?.packageJson.cliname || '',
    version: pkg?.packageJson.version || '0.0.0',
    path: pkg?.path || '',
  }
}
