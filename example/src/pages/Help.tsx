import React from 'react'
import { Container } from '../layouts/Container'
import { Help as HelpController } from '../../themes/uber-eats/src/components/Help'


interface Props {
  navigation: any;
  route: any;
}

const Help = (props: Props) => {
  const helpProps = {
    ...props
  }

  return (
    <Container>
      <HelpController {...helpProps} />
    </Container>
  )
}

export default Help
