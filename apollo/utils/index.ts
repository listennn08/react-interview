import path from 'path'
import fs from 'fs'

export const dataPath = path.resolve(process.cwd(), './apollo/data/')
export const readJSON = (name: string) => JSON.parse(fs.readFileSync(`${dataPath}/${name}.json`).toString())
