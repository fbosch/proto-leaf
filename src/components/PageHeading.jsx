import { Header } from 'semantic-ui-react'
import React from 'react'

export default function PageHeading (props) {
  return <Header className='page-heading' as='h1'>{props.page.name}</Header>
}
