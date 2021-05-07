import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { useUtils, useLanguage } from 'ordering-components/native';

import { PCContainer, PCForm, PCWrapper } from './styles';
import { OInput, OText } from '../shared';
import { colors } from '../../theme.json';

export const PaymentOptionCash = (props: any) => {
  const {
    orderTotal,
    onChangeData,
    setErrorCash
  } = props;
  const [, t] = useLanguage();
  const [{ parsePrice }] = useUtils();

  const [value, setvalue] = useState('');

  const handleChangeCash = (value: any) => {
    let cash: any = parseFloat(value)
    cash = isNaN(cash) ? '' : cash
    setvalue(cash)
    onChangeData && onChangeData({ cash })
  }

  useEffect(() => {
    if (value && parseFloat(value) < orderTotal) {
      setErrorCash && setErrorCash(true)
    } else {
      setErrorCash && setErrorCash(false)
    }
  }, [value, orderTotal])

  return (
    <PCContainer>
      <PCForm>
        <PCWrapper>
          <OText style={{ fontSize: 16, textAlign: 'center' }}>
            {t('NOT_EXACT_CASH_AMOUNT', 'Don\'t have exact amount? Let us know with how much will you pay')}
          </OText>
          <OInput
            placeholder='0'
            onChange={(e: any) => handleChangeCash(e)}
            style={styles.inputsStyle}
            type='numeric'
          />
        </PCWrapper>
        {!!value && parseFloat(value) < orderTotal && (
          <OText style={styles.errorMsg}>
            {`${t('VALUE_GREATER_THAN_TOTAL', 'This value must be greater than order total')}: ${parsePrice(orderTotal)}`}
          </OText>
        )}
      </PCForm>
    </PCContainer>
  )
}

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

