import fs from 'fs'
import { v4 as uuid } from 'uuid'
import { AuthenticationError } from 'apollo-server-express'
import { dataPath, readJSON } from '../utils'
import type {
  IBaseStatus, IStatus, ITask, ICreateTask,
  IUser, TContext
} from 'types'

const writeToJSON = (data: string) => {
  fs.writeFileSync(`${dataPath}/tasks.json`, data)
}

type ReturnType = {
  total: number
  tasks: ITask[]
}
export const queries = {
  allTasks(
    _parent: undefined,
    _args: { id: string, page: number, limit: number },
    ctx: TContext
  ): IStatus<ReturnType> {
    if (!ctx.user) throw new AuthenticationError('Not Login')

    const { id, page, limit } = _args
    const tasks = readJSON('tasks') as { items: ITask[] }
    const users = readJSON('users') as { items: IUser[] }

    const tasksByUser = tasks.items.filter((el) => {
      const user = users.items.filter((user) => user.id === el.createdBy.id)[0]

      return el.createdBy.id === id || el.viewers.includes(id) || user?.manager === id
    }) as ITask[]
    
    const returnTask = tasksByUser.slice((page - 1) * limit, page * limit)
  
    return {
      status: true,
      msg: 'Get data success',
      data: {
        total: tasksByUser.length,
        tasks: returnTask,
      }
    }
  },

  specificTask(_parent: undefined, _args: { userId: string, id: string }, ctx: TContext): IStatus<ITask> {
    if (!ctx.user) throw new AuthenticationError('Not Login')

    const tasks = readJSON('tasks') as { items: ITask[] }
    const users = readJSON('users') as { items: IUser[] }
    const task = tasks.items.filter((el) => {
      if (el.id === _args.id) {
        if (el.createdBy.id === _args.userId) return true
        if (el.viewers.includes(_args.userId)) return true
        const user = users.items.filter((user) => user.id === el.createdBy.id)[0]

        if (user) return (user.manager === _args.userId)
      }

      return false
    })[0]

    return {
      status: true,
      msg: 'Get task success',
      data: task as ITask
    }
  }
}

export const mutations = {
  createTask(_parent: undefined, _args: ICreateTask, ctx: TContext): IBaseStatus {
    if (!ctx.user) throw new AuthenticationError('Not Login')

    const tasks = readJSON('tasks') as { items: ITask[] }
    const { items } = tasks as { items: ITask[] }
    const { title, createdBy, viewers, editors, status, content } = _args

    const users = readJSON('users')
    const user = users.items.filter((el: IUser) => el.id === createdBy)[0] as IUser
    items.push({
      id: uuid(),
      title,
      createdBy: {
        id: user.id,
        workId: user.workId,
        name: user.name
      },
      viewers,
      editors,
      status, 
      content,
    })
  
    try {
      writeToJSON(JSON.stringify(tasks))

      return {
        status: true,
        msg: 'Create task success.'
      }
    } catch(e) {
      return {
        status: false,
        msg: 'Create task fail.'
      }
    }
  },

  updateTask(_parent: undefined, _args: ITask, ctx: TContext): IBaseStatus {
    if (!ctx.user) throw new AuthenticationError('Not Login')

    const { id, title, editors, viewers, status, content } = _args

    const tasks = readJSON('tasks') as { items: ITask[] }
    const { items } = tasks as { items: ITask[] }
    const idx = tasks.items.findIndex((el) => el.id === id)
    items[idx] = {
      ...items[idx],
      title,
      editors,
      viewers,
      status,
      content
    }
    try {
      writeToJSON(JSON.stringify(tasks))

      return {
        status: true,
        msg: 'Update task success.'
      }
    } catch(e) {
      return {
        status: false,
        msg: 'Update task fail.'
      }
    }
  },
}
