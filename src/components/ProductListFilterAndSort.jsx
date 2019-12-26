import { Dropdown, Header, Pagination, Segment } from 'semantic-ui-react'

import React from 'react'

const categoryOptions = [
  { key: 1, text: 'Subcategory 1', value: 'subcategory1' },
  { key: 2, text: 'Subcategory 2', value: 'subcategory2' },
  { key: 3, text: 'Subcategory 3', value: 'subcategory3' }
]

const sortOptions = [
  { key: 1, text: 'Newest', value: 'newest' },
  { key: 2, text: 'On Sale', value: 'onsale' },
  { key: 3, text: 'Price low to high', value: 'pricelow' },
  { key: 4, text: 'Price high to low', value: 'pricehigh' },
  { key: 5, text: 'Best sellers', value: 'best' }
]

const filterOptions = [
  { key: 1, text: 'Part of contract', value: 'contract' },
  { key: 2, text: 'Complementary', value: 'complementary' }
]

export default function ProductListFilterAndSort ({ description }) {
  return (
    <Segment.Group horizontal className='product-list-filter' title={description}>
      <Segment><Header as='h3' textAlign='center'>600 Products</Header></Segment>
      <Segment><Dropdown placeholder='Category' search selection clearable options={categoryOptions} /></Segment>
      <Segment><Dropdown placeholder='Sort by' search selection clearable options={sortOptions} /></Segment>
      <Segment><Dropdown placeholder='Filter by' search selection clearable options={filterOptions} /></Segment>
      <Segment>
        <Pagination
          boundaryRange={0}
          defaultActivePage={1}
          ellipsisItem={null}
          firstItem={null}
          lastItem={null}
          siblingRange={1}
          totalPages={10}
        />
      </Segment>
    </Segment.Group>
  )
}
