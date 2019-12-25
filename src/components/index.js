import memoize from 'lodash/memoize'

function getComponentMatchForSpreadsheet (component, data) {
  if (component.startsWith('Spot') || (data?.category?.toLowerCase() === 'spot')) {
    return () => import('./Spot')
  }

  if (component.startsWith('RichTextContent') || data?.category?.toLowerCase() === 'base content') {
    return () => import('./RichTextContent')
  }
  // replace with dynamic importing
  switch (component) {
    case 'ProductListItem':
    case 'Spot':
    case 'ProductInfo':
    case 'ProductHighlight': return () => import('./Spot')
    case 'ProductListFilterAndSort': return () => import('./ProductListFilterAndSort')
    case 'GlobalMenu': return () => import('./GlobalMenu')
    case 'Footer': return () => import('./Footer')
    case 'PageHeading': return () => import('./PageHeading')
    case 'LoginModule': return () => import('./LoginForm')
    case 'OrderPayment': return () => import('./OrderForm')
    case 'Contact': return () => import('./ContactForm')
    case 'ProductTabs': return () => import('./ProductTabs')
  }

  console.warn('No react component for ', component)
  return null
}

export const getAsyncComponent = memoize(getComponentMatchForSpreadsheet)
