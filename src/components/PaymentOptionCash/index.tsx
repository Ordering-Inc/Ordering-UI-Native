import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { useUtils, useLanguage } from 'ordering-components/native';
import { useForm, Controller } from 'react-hook-form';

import { PCContainer, PCForm, PCWrapper } from './styles';
import { OInput, OText } from '../shared';
import { colors } from '../../theme.json';

export const PaymentOptionCash = (props: any) => {
  const {
    defaultValue,
    orderTotal,
    onChangeData,
    setErrorCash
  } = props;
  const [, t] = useLanguage();
  const [{ parsePrice }] = useUtils();
  const { control } = useForm();

  const [value, setvalue] = useState(defaultValue?.toString() || '');
  let timeout: any = null;

  const onChangeCash = (value: any) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      let cash: any = parseFloat(value)
      cash = isNaN(cash) ? '' : cash
      setvalue(cash.toString())
      if (cash >= orderTotal || !cash) {
        onChangeData && onChangeData(!cash ? { cash: null } : { cash })
      }
    }, 750)
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
          <Controller
            control={control}
            name='cash'
            defaultValue={value}
            render={() => (
              <OInput
                name='cash'
                placeholder='0'
                style={styles.inputsStyle}
                value={value}
                onChange={(val: any) => onChangeCash(val?.target.value)}
                type='numeric'
                returnKeyType='done'
              />
            )}
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

PaymentOptionCash.defaultProps = {
  defaultValue: ''
}

