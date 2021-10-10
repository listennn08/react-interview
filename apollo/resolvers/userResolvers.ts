import { readJSON } from '../utils'
import { IStatus, IUser } from 'types'

export const queries = {
  allUsers(): IStatus<IUser[]> {
    return {
      status: true,
      msg: 'success.',
      data: readJSON('users').items as IUser[]
    }
  },
  allInfluencer(): IStatus<IUser[]> {
    return {
      status: true,
      msg: 'success.',
      data: readJSON('users').items.filter((el: IUser) => el.position === 'influencer') as IUser[]
    }
  },
}