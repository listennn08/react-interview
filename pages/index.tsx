import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { bindActionCreators, Dispatch } from 'redux'
import { connect, useSelector } from 'react-redux'
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

import type { IState } from 'types'

type TProps = {
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

const Index = ({ actions }: TProps) => {
  const { currentUser, currentPage } = useSelector<IState, IState>((state) => state)

  const [total, setTotal] = useState(0)
  const [totalPage, setTotalPage] = useState(0)
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
    actions.serCurrentPage(page)
  }
  useEffect(() => {
    fetchingData()
  }, [fetchingData])

  useEffect(() => {
    const fetchTasks = async () => {
      const taskResp = (await getAllTasks(currentUser.id, currentPage)).allTasks
      actions.setTasks(taskResp.data.tasks)
      if (taskResp.data.total === total) return

      setTotal(taskResp.data.total)
      setTotalPage(Math.ceil(taskResp.data.total / 10))
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



const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: bindActionCreators(Actions, dispatch)
})

export default connect(null, mapDispatchToProps)(Index)
