import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import {
  DriverTips as DriverTipsController,
  useUtils,
  useLanguage,
  useConfig,
  useOrder
} from 'ordering-components/native';

import { OButton, OInput, OText } from '../shared';

import {
  DTContainer,
  DTCard,
  DTWrapperTips,
  DTForm,
  DTLabel,
  DTWrapperInput
} from './styles'
import { useTheme } from 'styled-components/native';

const DriverTipsUI = (props: any) => {
  const {
    driverTip,
    driverTipsOptions,
    optionSelected,
    isFixedPrice,
    isDriverTipUseCustom,
    handlerChangeOption
  } = props;

  const theme = useTheme();

  const style = StyleSheet.create({
    circle: {
      borderRadius: 20
    },
    inputStyle: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.disabled,
      marginRight: 10
    }
  })

  const [{ parsePrice }] = useUtils();
  const [, t] = useLanguage();
  const [{ configs }] = useConfig();
  const [{loading}] = useOrder()

  const [value, setvalue] = useState('');
  const [valueOption,setValueOption] = useState(0)

  const placeholderCurrency = (configs?.currency_position?.value || 'left') === 'left'
    ? `${configs?.format_number_currency?.value}0`
    : `0${configs?.format_number_currency?.value}`

  const handleChangeDriverTip = (val: any) => {
    const tip = Number(val)
    if ((isNaN(tip) || tip < 0)) {
      setvalue(value)
      return
    }
    setvalue(val)
  }

  const handleChangeOptionCustom = (val : any) => {
    setValueOption(val)
    handlerChangeOption(val)
  }
  return (
    <DTContainer>
      {!isDriverTipUseCustom ? (
        <>
          <DTWrapperTips>
            {driverTipsOptions.map((option: any, i: number) => (
              <TouchableOpacity
                key={i}
                onPress={() => handleChangeOptionCustom(option)}
              >
                <DTCard
                  style={style.circle}
                  isActive={option === optionSelected}
                >
                  {loading && valueOption === option ? (
                    <ActivityIndicator size='small' color={theme.colors.primary} />
                  ) : (
                    <OText size={18} color={option === optionSelected ? '#FFF' : '#000'}>
                      {`${isFixedPrice ? parsePrice(option) : `${option}%`}`}
                    </OText>
                  )}
                </DTCard>
              </TouchableOpacity>
            ))}
          </DTWrapperTips>
          {!driverTipsOptions.includes(driverTip) && driverTip > 0 && (
            <OText
              color={theme.colors.error}
              size={20}
              style={{ marginTop: 10, textAlign: 'center' }}
            >
              {t('CUSTOM_DRIVER_TIP_AMOUNT', 'The driver\'s current tip comes from a custom option')}
            </OText>
          )}
        </>
      ) : (
        <DTForm>
          <DTLabel>
            {t('CUSTOM_DRIVER_TIP_MESSAGE', '100% of these tips go directly to your driver')}
          </DTLabel>
          <DTWrapperInput>
            <OInput
              placeholder={placeholderCurrency}
              style={style.inputStyle}
              value={value}
              type={'numeric'}
              onChange={handleChangeDriverTip}
              autoCapitalize='none'
              autoCorrect={false}
            />
            <OButton
              text={t('APPLY_TIP', 'Apply Tip')}
              bgColor={theme.colors.primary}
              borderColor={theme.colors.primary}
              textStyle={{ color: 'white', fontSize: 18, maxWidth: 110, minWidth: 60 }}
              imgRightSrc={null}
              textProps={{numberOfLines: 1}}
              isDisabled={parseFloat(value || '0') < 0 || parseFloat(value || '0') === driverTip || value === ''}
              onClick={() => {
                handlerChangeOption(value)
                setvalue('')
              }}
            />
          </DTWrapperInput>
          {parseFloat(driverTip || 0) > 0 && (
            <OText
              color={theme.colors.error}
              size={20}
              style={{ marginTop: 10, textAlign: 'center' }}
            >
              {t('CURRENT_DRIVER_TIP_AMOUNT', 'Current driver tip amount')}: {parsePrice(driverTip)}
            </OText>
          )}
        </DTForm>
      )}
    </DTContainer>
  )
}

export const DriverTips = (props: any) => {
  const driverTipsProps = {
    ...props,
    UIComponent: DriverTipsUI
  }

  return <DriverTipsController {...driverTipsProps} />
}
