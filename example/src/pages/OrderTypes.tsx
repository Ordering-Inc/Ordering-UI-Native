import React from 'react';
import { Container } from '../../themes/original/src/layouts/Container'
import { OrderTypeSelector } from '../../themes/original/src/components/OrderTypeSelector'

const OrderTypes = (props: any) => {
  const { route } = props;
  const typesProps = {
    ...props,
    configTypes: route?.params?.configTypes,
  };
  return (
    <Container>
      <OrderTypeSelector {...typesProps} />
    </Container>
  );
};

export default OrderTypes;
