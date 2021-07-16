import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import {
  DriverTips as DriverTipsController,
  useUtils,
  useLanguage,
  useConfig,
  useOrder
} from 'ordering-components/native';

import { colors } from '../../theme.json';
import { OButton, OInput, OText } from '../../../../components/shared';

import {
  DTContainer,
  DTCard,
  DTWrapperTips,
  DTForm,
  DTLabel,
  DTWrapperInput
} from './styles'

const DriverTipsUI = (props: any) => {
  const {
    driverTip,
    driverTipsOptions,
    optionSelected,
    isFixedPrice,
    isDriverTipUseCustom,
    handlerChangeOption
  } = props;

  const [{ parsePrice }] = useUtils();
  const [, t] = useLanguage();
  const [{ configs }] = useConfig();
  const [{loading}] = useOrder()

  const [value, setvalue] = useState(0);
  const [valueOption,setValueOption] = useState(0)

  const placeholderCurrency = (configs?.currency_position?.value || 'left') === 'left'
    ? `${configs?.format_number_currency?.value}0`
    : `0${configs?.format_number_currency?.value}`

  const handleChangeDriverTip = (val: any) => {
    let tip = parseFloat(val)
    tip = isNaN(tip) ? 0 : tip
    setvalue(tip)
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
                    <ActivityIndicator size='small' color={colors.primary} />
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
              color={colors.error}
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
              onChange={handleChangeDriverTip}
              autoCapitalize='none'
              autoCorrect={false}
            />
            <OButton
              text={t('APPLY_TIP', 'Apply Tip')}
              bgColor={colors.primary}
              borderColor={colors.primary}
              textStyle={{ color: 'white', fontSize: 20 }}
              imgRightSrc={null}
              isDisabled={!(value > 0 && value !== driverTip) || !value}
              onClick={() => {
                handlerChangeOption(value)
                setvalue(0)
              }}
            />
          </DTWrapperInput>
          {parseFloat(driverTip || 0) > 0 && (
            <OText
              color={colors.error}
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

const style = StyleSheet.create({
  circle: {
    borderRadius: 20
  },
  inputStyle: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.disabled,
    marginRight: 10
  }
})

export const DriverTips = (props: any) => {
  const driverTipsProps = {
    ...props,
    UIComponent: DriverTipsUI
  }

  return <DriverTipsController {...driverTipsProps} />
}
