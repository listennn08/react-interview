import { ChangeEvent, useEffect, useMemo } from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect } from 'react-redux'
import { Grid, Fab, styled } from '@material-ui/core'
import { Pagination } from '@material-ui/lab'
import { Add } from '@material-ui/icons'
import * as Actions from 'store/actions'
import BaseList from 'components/BaseList'
import BaseAlert from 'components/BaseAlert'
import NewTask from 'components/modal/NewTask'
import {
  login, getAllTasks, getAllUsers, getAllSelectUser
} from 'pages/api/graphql'

import type { IState, IUser } from 'types'

type TProps = {
  currentUser: IUser
  currentPage: number
  total: number
  totalPage: number
  actions: typeof Actions
}

const BGrid = styled(Grid)(() => ({
  paddingTop: '0.5rem'
}))

const FixedRightBottomFab = styled(Fab)(() => ({
  position: 'fixed',
  right: '2.5rem',
  bottom: '2.5rem',
}))

const BottomGrid = styled(Grid)(() => ({
  position: 'fixed',
  left: '50%',
  bottom: '2.5rem',
  transform: 'translateX(-50%)'
}))

const Index = ({ currentUser, currentPage, total, totalPage, actions }: TProps) => {
  
  const fetchData = async () => {
    const allUsersResp = (await getAllUsers()).allUsers
    actions.setUsers(allUsersResp.data)

    const allSelectUserResp = (await getAllSelectUser()).allInfluencer
    actions.setSelectUser(allSelectUserResp.data)

    if (!currentUser.id) {
      const resp = (await login('TW00001', '123')).login
      localStorage.setItem('token', resp.data!.token)
      actions.setIsLogin(true)
      actions.setUser(resp.data!.user)
    }
  }

  const fetchingData = useMemo(() => fetchData, [])

  const handlePageClick = (_: ChangeEvent<any>, page: number) => {
    actions.setCurrentPage(page)
  }
  useEffect(() => {
    fetchingData()
  }, [fetchingData])

  useEffect(() => {
    const fetchTasks = async () => {
      const taskResp = (await getAllTasks(currentUser.id, currentPage)).allTasks
      actions.setTasks(taskResp.data.tasks)
      if (taskResp.data.total === total) return

      actions.setTotal(taskResp.data.total)
      actions.setTotalPage(Math.ceil(taskResp.data.total / 10))
    }

    if (currentUser.id) fetchTasks()
  }, [currentUser.id,  currentPage])

  const isStaff = currentUser.position === 'staff'

  return (
    <BGrid container spacing={3}>
      <BaseList />
      <BottomGrid item xs={12}>
        <Pagination 
          count={totalPage}
          variant="outlined"
          shape="rounded"
          onChange={handlePageClick}
        />
      </BottomGrid>
      {isStaff &&
        <FixedRightBottomFab
          color="primary"
          aria-label="add"
          onClick={() => actions.setModalOpen(true)}
        >
          <Add />
        </FixedRightBottomFab>
      }
      <NewTask />
      <BaseAlert />
    </BGrid>
  )
}

const mapStateToProps = (state: IState) => ({
  currentUser: state.currentUser,
  currentPage: state.currentPage,
  total: state.total,
  totalPage: state.totalPage,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: bindActionCreators(Actions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index)
