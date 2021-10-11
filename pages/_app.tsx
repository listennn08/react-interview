import { AppProps } from 'next/app'
import Router from 'next/router'
import { ReactNode, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { withRedux } from 'store'
import { CssBaseline }  from '@material-ui/core'

import Layout from 'components/Layout'

import type { IState } from 'types'

const SafeHydrate = ({ children }: { children: ReactNode }) => (
  <div suppressHydrationWarning>
    {typeof window === 'undefined' ? null : children}
  </div>
)

const _app = ({ Component, pageProps }: AppProps) => {
  const isLogin = useSelector<IState, boolean>((state) => state.isLogin)

  useEffect(() => {
    if (!isLogin) Router.push("/login")
  }, [isLogin])

  return (
    <SafeHydrate>
      <CssBaseline />
      {isLogin 
        ? <Layout>
            <Component {...pageProps} />
          </Layout>
        : <Component {...pageProps} />
      }
    </SafeHydrate>
  )
}

export default withRedux(_app)
