import { Header } from 'semantic-ui-react'
import React from 'react'

export default function PageHeading ({ page, description }) {
  return (
    <Header as='h1' className='page-heading' title={description}>
      {page.name}
    </Header>
  )
}
