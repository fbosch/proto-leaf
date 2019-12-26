import { Button, Header, Image, Segment, Table } from 'semantic-ui-react'

import React from 'react'

export default function ShoppingCart ({ description, image, price }) {
  return (
    <Segment padded title={description}>
      <Header as='h2'>Shopping Cart</Header>
      <Table basic='very'>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Product</Table.HeaderCell>
            <Table.HeaderCell width={8}>Product Name</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
            <Table.HeaderCell width={5}>Price</Table.HeaderCell>
            <Table.HeaderCell>Remove</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell><Image src={image} /></Table.Cell>
            <Table.Cell>Product</Table.Cell>
            <Table.Cell>10</Table.Cell>
            <Table.Cell>{price}</Table.Cell>
            <Table.Cell><Button>X</Button></Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell><Image src={image} /></Table.Cell>
            <Table.Cell>Product</Table.Cell>
            <Table.Cell>10</Table.Cell>
            <Table.Cell>{price}</Table.Cell>
            <Table.Cell><Button>X</Button></Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell><Image src={image} /></Table.Cell>
            <Table.Cell>Product</Table.Cell>
            <Table.Cell>10</Table.Cell>
            <Table.Cell>{price}</Table.Cell>
            <Table.Cell><Button>X</Button></Table.Cell>
          </Table.Row>
        </Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell>Total</Table.HeaderCell>
            <Table.HeaderCell width={8}></Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>{price}</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </Segment>
  )
}
