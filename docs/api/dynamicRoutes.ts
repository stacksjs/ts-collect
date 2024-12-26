import fs from 'node:fs'
import path from 'node:path'

interface RouteParams {
  path: string
  file: string
}

const apiDir: string = path.resolve(__dirname, './')
const routes: RouteParams[] = []

fs.readdirSync(apiDir).forEach((file: string) => {
  const filePath: string = path.join(apiDir, file)
  const stat: fs.Stats = fs.statSync(filePath)

  if (stat.isFile() && file.endsWith('.md')) {
    const slug: string = file.replace(/\.md$/, '')
    routes.push({
      path: `${slug}`,
      file: `${file}`,
    })
  }
})

export default routes
