import { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Snackbar } from '@material-ui/core'
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert'
import * as actions from 'store/actions'

import type { IState } from 'types'

const Alert = (props: AlertProps) => <MuiAlert elevation={6} variant="filled" {...props} />

const BaseAlert = () => {
  const { isAlertOpen, alertStatus } = useSelector<IState, IState>((state) => state)
  const dispatch = useDispatch()

  const onClose = useMemo(() => () => {
    dispatch(actions.setAlertOpen(false))
  }, [])
  useEffect(() => {
    setTimeout(() => {
      onClose()
    }, 2000)
  }, [onClose])

  return (
    <Snackbar open={isAlertOpen} autoHideDuration={6000} onClose={onClose}>
      <Alert onClose={onClose} severity={alertStatus?.type}>
        {alertStatus?.msg}
      </Alert>
    </Snackbar>
  )
}

export default BaseAlert