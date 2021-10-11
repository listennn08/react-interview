import { ChangeEvent, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Modal, Fade, Backdrop, TextField,
  FormGroup, Button, styled,
} from '@material-ui/core'
import * as actions from 'store/actions'
import UserSelector from 'components/BaseUserSelector'
import { createTask, getAllTasks } from 'pages/api/graphql'

import type { ICreateTask, IState } from 'types'

const BModal = styled(Modal)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& .paper': {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}))

const BFormGroup = styled(FormGroup)(() => ({
  marginBottom: '1rem'
}))

const NewTask = () => {
  const { currentUser, currentPage, isModalOpen } = useSelector<IState, IState>((state) => state)
  const dispatch = useDispatch()

  const [task, setTask] = useState<ICreateTask>({
    title: '',
    viewers: [],
    editors: [],
    status: 'start',
    content: '',
    createdBy: ''
  })

  useEffect(() => {
    setTask((task) => ({
      ...task,
      createdBy: currentUser.id,
    }))
  }, [currentUser.id])

  const handleFieldChange = (e: ChangeEvent<{ name: string, value: string }>) => {
    const type = e.target.name
    setTask((task) => ({
      ...task,
      [type]: e.target.value
    }))
  }

  const handleSelectFieldChange = (event: ChangeEvent<any>) => {
    const name = event.target.name
    if (!name) return

    event.persist()
    setTask((task) => ({
      ...task,
      [name.toLowerCase()]:
        event.target.type === "checkbox"
          ? event.target.checked
          : event.target.value
    }))
  }

  const cantSubmit = task.title === ''

  const handleSubmit = async () => {
    try {
      const resp = await createTask({ ...task })
      if (resp.createTask.status) {
        const taskResp = (await getAllTasks(currentUser.id, currentPage)).allTasks
        dispatch(actions.setTasks(taskResp.data))
        dispatch(actions.setAlertOpen(true))
        dispatch(actions.setAlertStatus({
          type: 'success',
          msg: resp.createTask.msg
        }))

        handleClose()
      }
    } catch (e) {
      dispatch(actions.setAlertOpen(true))
        dispatch(actions.setAlertStatus({
          type: 'error',
          msg: 'Something wrong.'
        }))
    }
  }

  const handleClose = () => dispatch(actions.setModalOpen(false))

  return (
    <BModal
      aria-labelledby="spring-modal-title"
      aria-describedby="spring-modal-description"
      open={isModalOpen}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isModalOpen}>
        <form className="paper">
          <h2 id="spring-modal-title">New Task</h2>
          <BFormGroup>
            <TextField
              label="Title"
              variant="outlined"
              name="title"
              required
              error={task.title === ''}
              onChange={handleFieldChange}
            />
          </BFormGroup>
          <BFormGroup>
            <UserSelector
              label="Viewers"
              value={task.viewers}
              changeHandler={handleSelectFieldChange}
            />
          </BFormGroup>
          <BFormGroup>
            <UserSelector
              label="Editors"
              value={task.editors}
              changeHandler={handleSelectFieldChange}
            />
          </BFormGroup>
          <BFormGroup>
            <TextField
              label="Context"
              variant="outlined"
              multiline
              maxRows={4}
              name="context"
              onChange={handleFieldChange}
            />
          </BFormGroup>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={cantSubmit}
          >
            Submit
          </Button>
        </form>
      </Fade>
    </BModal>
  )
}

export default NewTask
