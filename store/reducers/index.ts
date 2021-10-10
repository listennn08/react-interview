import { AnyAction } from 'redux'
import {
  SET_ISLOGIN,
  SET_ISOPEN,
  SET_MODAL_OPEN,
  SET_USER,
  SET_TASKS,
  SET_USERS,
  SET_FILETER_STATUS,
  SET_SELECT_USER,
  SET_ALERT_OPEN,
  SET_ALERT_STATUS,
  SET_CURRENT_PAGE,
} from '../constants'

import type { IState } from 'types'

const defaultState: IState = {
  isLogin: true,
  isOpen: false,
  isModalOpen: false,
  isAlertOpen: false,
  users: [],
  selectUsers: [],
  currentUser: {
    id: '',
    name: '',
    workId: '',
    position: '',
  },
  tasks: [],
  filterStatus: '',
  alertStatus: {
    type: 'info',
    msg: '',
  },
  currentPage: 1,
}

const reducer = (state: IState = defaultState, action: AnyAction) => {
  switch(action.type) {
    case SET_ISLOGIN:
      return {
        ...state,
        isLogin: action.isLogin,
      }
    case SET_ISOPEN:
      return {
        ...state,
        isOpen: action.isOpen,
      }
    case SET_MODAL_OPEN:
      return {
        ...state,
        isModalOpen: action.isOpen
      }
    case SET_ALERT_OPEN:
      return {
        ...state,
        isAlertOpen: action.isOpen
      }
    case SET_ALERT_STATUS:
      return {
        ...state,
        alertStatus: {
          type: action.payload.type,
          msg: action.payload.msg,
        }
      }
    case SET_USER:
      return {
        ...state,
        currentUser: {
          ...action.user,
        }
      }
    case SET_SELECT_USER:
      return {
        ...state,
        selectUsers: action.users,
      }
    case SET_USERS:
      return {
        ...state,
        users: action.users,
      }
    case SET_TASKS:
      return {
        ...state,
        tasks: action.tasks,
      }
    case SET_FILETER_STATUS:
      return {
        ...state,
        filterStatus: action.status,
      }
    case SET_CURRENT_PAGE:
      return {
        ...state,
        currentPage: action.page,
      }
    default:
      return state
  }
}

export default reducer