import { Header, Icon, Segment } from 'semantic-ui-react'

import React from 'react'

export default function PageNotFound () {
  return (
    <Segment className='page-not-found' color='red'>
      <Header as='h2'><Icon name='dont' color='red' />Page Not Found</Header>
    </Segment>
  )
}
