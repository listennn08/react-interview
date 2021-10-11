import Router from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { grey } from '@material-ui/core/colors'
import {
  Grid, Card, CardContent, Typography,
  Chip, Button, styled,
} from '@material-ui/core'

import type { IState, ITask } from 'types'

const BCardContent = styled(CardContent)(() => ({
  display: 'flex',
  alignItems: 'center'
}))

const BChip = styled(Chip)(() => ({
  borderRadius: '0.25rem',
  marginRight: '0.75rem',
  '& .MuiChip-label': {
    padding: '0.5rem',
  },
}))

const BButton = styled(Button)(() => ({
  marginLeft: '1.5rem'
}))

const Creator = styled('span')(() => ({
  color: grey[600],
  marginLeft: 'auto',
}))

const chipColor = (status: string) => {
  if (status === 'done') {
    return 'secondary'
  } else if (status === 'running') {
    return 'primary'
  } 

  return 'default'
}

const chipText: { [key: string]: string } = {
  start: '開始',
  running: '實作中',
  done: '完成',
}

const BaseList = () => {
  const { tasks, filterStatus } = useSelector<IState, IState>((state) => state)
  const [displayTasks, setDisplayTasks] = useState<ITask[]>([])

  useEffect(() => {
    console.log(tasks)
    console.log(displayTasks)
    if (filterStatus) {
      setDisplayTasks(tasks.filter((task) => task.status === filterStatus))
    } else {
      setDisplayTasks(tasks)
    }
  }, [tasks, filterStatus])

  return (
    <>
      {displayTasks.map((task) => (
        <Grid item xs={4} key={task.id}>
          <Card>
            <BCardContent>
              <BChip label={chipText[task?.status]} color={chipColor(task?.status)} size="small" />
              <Typography variant="h5">
                {task?.title}
              </Typography>
              <Creator>
                建立者: {task?.createdBy.name}
              </Creator>
              <BButton
                variant="outlined"
                onClick={() => Router.push({
                  pathname: '/task/[id]',
                  query: {
                    id: task?.id
                  }
                })}
              >
                查看任務
              </BButton>
            </BCardContent>
          </Card>
        </Grid>
      ))}
    </>
  )
}

export default BaseList
