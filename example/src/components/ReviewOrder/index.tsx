import React, { useState, useEffect } from 'react'
import { OrderReview as ReviewOrderController, useLanguage } from 'ordering-components/native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

import {
  ReviewOrderContainer,
  BusinessLogo,
  FormReviews,
  Category,
  Stars
} from './styles'
import { OButton, OIcon, OInput, OText } from '../shared'
import { TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme'
import { useToast, ToastType } from '../../providers/ToastProvider'
import NavBar from '../NavBar'
import Spinner from 'react-native-loading-spinner-overlay'

import { ReviewOrderParams } from '../../types'

export const ReviewOrderUI = (props: ReviewOrderParams) => {
  const {
    order,
    stars,
    handleChangeInput,
    handleChangeRating,
    handleSendReview,
    formState,
    navigation
  } = props

  const [, t] = useLanguage()
  const { showToast } = useToast()

  const [alertState, setAlertState] = useState<{ open: boolean, content: Array<any>, success?: boolean }>({ open: false, content: [], success: false })

  const categories = {
    quality: { name: 'quality', show: t('QUALITY', 'Quality of Product') },
    punctuality: { name: 'punctiality', show: t('PUNCTUALITY', 'Punctuality') },
    service: { name: 'service', show: t('SERVICE', 'Service') },
    packaging: { name: 'packaging', show: t('PRODUCT_PACKAGING', 'Product Packaging') }
  }

  const onSubmit = () => {
    if (Object.values(stars).some(value => value === 0)) {
      setAlertState({
        open: true,
        content: Object.values(categories).map((category, i) => stars[category.name] === 0 ? `${t('CATEGORY_ATLEAST_ONE', `${category.show} must be at least one point`).replace('CATEGORY', category.name.toUpperCase())} ${i !== 3 && '\n'}` : ' ')
      })
      return
    }
    handleSendReview()
    setAlertState({ ...alertState, success: true })
  }

  const getStarArr = (rating: number) => {
    switch (rating) {
      case 0:
        return [0, 0, 0, 0, 0];
      case 1:
        return [1, 0, 0, 0, 0];
      case 2:
        return [1, 1, 0, 0, 0];
      case 3:
        return [1, 1, 1, 0, 0];
      case 4:
        return [1, 1, 1, 1, 0];
      case 5:
        return [1, 1, 1, 1, 1];
      default:
        return [0, 0, 0, 0, 0];
    }
  }

  useEffect(() => {
    if (formState.error && !formState?.loading) {
      showToast(ToastType.Error, formState.result)
    }
    if (!formState.loading && !formState.error && alertState.success) {
      showToast(ToastType.Success, t('REVIEW_SUCCESS_CONTENT', 'Thank you, Review successfully submitted!'))
    }
  }, [formState.result])

  useEffect(() => {
    if (alertState.open) {
      alertState.content && showToast(
        ToastType.Error,
        alertState.content
      )
    }
  }, [alertState.content])

  const getStar = (star: number, index: number, category: string) => {
    switch (star) {
      case 0:
        return (
          <TouchableOpacity key={index} onPress={() => handleChangeRating({ target: { name: category, value: index + 1 } })}>
            <MaterialCommunityIcon name='star-outline' size={24} color={colors.backgroundDark} />
          </TouchableOpacity>
        )
      case 1:
        return (
          <TouchableOpacity key={index} onPress={() => handleChangeRating({ target: { name: category, value: index + 1 } })}>
            <MaterialCommunityIcon name='star' size={24} color={colors.primary} />
          </TouchableOpacity>
        )
    }
  }

  return (
    <ReviewOrderContainer>
      <NavBar
        title={t('REVIEW_ORDER', 'Review your Order')}
        titleAlign={'center'}
        onActionLeft={() => navigation.goBack()}
        showCall={false}
        btnStyle={{ paddingLeft: 0 }}
        paddingTop={0}
      />
      <BusinessLogo>
        <OIcon url={order?.logo} width={100} height={100} />
      </BusinessLogo>
      <FormReviews>
        {Object.values(categories).map(category => (
          <Category key={category.name}>
            <OText>{category.show}</OText>
            <Stars>
              {getStarArr(stars[category?.name]).map((star, index) => getStar(star, index, category.name))}
            </Stars>
          </Category>
        ))}
        <OInput
          name='comments'
          placeholder={t('COMMENTS', 'Comments')}
          onChange={(val: string) => handleChangeInput(val)}
          style={styles.inputTextArea}
          multiline
          bgColor={colors.inputDisabled}
        />
      </FormReviews>
      <OButton
        textStyle={{ color: colors.white }}
        style={{ marginTop: 20 }}
        text={t('SAVE', 'Save')}
        imgRightSrc=''
        onClick={onSubmit}
      />
      <Spinner visible={formState.loading} />
    </ReviewOrderContainer>
  )
}

const styles = StyleSheet.create({
  inputTextArea: {
    borderColor: colors.secundaryContrast,
    borderRadius: 10,
    marginVertical: 20,
    height: 150,
    alignItems: 'flex-start'
  }
})

export const ReviewOrder = (props: ReviewOrderParams) => {
  const reviewOrderProps = {
    ...props,
    UIComponent: ReviewOrderUI
  }
  return <ReviewOrderController {...reviewOrderProps} />
}
