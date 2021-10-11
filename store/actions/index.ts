import * as types from '../constants'

import type { Color } from '@material-ui/lab/Alert'
import type { ITask, IUser } from 'types'

export const setIsLogin = (isLogin: boolean) => ({ type: types.SET_ISLOGIN, isLogin })
export const setIsOpen = (isOpen: boolean) => ({ type: types.SET_ISOPEN, isOpen })
export const setModalOpen = (isOpen: boolean) => ({ type: types.SET_MODAL_OPEN, isOpen })
export const setAlertOpen = (isOpen: boolean) => ({ type: types.SET_ALERT_OPEN, isOpen })
export const setAlertStatus = (payload: { type: Color, msg: string }) => ({ type: types.SET_ALERT_STATUS, payload })
export const setUser = (user: IUser) => ({ type: types.SET_USER, user })
export const setUsers = (users: IUser[]) => ({ type: types.SET_USERS, users })
export const setSelectUser = (users: IUser[]) => ({ type: types.SET_SELECT_USER, users })
export const setTasks = (tasks: ITask[]) => ({ type: types.SET_TASKS, tasks })
export const setFilterStatus = (status: string) => ({ type: types.SET_FILETER_STATUS, status })
export const setCurrentPage = (page: number) => ({ type: types.SET_CURRENT_PAGE, page })
export const setTotal = (total: number) => ({ type: types.SET_TOTAL, total })
export const setTotalPage = (total: number) => ({ type: types.SET_TOTAL_PAGE, total })

