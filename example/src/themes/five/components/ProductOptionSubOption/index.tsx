import React, { useState, useEffect } from 'react'
import {
  useUtils,
  useLanguage,
  ProductOptionSuboption as ProductSubOptionController
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
import { colors, images } from '../../theme.json'
import { OIcon, OText } from '../../../../components/shared'

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
    <Container disabled={disabled}>
      <IconControl onPress={() => handleSuboptionClick()}>
        {((option?.min === 0 && option?.max === 1) || option?.max > 1) ? (
          state?.selected ? (
            <OIcon src={images.general.check_act} color={colors.primary} width={16} />
          ) : (
            <OIcon src={images.general.check_nor} color={colors.disabled} width={16} />
          )
        ) : (
          state?.selected ? (
            <OIcon src={images.general.radio_act} color={colors.primary} width={16} />
          ) : (
            <OIcon src={images.general.radio_nor} color={colors.disabled} width={16} />
          )
        )}
        <OText size={12} lineHeight={18} color={colors.textSecondary} mLeft={10} style={{ flex: 1 }}>
          {suboption?.name}
        </OText>
      </IconControl>
      {showMessage && <OText size={10} mLeft={4} mRight={4} style={{ flex: 1, textAlign: 'center' }} color={colors.primary}>{`${t('OPTIONS_MAX_LIMIT', 'Maximum options to choose')}: ${option?.max}`}</OText>}
      {option?.allow_suboption_quantity && (
        <QuantityControl>
          <Checkbox disabled={state.quantity === 0} onPress={decrement}>
            <OIcon
              src={images.general.minus}
              width={16}
              color={state.quantity === 0 ? colors.disabled : colors.primary}
            />
          </Checkbox>
          <OText mLeft={5} mRight={5}>
            {state.quantity}
          </OText>
          <Checkbox disabled={disableIncrement} onPress={increment}>
            <OIcon
              src={images.general.plus}
              width={16}
              color={disableIncrement ? colors.disabled : colors.primary}
            />
          </Checkbox>
        </QuantityControl>
      )}
      {option?.with_half_option && (
        <PositionControl>
          <Circle onPress={() => changePosition('left')}>
            <OIcon
              src={images.general.half_l}
              color={state.selected && state.position === 'left' ? colors.primary : '#cbcbcb'}
              width={16}
              style={styles.inverse}
            />
          </Circle>
          <Circle onPress={() => changePosition('whole')}>
            <OIcon
              src={images.general.half_f}
              color={state.selected && state.position === 'whole' ? colors.primary : '#cbcbcb'}
              width={16}
            />
          </Circle>
          <Circle onPress={() => changePosition('right')}>
            <OIcon
              src={images.general.half_r}
              color={state.selected && state.position === 'right' ? colors.primary : '#cbcbcb'}
              width={16}
            />
          </Circle>
        </PositionControl>
      )
      }
      <OText size={12} lineHeight={18} color={colors.textSecondary}>
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
