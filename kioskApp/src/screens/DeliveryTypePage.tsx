import React from 'react';
import { useConfig } from 'ordering-components/native';

import { OrderTypeCardSelector } from '../components/OrderTypeCardSelector';

const DeliveryTypePage = (props:any): React.ReactElement => {
  const [{ configs }] = useConfig()

	const {
		navigation,
		route,
  } = props;

  const configTypes = configs?.order_types_allowed?.value.split('|').map((value: any) => Number(value)) || []

  return (
		<OrderTypeCardSelector
			configTypes={configTypes}
			navigation={navigation}
			callback={route?.params?.callback}
			goBack={route?.params?.goBack}
		/>
	);
};

export default DeliveryTypePage;
