import { Comment, Header, Segment, Tab } from 'semantic-ui-react'

import React from 'react'

export default function ProductTabs ({ description, headingTwo, richContent }) {
  const panes = [
    {
      menuItem: 'Specifications',
      render: () => (
        <Tab.Pane>
          <p>Model nr: 23142</p>
          <p>Color: Red</p>
          <p>ID: 23123123</p>
          <p>Material: Cloth</p>
        </Tab.Pane>
      )

    },
    {
      menuItem: 'Stock Amount',
      render: () => (
        <Tab.Pane>
          <p>Stockholm: 202</p>
          <p>Copenhagen: 140</p>
          <p>Amsterdam: 69</p>
        </Tab.Pane>
      )

    },
    {
      menuItem: 'Customer Feedback',
      render: () => (
        <Tab.Pane>
          <Comment.Group>
            <Comment>
              <Comment.Content>
                <Comment.Author as='a'>Matt</Comment.Author>
                <Comment.Metadata>
                  <div>Today at 5:42PM</div>
                </Comment.Metadata>
                <Comment.Text>How artistic!</Comment.Text>
                <Comment.Actions>
                  <Comment.Action>Reply</Comment.Action>
                </Comment.Actions>
              </Comment.Content>
            </Comment>
            <Comment>
              <Comment.Content>
                <Comment.Author as='a'>Elliot Fu</Comment.Author>
                <Comment.Metadata>
                  <div>Yesterday at 12:30AM</div>
                </Comment.Metadata>
                <Comment.Text>
                  <p>This has been very useful for my research. Thanks as well!</p>
                </Comment.Text>
                <Comment.Actions>
                  <Comment.Action>Reply</Comment.Action>
                </Comment.Actions>
              </Comment.Content>
              <Comment.Group>
                <Comment>
                  <Comment.Content>
                    <Comment.Author as='a'>Jenny Hess</Comment.Author>
                    <Comment.Metadata>
                      <div>Just now</div>
                    </Comment.Metadata>
                    <Comment.Text>Elliot you are always so right :)</Comment.Text>
                    <Comment.Actions>
                      <Comment.Action>Reply</Comment.Action>
                    </Comment.Actions>
                  </Comment.Content>
                </Comment>
              </Comment.Group>
            </Comment>

          </Comment.Group>
        </Tab.Pane>
      )

    },
    {
      menuItem: 'More Information',
      render: () => (
        <Tab.Pane>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa quisquam quos ut vero ipsam quibusdam quasi amet at accusantium quas reiciendis, doloribus animi distinctio sint rerum expedita, aperiam, omnis repudiandae!</p>
        </Tab.Pane>
      )
    }
  ]

  return (
    <Segment title={description}>
      <Header as='h2'>{headingTwo}</Header>
      {/* <RichTextContent richContent={richContent} /> */}
      <Tab panes={panes} />
    </Segment>
  )
}
