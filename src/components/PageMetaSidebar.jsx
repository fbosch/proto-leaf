import { Button, Icon, Segment, Sidebar, Table } from 'semantic-ui-react'
import React, { useState } from 'react'

export default function PageMetaSidebar ({ page }) {
  const [visible, setVisible] = useState(false)
  const metaData = page?.metaData?.split(/\n/).filter(Boolean).map(meta => {
    const [key, value] = meta.split(/:(.*)/)
    return { [key]: value.trim() }
  })
  return (
    <>
      {visible === false && <Button circular icon floated='right' className='meta-toggler' onClick={() => setVisible(true)}><Icon name='info' /></Button>}
      <Sidebar as={Segment} visible={visible} onHide={() => setVisible(false)} width='very wide' direction='right'>
        <Segment clearing basic>
          <Button circular icon floated='right' onClick={() => setVisible(false)}><Icon name='close' /></Button>
          <Table definition style={{ marginTop: '50px' }}>
            <Table.Body>
              {metaData?.map(row => {
                const keys = Object.keys(row)
                return keys.map(key => {
                  return (
                    <Table.Row key={key}>
                      <Table.Cell>{key}</Table.Cell>
                      <Table.Cell>{row[key]}</Table.Cell>
                    </Table.Row>
                  )
                })
              })}
            </Table.Body>
          </Table>
        </Segment>
      </Sidebar>
    </>
  )
}
