import React, { useState, useRef } from 'react'
import { ProductOption as ProductOptionController, useLanguage, useUtils } from 'ordering-components/native'
import {
  Container,
  WrapHeader,
  WrapperOption,
  TitleContainer,
  WrapTitle
} from './styles'
import { OText, OIcon } from '../../../../../components/shared'
import { useTheme } from 'styled-components/native'
import { StyleSheet, Animated } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

const ProductOptionUI = (props: any) => {
  const {
    children,
    option,
    error
  } = props

  const theme = useTheme()

  const styles = StyleSheet.create({
    optionImgStyle: {
      width: 40,
      height: 40,
      marginRight: 5,
    },
    wrapArrowIcon: {
      backgroundColor: theme.colors.lightGray,
      padding: 2,
      borderRadius: 20
    }
  })

  const [, t] = useLanguage()
  const [{ optimizeImage }] = useUtils()

  const [setActive, setActiveState] = useState('active')

  let maxMin = `(${t('MIN', 'Min')}: ${option.min} / ${t('MAX', 'Max')}: ${option.max})`
  if (option.min === 1 && option.max === 1) {
    maxMin = t('REQUIRED', 'Required')
  } else if (option.min === 0 && option.max > 0) {
    maxMin = `(${t('MAX', 'Max')}: ${option.max})`
  } else if (option.min > 0 && option.max === 0) {
    maxMin = `(${t('MIN', 'Min')}: ${option.min})`
  }

  const rotateAnimation = useRef(new Animated.Value(0)).current
  const interpolateRotating = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  })

  const toggleAccordion = () => {
    Animated.timing(rotateAnimation, {
      toValue: setActive === '' ? 0 : 1,
      duration: 300,
      useNativeDriver: true
    }).start()
    setActiveState(setActive === '' ? 'active' : '')
  }

  return (
    <Container style={{color: error ? 'orange' : theme.colors.white}}>
      <WrapHeader onPress={() => toggleAccordion()}>
        <TitleContainer>
          {option?.image && (
            <OIcon
              cover
              url={optimizeImage(option?.image, 'h_200,c_limit')}
              style={styles.optionImgStyle}
            />
          )}
          <WrapTitle>
            <OText size={16} weight={600} style={{ textAlign: 'left' }}>{option.name}</OText>
            <OText color={theme.colors.gray} style={{ textAlign: 'left' }}>{maxMin}</OText>
          </WrapTitle>
        </TitleContainer>
        <Animated.View
          style={{ transform: [{ rotate: interpolateRotating }], ...styles.wrapArrowIcon }}
        >
          <MaterialIcon
            name='keyboard-arrow-down'
            size={30}
          />
        </Animated.View>
      </WrapHeader>
      <WrapperOption
        hidden={!setActive}
      >
        {children}
      </WrapperOption>
    </Container>
  )
}

export const ProductOption = (props: any) => {
  const productOptionProps = {
    ...props,
    UIComponent: ProductOptionUI
  }

  return (
    <ProductOptionController {...productOptionProps} />
  )
}
