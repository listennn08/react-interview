import Router from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import {
  Drawer, List, ListItem , ListItemIcon,
  ListItemText, styled
} from '@material-ui/core'
import { AllInbox, HourglassEmpty, Done, List as ListIcon } from '@material-ui/icons'
import * as actions from 'store/actions'

import type { IState } from 'types'

const drawerWidth = 300

const BDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  '&.open .MuiDrawer-paper': {
    transform: 'translateX(0)'
  },
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    transition: 'transform .25s ease-in',
    transform: 'translateX(-300px)',
    marginTop: '4rem',
    maxHeight: 'calc(100% - 4rem)',
  },
  whiteSpace: 'nowrap',
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  [theme.breakpoints.up('sm')]: {
    width: theme.spacing(9) + 1,
  },
}))

const BaseDrawer = () => {
  const { isOpen, filterStatus } = useSelector<IState, IState>((state) => state)
  const dispatch = useDispatch()

  const listItem = [
    {
      text: '所有文件',
      value: '',
      icon: <AllInbox />
    },
    {
      text: '開始',
      value: 'start',
      icon: <ListIcon />
    },
    {
      text: '實作中',
      value: 'running',
      icon: <HourglassEmpty />
    },
    {
      text: '完成',
      value: 'done',
      icon: <Done />
    }
  ]

  const listItemClickHandler = (value: string) => {
    Router.push('/')
    dispatch(actions.setFilterStatus(value))
  }

  return (
    <BDrawer
      variant="permanent"
      className={isOpen ? 'open' : ''}
    >
      <List>
        {listItem.map(({ text, icon, value }) => (
          <ListItem 
            button
            key={text}
            onClick={() => listItemClickHandler(value)}
            selected={filterStatus === value}
          >
            <ListItemIcon>{icon}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </BDrawer>
  )
}

export default BaseDrawer
