import React, { useContext } from 'react'

import PageContext from '../contexts/PageContext'

export default function GlobalMenu (props) {
  const pages = useContext(PageContext)
  console.log(props, pages)
  return (
    <div>global menu: {JSON.stringify(props)}</div>
  )
}
