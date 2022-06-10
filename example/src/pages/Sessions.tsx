import React from 'react'
import { Container } from '../../themes/original/src/layouts/Container'
import { Sessions as SessionsController } from '../../themes/original/src/components/Sessions'

interface Props {
  navigation: any;
  route: any;
}

const Sessions = (props: Props) => {
  const sessionsProps = {
    ...props
  }

  return (
    <Container>
      <SessionsController {...sessionsProps} />
    </Container>
  )
}

export default Sessions
