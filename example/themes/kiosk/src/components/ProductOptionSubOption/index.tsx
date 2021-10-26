import React, { useState, useEffect } from 'react'
import {
  ProductOptionSuboption as ProductSubOptionController,
  useUtils,
  useLanguage
} from 'ordering-components/native'
import { StyleSheet, View } from 'react-native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import {
  Container,
  IconControl,
  QuantityControl,
  Checkbox,
  PositionControl,
  Circle,
  LeftSide,
  RightSide
} from './styles'
import { OText } from '../shared'
import { useTheme } from 'styled-components/native'

export const ProductOptionSubOptionUI = (props: any) => {
  const {
    state,
    increment,
    decrement,
    balance,
    option,
    suboption,
    toggleSelect,
    changePosition,
    disabled
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ parsePrice }] = useUtils()
  const [showMessage, setShowMessage] = useState(false)

  const handleIncrement = () => {
    increment()
  }

  const handleDecrement = () => {
    decrement()
  }

  const handlePosition = (position: string) => {
    changePosition(position)
  }

  const handleSuboptionClick = () => {
    toggleSelect()
    if (balance === option?.max && option?.suboptions?.length > balance && !(option?.min === 1 && option?.max === 1)) {
      setShowMessage(true)
    }
  }

  useEffect(() => {
    if (!(balance === option?.max && option?.suboptions?.length > balance && !(option?.min === 1 && option?.max === 1))) {
      setShowMessage(false)
    }
  }, [balance])

  const disableIncrement = option?.limit_suboptions_by_max ? balance === option?.max : state.quantity === suboption?.max || (!state.selected && balance === option?.max)
  const price = option?.with_half_option && suboption?.half_price && state.position !== 'whole' ? suboption?.half_price : suboption?.price

  return (
    <Container onPress={() => handleSuboptionClick()} disabled={disabled}>
       <LeftSide>
        {((option?.min === 0 && option?.max === 1) || option?.max > 1) ? (
          state?.selected ? (
            <MaterialCommunityIcon name='checkbox-marked' color={theme.colors.primary} size={24} />
          ) : (
            <MaterialCommunityIcon name='checkbox-blank-outline' color={theme.colors.backgroundDark} size={24} />
          )
        ) : (
          state?.selected ? (
            <MaterialCommunityIcon name='radiobox-marked' color={theme.colors.primary} size={24} />
          ) : (
            <MaterialCommunityIcon name='radiobox-blank' color={theme.colors.backgroundDark} size={24} />
          )
        )}
      <View
        style={{
          alignItems: "flex-start",
          marginLeft: 10,
        }}
      >
        <OText size={20}>
          {suboption?.name}
        </OText>
      </View>
      </LeftSide>
      {showMessage && <OText mLeft={10} mRight={10} style={{ flex: 1, textAlign: 'center' }} color={theme.colors.primary}>{`${t('OPTIONS_MAX_LIMIT', 'Maximum options to choose')}: ${option?.max}`}</OText>}
      <RightSide>
      {option?.allow_suboption_quantity && (
        <QuantityControl>
          <Checkbox disabled={state.quantity === 0} onPress={handleDecrement}>
            <MaterialCommunityIcon
              name='minus-circle-outline'
              size={24}
              color={state.quantity === 0 ? theme.colors.backgroundDark : theme.colors.primary}
            />
          </Checkbox>
          <OText mLeft={5} mRight={5}>
            {state.quantity}
          </OText>
          <Checkbox disabled={disableIncrement} onPress={handleIncrement}>
            <MaterialCommunityIcon
              name='plus-circle-outline'
              size={24}
              color={disableIncrement ? theme.colors.backgroundDark : theme.colors.primary}
            />
          </Checkbox>
        </QuantityControl>
      )}
        {
          option?.with_half_option && (
            <PositionControl>
              <Circle onPress={() => handlePosition('left')}>
                <MaterialCommunityIcon
                  name='circle-half-full'
                  color={state.selected && state.position === 'left' ? theme.colors.primary : theme.colors.backgroundDark}
                  size={24}
                  style={styles.inverse}
                />
              </Circle>
              <Circle onPress={() => handlePosition('whole')}>
                <MaterialCommunityIcon
                  name='checkbox-blank-circle'
                  color={state.selected && state.position === 'whole' ? theme.colors.primary : theme.colors.backgroundDark}
                  size={24}
                />
              </Circle>
              <Circle onPress={() => handlePosition('right')}>
                <MaterialCommunityIcon
                  name='circle-half-full'
                  color={state.selected && state.position === 'right' ? theme.colors.primary : theme.colors.backgroundDark}
                  size={24}
                />
              </Circle>
            </PositionControl>
          )
        }
          <OText
            color="#909BA9"
            size={16}
            weight="bold"
          >
            + {parsePrice(price)}
          </OText>
      </RightSide>
    </Container>
  )
}

const styles = StyleSheet.create({
  inverse: {
    transform: [{ rotateY: '180deg' }]
  }
})

export const ProductOptionSubOption = (props: any) => {
  const productOptionSubOptionProps = {
    ...props,
    UIComponent: ProductOptionSubOptionUI
  }

  return (
    <ProductSubOptionController {...productOptionSubOptionProps} />
  )
}
