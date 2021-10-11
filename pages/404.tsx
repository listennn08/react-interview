import Router from 'next/router'
import { useEffect } from 'react'

const _error = () => {
  useEffect(() => {
    Router.push('/login')
  })

  return <div />
}

export default  _error
