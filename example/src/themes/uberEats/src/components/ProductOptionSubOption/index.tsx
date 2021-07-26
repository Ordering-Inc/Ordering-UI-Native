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
import { OText, OIcon } from '../../../../../components/shared'
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
  const [{ parsePrice, optimizeImage }] = useUtils()

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
            <MaterialCommunityIcon  name='checkbox-marked' color={theme.colors.primary} size={24} />
          ) : (
            <MaterialCommunityIcon  name='checkbox-blank-outline' color={theme.colors.backgroundDark} size={24} />
          )
        ) : (
          state?.selected ? (
            <MaterialCommunityIcon name='radiobox-marked' color={theme.colors.primary} size={24} />
          ) : (
            <MaterialCommunityIcon name='radiobox-blank' color={theme.colors.backgroundDark} size={24} />
          )
        )}
        {suboption.image && suboption.image !== '-' && (
          <OIcon
            cover
            url={optimizeImage(suboption?.image, 'h_200,c_limit')}
            style={styles.subOptionImgStyle}
          />
        )}
        <OText mLeft={10} style={{ flex: I18nManager.isRTL ? 0 : 1 }}>
          {suboption?.name}
        </OText>
      </IconControl>
      {showMessage && <OText mLeft={10} mRight={10} style={{ flex: 1, textAlign: 'center' }} color={theme.colors.primary}>{`${t('OPTIONS_MAX_LIMIT', 'Maximum options to choose')}: ${option?.max}`}</OText>}
      {option?.allow_suboption_quantity && (
        <QuantityControl>
          <Checkbox disabled={state.quantity === 0} onPress={decrement}>
            <MaterialCommunityIcon
              name='minus-circle-outline'
              size={24}
              color={state.quantity === 0 ? theme.colors.backgroundDark : theme.colors.primary}
            />
          </Checkbox>
          <OText mLeft={5} mRight={5}>
            {state.quantity}
          </OText>
          <Checkbox disabled={disableIncrement} onPress={increment}>
            <MaterialCommunityIcon
              name='plus-circle-outline'
              size={24}
              color={disableIncrement ? theme.colors.backgroundDark : theme.colors.primary}
            />
          </Checkbox>
        </QuantityControl>
      )}
      {option?.with_half_option && (
        <PositionControl>
          <Circle onPress={() => changePosition('left')}>
            <MaterialCommunityIcon
              name='circle-half-full'
              color={state.selected && state.position === 'left' ? theme.colors.primary : '#cbcbcb'}
              size={24}
              style={styles.inverse}
            />
          </Circle>
          <Circle onPress={() => changePosition('whole')}>
            <MaterialCommunityIcon
              name='checkbox-blank-circle'
              color={state.selected && state.position === 'whole' ? theme.colors.primary : '#cbcbcb'}
              size={24}
            />
          </Circle>
          <Circle onPress={() => changePosition('right')}>
            <MaterialCommunityIcon
              name='circle-half-full'
              color={state.selected && state.position === 'right' ? theme.colors.primary : '#cbcbcb'}
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
  },
  subOptionImgStyle: {
    width: 40,
    height: 40,
    marginLeft: 5
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
