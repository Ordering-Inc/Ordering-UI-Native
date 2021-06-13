import React, { useState, useEffect } from 'react'
import {
  ProductOptionSuboption as ProductSubOptionController,
  useUtils,
  useLanguage
} from 'ordering-components/native'
import { StyleSheet } from 'react-native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import {
  Container,
  IconControl,
  QuantityControl,
  Checkbox,
  PositionControl,
  Circle
} from './styles'
import { colors } from '../../theme.json'
import { OText } from '../shared'

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

  const handleSuboptionClick = (isSelected : boolean) => {
    if (!isSelected && balance === option?.max && option?.suboptions?.length > balance && !(option?.min === 1 && option?.max === 1)) {
      setShowMessage(true)
    }
    toggleSelect()
  }
  
  const handleClickContainer = () => {
    if(!option?.allow_suboption_quantity){
      handleSuboptionClick(state?.selected)
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
    <Container onPress={() => handleClickContainer()} disabled={disabled}>
      <IconControl>
        {((option?.min === 0 && option?.max === 1) || option?.max > 1) ? (
          state?.selected ? (
            <MaterialCommunityIcon onPress={() => option?.allow_suboption_quantity && handleSuboptionClick(state?.selected)} name='checkbox-marked' color={colors.primary} size={24} />
          ) : (
            <MaterialCommunityIcon onPress={() => option?.allow_suboption_quantity && handleSuboptionClick(state?.selected)} name='checkbox-blank-outline' color={colors.backgroundDark} size={24} />
          )
        ) : (
          state?.selected ? (
            <MaterialCommunityIcon name='radiobox-marked' color={colors.primary} size={24} />
          ) : (
            <MaterialCommunityIcon name='radiobox-blank' color={colors.backgroundDark} size={24} />
          )
        )}
        <OText mLeft={10} style={{ flex: 1 }}>
          {suboption?.name}
        </OText>
      </IconControl>
      {showMessage && <OText mLeft={10} mRight={10} style={{ flex: 1, textAlign: 'center' }} ellipsizeMode='true' color={colors.primary}>{`${t('OPTIONS_MAX_LIMIT', 'Maximum options to choose')}: ${option?.max}`}</OText>}
      {option?.allow_suboption_quantity && (
        <QuantityControl>
          <Checkbox disabled={state.quantity === 0} onPress={handleDecrement}>
            <MaterialCommunityIcon
              name='minus-circle-outline'
              size={24}
              color={state.quantity === 0 ? colors.backgroundDark : colors.primary}
            />
          </Checkbox>
          <OText mLeft={5} mRight={5}>
            {state.quantity}
          </OText>
          <Checkbox disabled={disableIncrement} onPress={handleIncrement}>
            <MaterialCommunityIcon
              name='plus-circle-outline'
              size={24}
              color={disableIncrement ? colors.backgroundDark : colors.primary}
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
                color={state.selected && state.position === 'left' ? colors.primary : '#cbcbcb'}
                size={24}
                style={styles.inverse}
              />
            </Circle>
            <Circle onPress={() => handlePosition('whole')}>
              <MaterialCommunityIcon
                name='checkbox-blank-circle'
                color={state.selected && state.position === 'whole' ? colors.primary : '#cbcbcb'}
                size={24}
              />
            </Circle>
            <Circle onPress={() => handlePosition('right')}>
              <MaterialCommunityIcon
                name='circle-half-full'
                color={state.selected && state.position === 'right' ? colors.primary : '#cbcbcb'}
                size={24}
              />
            </Circle>
          </PositionControl>
        )
      }
      <OText color='#555'>
        + {parsePrice(price)}
      </OText>
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
