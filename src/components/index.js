export function getAsyncComponent (component, data) {
  if (component.startsWith('Spot') || (data.category && data.category.toLowerCase() === 'spot')) {
    return () => import('./Spot')
  }
  switch (component) {
    case 'GlobalMenu': return () => import('./GlobalMenu')
    case 'Footer': return () => import('./Footer')
    case 'PageHeading': return () => import('./PageHeading')
    case 'RichTextContent': return () => import('./RichTextContent')
  }
  return null
}
