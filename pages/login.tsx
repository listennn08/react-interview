import { useState, useEffect, ChangeEvent} from 'react'
import Router from 'next/router'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { 
  Container, Card, CardContent, Typography,
  CardActions, Button, TextField, Box, styled
} from '@material-ui/core'
import * as Actions from 'store/actions'
import { login } from 'pages/api/graphql'

import type { IStatus, IUser } from 'types'


const LoginContainer = styled(Container)(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
}))

const BTextField = styled(TextField)(() => ({
  width: '100%',
}))

const BCardActions = styled(CardActions)(() => ({
  display: 'flex',
  justifyContent: 'center',
}))

const Login = ({ actions }: { actions: typeof Actions }) => {
  const [workId, setWorkId] = useState('')
  const [pwd, setPwd] = useState('')
  const [loginStatus, setLoginStatus] = useState(false)

  useEffect(() => {
    if (loginStatus) Router.push('/')
  }, [loginStatus])

  const changeEventHandler = (type: string) => {
    return (e: ChangeEvent) => {
      const target = e.target as HTMLInputElement
      switch (type) {
        case 'workId':
          return setWorkId(target.value)
        case 'pwd':
          return setPwd(target.value)
      }
    }
  }

  const loginHandler = async () => {
    try {
      const resp = (
        await login(workId, pwd)
      ).data.data.login as IStatus<{ token: string, user: IUser }>

      if (resp.status) {
        localStorage.setItem('token', resp.data!.token)
        setLoginStatus(true)
        actions.setIsLogin(true)
        actions.setUser(resp.data!.user)
      } else {
        console.log('login fail')
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Container>
      <LoginContainer>
        <Card>
          <CardContent>
            <Typography variant="h4" component="div">
              Login
            </Typography>
            <Box component="form">
              <BTextField
                label="WorkId"
                variant="standard"
                onChange={changeEventHandler('workId')}
              />
              <BTextField
                label="Password"
                variant="standard"
                type="password"
                onChange={changeEventHandler('pwd')}
              />
            </Box>
          </CardContent>
          <BCardActions>
            <Button
              color="primary"
              variant="contained"
              onClick={loginHandler}
            >
              Login
            </Button>
            <Button color="primary" variant="outlined">Signup</Button>
          </BCardActions>
        </Card>
      </LoginContainer>
    </Container>
  )
}

const mapDispatchToProps =  (dispatch: Dispatch) => ({
  actions: bindActionCreators(Actions, dispatch)
})

export default connect(null, mapDispatchToProps)(Login)