import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { DriverTips as DriverTipsController } from 'ordering-components/native';

import { OText } from '../shared';

import {
  DTContainer,
  DTCard
} from './styles'

const DriverTipsUI = (props: any) => {
  const {
    driverTipsOptions,
    optionSelected,
    handlerChangeOption
  } = props

  return (
    <DTContainer>
      {driverTipsOptions?.length > 0 && driverTipsOptions.map((option: any, i: number) => (
        <TouchableOpacity
          key={i}
          onPress={() => handlerChangeOption(option)}
        >
          <DTCard
            style={style.circle}
            isActive={option === optionSelected}
          >
            <OText size={14} color={option === optionSelected ? '#FFF' : '#000'}>
              {`${option}%`}
            </OText>
          </DTCard>
        </TouchableOpacity>
      ))}
    </DTContainer>
  )
}

const style = StyleSheet.create({
  circle: {
    borderRadius: 100 / 2
  }
})

export const DriverTips = (props: any) => {
  const driverTipsProps = {
    ...props,
    UIComponent: DriverTipsUI
  }

  return <DriverTipsController {...driverTipsProps} />
}
