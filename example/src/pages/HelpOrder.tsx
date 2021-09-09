import React from 'react'
import { Container } from '../layouts/Container'
import { HelpOrder as HelpOrderController } from '../components/HelpOrder'


interface Props {
  navigation: any;
  route: any;
}

const HelpOrder = (props: Props) => {
  const helpOrderProps = {
    ...props
  }

  return (
    <Container>
      <HelpOrderController {...helpOrderProps} />
    </Container>
  )
}

export default HelpOrder
