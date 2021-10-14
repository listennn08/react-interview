import Router from 'next/router'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { grey } from '@material-ui/core/colors'
import {
  Grid, Card, CardContent, Typography,
  Chip, Button, styled,
} from '@material-ui/core'

import type { IState, ITask } from 'types'

const BCardContent = styled(CardContent)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    alignItems: 'start',
    flexDirection: 'column',
  },
}))

const Title = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    alignItems: 'start',
    flexDirection: 'column',
  },
}))

const BChip = styled(Chip)(() => ({
  borderRadius: '0.25rem',
  marginRight: '0.75rem',
  '& .MuiChip-label': {
    padding: '0.5rem',
  },
}))

const BButton = styled(Button)(({ theme }) => ({
  marginLeft: '1.5rem',
  [theme.breakpoints.down('md')]: {
    marginLeft: '0',
  },
}))

const Creator = styled('span')(({ theme }) => ({
  color: grey[600],
  marginLeft: 'auto',
  [theme.breakpoints.down('md')]: {
    marginLeft: '0',
  },
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
    if (filterStatus) {
      setDisplayTasks(tasks.filter((task) => task.status === filterStatus))
    } else {
      setDisplayTasks(tasks)
    }
  }, [tasks, filterStatus])

  return (
    <>
      {displayTasks.map((task) => (
        <Grid item xs={12} sm={3} lg={4} key={task.id}>
          <Card>
            <BCardContent>
              <Title>
                <BChip
                  label={chipText[task?.status]}
                  color={chipColor(task?.status)}
                  size="small"
                />
                <Typography variant="h5">
                  {task?.title}
                </Typography>
              </Title>
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
