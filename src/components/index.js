import memoize from 'lodash/memoize'

function getComponentMatchForSpreadsheet (component, data) {
  if (component.startsWith('Spot') || (data.category && data.category.toLowerCase() === 'spot')) {
    return () => import('./Spot')
  }

  // replace with dynamic importing
  switch (component) {
    case 'GlobalMenu': return () => import('./GlobalMenu')
    case 'Footer': return () => import('./Footer')
    case 'PageHeading': return () => import('./PageHeading')
    case 'RichTextContent': return () => import('./RichTextContent')
    case 'ProductListItem':
    case 'Spot':
    case 'ProductHighlight': return () => import('./Spot')
    case 'ProductListFilterAndSort': return () => import('./ProductListFilterAndSort')
  }
  return null
}

export const getAsyncComponent = memoize(getComponentMatchForSpreadsheet)
