import { useRouter } from 'next/router'
import { ChangeEvent, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import {
  TextField, Button, Typography, MenuItem,
  Select, styled, FormControl, InputLabel,
  FormGroup,
} from '@material-ui/core'
import * as Actions from 'store/actions'
import UserSelector from 'components/BaseUserSelector'
import BaseAlert from 'components/BaseAlert'
import { getSpecificTask, updateTask } from 'pages/api/graphql'

import type { IState, ITask, IUser } from 'types'

type TProps = {
  currentUser: IUser
  users: IUser[]
  actions: typeof Actions
}

const Form = styled('form')(({ theme }) => ({
  '& .MuiTextField-root': {
    width: '30%',
    margin: theme.spacing(1),
  }
}))

const FormTitlle = styled(Typography)(() => ({
  margin: '0.5rem'
}))

const SelectFormControl = styled(FormControl)(({ theme }) => ({
  margin: theme.spacing(1),
  minWidth: 120,
  width: '30%',
}))

const Task = ({ currentUser, users, actions }: TProps) => {
  const router = useRouter()
  const { id } = router.query as { id: string }

  const [edit, setEdit] = useState(false)
  const [task, setTask] = useState<ITask>({
    id: '',
    title: '',
    viewers: [],
    editors: [],
    status: '',
    content: '',
    createdBy: {
      id: '',
      workId: '',
      name: '',
    }
  })

  useEffect(() => {
    const fetchingTaskData = async () => {
      const resp = await getSpecificTask(id, currentUser.id)
      setTask(resp.specificTask.data)
    }

    fetchingTaskData()
  }, [])

  useEffect(() => {
    if (task.createdBy.id) {
      if (
        task.createdBy.id !== currentUser.id
          || !task.viewers.includes(currentUser.id)
      ) {
        const user = users.filter((user) => user.id === task.createdBy.id)[0]
        if (user.manager !== currentUser.id) router.push('/')
      }
    }
  }, [currentUser.id])

  const canEdit = task.createdBy.id === currentUser.id || task.editors.includes(currentUser.id)

  const disabled = (onlyCreator = false) => {
    return edit && (onlyCreator
      ? task.createdBy.id === currentUser.id
      : task.editors.includes(currentUser.id) || task.createdBy.id === currentUser.id)
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

  const handleFieldChange = (e: ChangeEvent<any>) => {
    const type = e.target.name
    setTask((task) => ({
      ...task,
      [type]: e.target.value
    }))
  }

  const handleUpdate = async () => {
    try {
      const resp = await updateTask({
        id,
        title: task.title,
        viewers: task.viewers,
        editors: task.editors,
        status: task.status,
        content: task.content,
      })

      if (resp.updateTask.status) {
        actions.setAlertOpen(true)
        actions.setAlertStatus({
          type: 'success',
          msg: resp.updateTask.msg
        })
      }
    } catch(e) {
      actions.setAlertOpen(true)
      actions.setAlertStatus({
        type: 'error',
        msg: 'Something wrong'
      })

      console.error(e)
    }
  }

  const ToolButton = (edit
    ? <Button
        onClick={handleUpdate}
        variant="contained"
        color="primary"
        disabled={task.status === 'done'}
      >
        更新
      </Button>
    : <Button
        onClick={() => setEdit(!edit)}
        variant="contained"
        color="primary"
        disabled={task.status === 'done'}
      >
        編輯
      </Button>
  )

  return (
    <>
      <Form>
        {canEdit && ToolButton}
        <FormGroup>
          <FormTitlle variant="h5">{task?.title}</FormTitlle>
        </FormGroup>
        <FormGroup>
          <SelectFormControl variant="outlined">
            <InputLabel id="stauts-label">Status</InputLabel>
            <Select
              labelId="stauts-label"
              label="Status"
              name="status"
              disabled={!disabled()}
              value={task.status}
              onChange={handleFieldChange}
            >
              <MenuItem value="start">開始</MenuItem>
              <MenuItem value="running">實作中</MenuItem>
              <MenuItem value="done">完成</MenuItem>
            </Select>
          </SelectFormControl>
        </FormGroup>
        <FormGroup>
          <UserSelector
            label="Editors"
            value={task.editors}
            disabled={!disabled()}
            changeHandler={handleSelectFieldChange}
          />
        </FormGroup>
        <FormGroup>
          <UserSelector
            label="Viewers"
            value={task.viewers}
            disabled={!disabled()}
            changeHandler={handleSelectFieldChange}
          />
        </FormGroup>
        <FormGroup>
          <TextField 
            label="Context"
            name="context"
            variant="outlined"
            value={task.content}
            multiline
            disabled={!disabled()}
            maxRows={4}
            onChange={handleFieldChange}
          />
        </FormGroup>
      </Form>
      <BaseAlert />
    </>
  )
}

const mapStateToProps = (state: IState) => ({
  currentUser: state.currentUser,
  users: state.users,
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
  actions: bindActionCreators(Actions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Task)
