import { Color } from '@material-ui/lab'

export interface ICreateTask {
  title: string
  createdBy: string
  viewers: string[]
  editors: string[]
  status: string
  content: string
}

export interface IUpdateTask {
  id: string
  title: string
  viewers: string[]
  editors: string[]
  status: string
  content: string
}

export interface ITask extends ICreateTask {
  id: string
  createdBy: {
    id: string
    workId: string
    name: string
  }
}

export interface ILoginUser {
  workId: string
  password: string
}

export interface ICreateUser extends ILoginUser {
  name: string
  workId: string
  manager?: string
  position: string
}

export interface IUser extends ICreateUser {
  id: string
  password?: string
  token?: string
}

export interface IBaseStatus {
  status: boolean
  msg: string 
}

export interface IStatus<T> extends IBaseStatus {
  data?: T
}

export interface IState {
  tasks: ITask[]
  isLogin: boolean
  isOpen: boolean
  isModalOpen: boolean
  isAlertOpen: boolean
  users: IUser[]
  selectUsers: IUser[]
  currentUser: IUser
  filterStatus: string
  alertStatus: {
    type: Color
    msg: string
  }
  currentPage: number
  total: number
  totalPage: number
}

export type TContext = {
  user: {
    id: string
    iat: number
    exp: number
  }
}