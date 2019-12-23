import { Button, Card, Header, Image, Label } from 'semantic-ui-react'

import React from 'react'
import RichTextContent from './RichTextContent'
import YoutubeVideo from './YoutubeVideo'
import classNames from 'classnames'
import some from 'lodash/_arraySome'

export default function Spot ({ useBackground = false, ...rest }) {
  const {
    image, type, richContent, ctaText, ctaUrl, linkText, linkUrl, price,
    headingOne, headingTwo, headingThree, description, teaser, component
  } = rest
  const hasVideo = component && component.includes('video') && image
  const anyTextContent = some([richContent, ctaText, linkText, headingOne, headingTwo, headingThree], Boolean)
  const isProduct = (component && component.includes('Product')) || type.toLowerCase() === 'shop'
  const isProductHighlight = isProduct && component.includes('highlight')
  const hasBackground = (type.includes('background') || useBackground || isProductHighlight) && image
  const ctaColor = isProduct ? 'blue' : 'orange'
  return (
    <Card className={classNames('spot', { 'has-background': hasBackground, product: isProduct })} title={description}>
      {hasVideo === false && image && hasBackground === false && <Image src={image} />}
      {hasVideo && hasBackground === false && <YoutubeVideo src={image} className={anyTextContent ? '' : 'full-height'} />}
      {anyTextContent &&
        <Card.Content>
          <Card.Header>
            {headingOne && <Header as='h1'>{headingOne}</Header>}
            {headingTwo && <Header as='h2'>{headingTwo}</Header>}
            {headingThree && <Header as='h3'>{headingThree}</Header>}
          </Card.Header>
          <Card.Description>
            <span>
              {teaser}
              <RichTextContent richContent={richContent} />
            </span>
            {isProduct && price && <Label className='price' children={price} color='black' />}
          </Card.Description>
          <Card.Meta>
            {ctaText && <a href={ctaUrl} title={ctaText}><Button color={ctaColor}>{ctaText}</Button></a>}
            {linkText && <a href={linkUrl} title={linkText}>{linkText}</a>}
          </Card.Meta>
          {image && hasBackground && <Image src={image} className='spot-background' />}
        </Card.Content>}
    </Card>
  )
}
