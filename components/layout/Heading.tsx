import React, { MouseEvent, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  AppBar, Toolbar, Typography, Button,
  Menu, MenuItem, IconButton, styled,
} from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import AccountCircle from '@material-ui/icons/AccountCircle'
import * as actions from 'store/actions'
import { login } from 'pages/api/graphql'

import type { IState, IUser } from 'types'

const BAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}))

const Title = styled(Typography)(() => ({
  flexGrow: 1
}))

const Heading = () => {
  const { currentUser, users, isOpen } = useSelector<IState, IState>((state) => state)
  const dispatch = useDispatch()

  const [anchorEl, setAnchorEl] = useState<HTMLElement|null>(null)
  const open = Boolean(anchorEl)

  const handleMenu = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget)

  const handleClose = async (value: string) => {
    if (!value) return
    const resp = (await login(value, '123'))
    if (!resp) return
    const loginData  = resp.login as { data: { token: string, user: IUser }}
    localStorage.setItem('token', loginData.data!.token)
    dispatch(actions.setIsLogin(true))
    dispatch(actions.setUser(loginData.data!.user))
    setAnchorEl(null)
  }

  const handleDrawerOpen = () => {
    dispatch(actions.setIsOpen(!isOpen))
  }

  return (
    <BAppBar position="fixed">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
        >
          <MenuIcon />
        </IconButton>
        <Title variant="h6">文件管理</Title>
        <Button
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
          startIcon={<AccountCircle />}
        >
          {currentUser.name}
        </Button>
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          open={open}
          onClose={handleClose}
        >
          {users.map((user) =>
            <MenuItem onClick={() => handleClose(user.workId)} key={user.id}>{user.name}</MenuItem>
          )}
        </Menu>
      </Toolbar>
    </BAppBar>
  )
}

export default Heading
