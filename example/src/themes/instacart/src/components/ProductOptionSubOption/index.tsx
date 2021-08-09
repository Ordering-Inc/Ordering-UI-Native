import React, { useState, useEffect } from 'react'
import {
  useUtils,
  useLanguage,
  ProductOptionSuboption as ProductSubOptionController
} from 'ordering-components/native'
import { StyleSheet, I18nManager } from 'react-native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import {
  Container,
  IconControl,
  QuantityControl,
  Checkbox,
  PositionControl,
  Circle
} from './styles'
import { OIcon, OText } from '../shared'
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

  const theme = useTheme();
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
            <OIcon src={theme.images.general.check_act} width={16} color={theme.colors.primary} />
          ) : (
            <OIcon src={theme.images.general.check_nor} width={16} color={theme.colors.secundary} />
          )
        ) : (
          state?.selected ? (
            <OIcon src={theme.images.general.radio_act} width={16} color={theme.colors.primary} />
          ) : (
            <OIcon src={theme.images.general.radio_nor} width={16} color={theme.colors.backgroundGray} />
          )
        )}
        <OText mLeft={10} size={12} lineHeight={18} color={theme.colors.textSecondary} style={{ flex: I18nManager.isRTL ? 0 : 1 }}>
          {suboption?.name}
        </OText>
      </IconControl>
      {showMessage && <OText mLeft={10} mRight={10} style={{ flex: 1, textAlign: 'center' }} color={theme.colors.primary}>{`${t('OPTIONS_MAX_LIMIT', 'Maximum options to choose')}: ${option?.max}`}</OText>}
      {option?.allow_suboption_quantity && (
        <QuantityControl>
          <Checkbox disabled={state.quantity === 0} onPress={decrement}>
            <OIcon
              src={theme.images.general.minus}
              width={16}
              color={state.quantity === 0 ? theme.colors.backgroundDark : theme.colors.primary}
            />
          </Checkbox>
          <OText mLeft={5} mRight={5} size={12} lineHeight={18} color={theme.colors.textSecondary}>
            {state.quantity}
          </OText>
          <Checkbox disabled={disableIncrement} onPress={increment}>
            <OIcon
              src={theme.images.general.plus}
              width={16}
              color={disableIncrement ? theme.colors.backgroundDark : theme.colors.primary}
            />
          </Checkbox>
        </QuantityControl>
      )}
      {option?.with_half_option && (
        <PositionControl>
          <Circle onPress={() => changePosition('left')}>
            <OIcon
              src={theme.images.general.half_left}
              color={state.selected && state.position === 'left' ? theme.colors.primary : '#cbcbcb'}
              width={16}
              style={styles.inverse}
            />
          </Circle>
          <Circle onPress={() => changePosition('whole')}>
            <OIcon
              src={theme.images.general.half_full}
              color={state.selected && state.position === 'whole' ? theme.colors.primary : '#cbcbcb'}
              width={16}
            />
          </Circle>
          <Circle onPress={() => changePosition('right')}>
            <OIcon
              src={theme.images.general.half_right}
              color={state.selected && state.position === 'right' ? theme.colors.primary : '#cbcbcb'}
              width={16}
            />
          </Circle>
        </PositionControl>
      )
      }
      <OText  size={12} lineHeight={18} color={theme.colors.textSecondary}>
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
