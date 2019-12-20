import React, { Suspense } from 'react'

import { useComponent } from '../hooks'

export default function Page (props) {
  const getComponent = useComponent()
  const rows = props.components.map(row => row.map(getComponent))
  return (
    <div>
      {props.name}
      <Suspense fallback={<div>loading...</div>}>
        {rows.map((row, index) => (
          <div key={index} className='row'>
            {row}
          </div>)
        )}
      </Suspense>
    </div>
  )
}
