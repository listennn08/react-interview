import { ThemeProvider, Container } from '@material-ui/core'
import { styled } from '@material-ui/styles'
import theme from 'assets/theme'
import Heading from './layout/Heading'
import BaseDrawer from './layout/Drawer'

type TProps = {
  children: any
}

const MainLayer = styled('div')(() => ({
  marginTop: '4.5rem',
  minHeight: 'calc(100vh - 4.5rem)'
}))

export default function Layout({ children }: TProps) {
  return (
    <ThemeProvider theme={theme}>
      <Heading />
      <BaseDrawer />
      <Container>
        <MainLayer>
          {children}
        </MainLayer>
      </Container>
    </ThemeProvider>
  )
}