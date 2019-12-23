import { Button, Header, Icon, Segment } from 'semantic-ui-react'
import React, { useCallback } from 'react'

import Helmet from 'react-helmet'
import { useHistory } from 'react-router-dom'

export default function PageNotFound () {
  const history = useHistory()
  const handleGoBack = useCallback(history.goBack, [history])
  return (
    <Segment className='page-not-found' color='red'>
      <Helmet title='404' />
      <Header as='h2'><Icon name='dont' color='red' />Page Not Found</Header>
      <Button onClick={handleGoBack} basic>Go Back</Button>
    </Segment>
  )
}
