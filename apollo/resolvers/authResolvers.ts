import fs from 'fs'
import { v4 as uuid } from 'uuid'
import jwt from 'jsonwebtoken'
import { dataPath, readJSON } from '../utils'
import type {
  IUser, ICreateUser, IStatus, ILoginUser,
} from 'types'

const createToken = (id: string, secret: string): string => jwt.sign({ id }, secret, { expiresIn: '1d' })

const pad = (n: string, width: number, z: string = '0') => {
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}

export const mutations = {
  signup(_parent: undefined, _args: ICreateUser): IStatus<string> {
    const { name, password, manager, position } = _args
    const users = readJSON('users') as { items: IUser[] }
    const { items } = users 
    let workId = 'TW00001'

    if (items.length) {
      const no = parseInt(items[items.length - 1].workId.split('TW')[1]) + 1
      workId = 'TW' + pad(no.toString(), 5)
    }

    items.push({
      id: uuid(),
      workId,
      name,
      password,
      manager,
      position,
    })

    try {
      fs.writeFileSync(`${dataPath}/users.json`, JSON.stringify(users))

      return {
        status: true,
        msg: 'Create user success.',
        data: workId
      }

    } catch (e) {
      return {
        status: false,
        msg: 'Create user failure.'
      }
    }
  },

  login(_parent: undefined, _args: ILoginUser): IStatus<{ token: string, user: IUser }> {
    const { workId, password } = _args
    const { items } = readJSON('users') as { items: IUser[]}
    const currentUser = items.filter((user) => user.workId === workId)[0]

    if (currentUser) {
      if (currentUser.password === password) {

        return {
          status: true,
          msg: 'Login success.',
          data: {
            token: createToken(workId, process.env.SECRET!),
            user: currentUser,
          }
        }
      }
    }

    return {
      status: false,
      msg: 'Login failure.'
    }
  },

  logout(_parent: undefined, _args: { token: string }) {
    return {
      token: ''
    }
  }
}