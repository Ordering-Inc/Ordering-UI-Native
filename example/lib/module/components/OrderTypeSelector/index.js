import React from 'react';
import { OrderTypeControl, useLanguage } from 'ordering-components/native';
import { ODropDown } from '../shared';
import { OrderTypeWrapper } from './styles';
import { colors } from '../../theme';

const OrderTypeSelectorUI = props => {
  const {
    handleChangeOrderType,
    typeSelected,
    defaultValue,
    configTypes,
    orderTypes
  } = props;
  return typeSelected !== undefined && /*#__PURE__*/React.createElement(OrderTypeWrapper, null, /*#__PURE__*/React.createElement(ODropDown, {
    bgcolor: colors.inputDisabled,
    textcolor: colors.black,
    options: orderTypes.filter(type => configTypes === null || configTypes === void 0 ? void 0 : configTypes.includes(type.value)),
    defaultValue: defaultValue || typeSelected,
    onSelect: orderType => handleChangeOrderType(orderType)
  }));
};

export const OrderTypeSelector = props => {
  const [, t] = useLanguage();
  const orderTypeProps = { ...props,
    UIComponent: OrderTypeSelectorUI,
    orderTypes: props.orderType || [{
      value: 1,
      content: t('DELIVERY', 'Delivery')
    }, {
      value: 2,
      content: t('PICKUP', 'Pickup')
    }, {
      value: 3,
      content: t('EAT_IN', 'Eat in')
    }, {
      value: 4,
      content: t('CURBSIDE', 'Curbside')
    }, {
      value: 5,
      content: t('DRIVE_THRU', 'Drive thru')
    }]
  };
  return /*#__PURE__*/React.createElement(OrderTypeControl, orderTypeProps);
};
//# sourceMappingURL=index.js.map