import { Container, Icon, List, Segment } from 'semantic-ui-react'

import React from 'react'

export default function Footer () {
  return (
    <footer className='footer' key='footer'>
      <Container>
        <Segment.Group horizontal>
          <Segment>
            <List>
              <List.Item>Company name</List.Item>
              <List.Item>Street Name, No.</List.Item>
              <List.Item>Postal code City</List.Item>
              <List.Item>Country</List.Item>
              <List.Item>Company phone number</List.Item>
            </List>
          </Segment>
          <span style={{ flex: 1 }} />
          <Segment className='row'>
            <div className='col'>
              <List>
                <List.Item><Icon name='book' disabled /> Company blog</List.Item>
                <List.Item><Icon name='facebook' disabled /> Facebook</List.Item>
                <List.Item><Icon name='linkedin' disabled /> LinkedIn</List.Item>
                <List.Item><Icon name='youtube' disabled /> YouTube</List.Item>
              </List>
            </div>
            <div className='col'>
              <List>
                <List.Item>Privacy Policy</List.Item>
                <List.Item>Cookie Statments</List.Item>
                <List.Item>Disclaimers</List.Item>
                <List.Item>About Company</List.Item>
              </List>
            </div>
          </Segment>
        </Segment.Group>
      </Container>
    </footer>
  )
}
