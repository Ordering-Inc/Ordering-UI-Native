import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useUtils, useLanguage } from 'ordering-components/native';
import { PCContainer, PCForm, PCWrapper } from './styles';
import { OInput, OText } from '../shared';
import { colors } from '../../theme';
export const PaymentOptionCash = props => {
  const {
    orderTotal,
    onChangeData,
    setErrorCash
  } = props;
  const [, t] = useLanguage();
  const [{
    parsePrice
  }] = useUtils();
  const [value, setvalue] = useState('');

  const handleChangeCash = value => {
    let cash = parseFloat(value);
    cash = isNaN(cash) ? '' : cash;
    setvalue(cash);
    onChangeData && onChangeData({
      cash
    });
  };

  useEffect(() => {
    if (value && parseFloat(value) < orderTotal) {
      setErrorCash && setErrorCash(true);
    } else {
      setErrorCash && setErrorCash(false);
    }
  }, [value, orderTotal]);
  return /*#__PURE__*/React.createElement(PCContainer, null, /*#__PURE__*/React.createElement(PCForm, null, /*#__PURE__*/React.createElement(PCWrapper, null, /*#__PURE__*/React.createElement(OText, {
    style: {
      fontSize: 16,
      textAlign: 'center'
    }
  }, t('NOT_EXACT_CASH_AMOUNT', 'Don\'t have exact amount? Let us know with how much will you pay')), /*#__PURE__*/React.createElement(OInput, {
    placeholder: "0",
    onChange: e => handleChangeCash(e),
    style: styles.inputsStyle,
    type: "numeric"
  })), !!value && parseFloat(value) < orderTotal && /*#__PURE__*/React.createElement(OText, {
    style: styles.errorMsg
  }, `${t('VALUE_GREATER_THAN_TOTAL', 'This value must be greater than order total')}: ${parsePrice(orderTotal)}`)));
};
const styles = StyleSheet.create({
  inputsStyle: {
    borderColor: colors.secundaryContrast,
    borderRadius: 50,
    marginTop: 10,
    width: '100%',
    height: 60,
    maxHeight: 60
  },
  errorMsg: {
    marginTop: 10,
    color: colors.error,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  }
});
//# sourceMappingURL=index.js.map