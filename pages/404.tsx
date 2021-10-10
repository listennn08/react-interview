import Router from 'next/router'
import { useEffect } from 'react'

export default function _error() {
  useEffect(() => {
    Router.push('/login')
  })

  return <div />
}
