import React, { useState, useEffect } from 'react'
import { OrderReview as ReviewOrderController, useLanguage } from 'ordering-components/native'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { useForm, Controller } from 'react-hook-form'

import {
  ReviewOrderContainer,
  BusinessLogo,
  FormReviews,
  Category,
  Stars
} from './styles'
import { OButton, OIcon, OInput, OText } from '../shared'
import { TouchableOpacity, StyleSheet,View } from 'react-native';
import { useToast, ToastType } from '../../providers/ToastProvider'
import NavBar from '../NavBar'
import Spinner from 'react-native-loading-spinner-overlay'

import { ReviewOrderParams } from '../../types'

export const ReviewOrderUI = (props: ReviewOrderParams) => {
  const {
    theme,
    order,
    stars,
    handleChangeInput,
    handleChangeRating,
    handleSendReview,
    formState,
    navigation
  } = props

  const styles = StyleSheet.create({
    inputTextArea: {
      borderColor: theme.colors.secundaryContrast,
      borderRadius: 10,
      marginVertical: 20,
      height: 100,
      alignItems: 'flex-start'
    }
  })

  const [, t] = useLanguage()
  const { showToast } = useToast()
  const { handleSubmit, control, errors } = useForm()

  const [alertState, setAlertState] = useState<{ open: boolean, content: Array<any>, success?: boolean }>({ open: false, content: [], success: false })

  const categories = {
    quality: { name: 'quality', show: t('QUALITY', 'Quality of Product') },
    punctuality: { name: 'punctiality', show: t('PUNCTUALITY', 'Punctuality') },
    service: { name: 'service', show: t('SERVICE', 'Service') },
    packaging: { name: 'packaging', show: t('PRODUCT_PACKAGING', 'Product Packaging') }
  }

  const onSubmit = () => {
    if (Object.values(stars).some((value: any) => value === 0)) {
      setAlertState({
        open: true,
        content: Object.values(categories).map((category: any, i: any) => stars[category.name] === 0 ? `- ${t('CATEGORY_ATLEAST_ONE', `${category.show} must be at least one point`).replace('CATEGORY', category.name.toUpperCase())} ${i !== 3 && '\n'}` : ' ')
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
      navigation?.canGoBack() && navigation.goBack()
    }
  }, [formState.result])

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      // Convert all errors in one string to show in toast provider
      const list = Object.values(errors);
      let stringError = '';
      list.map((item: any, i: number) => {
        stringError +=
          i + 1 === list.length ? `- ${item.message}` : `- ${item.message}\n`;
      });
      showToast(ToastType.Error, stringError);
    }
  }, [errors]);

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
            <MaterialCommunityIcon name='star-outline' size={24} color={theme.colors.backgroundDark} />
          </TouchableOpacity>
        )
      case 1:
        return (
          <TouchableOpacity key={index} onPress={() => handleChangeRating({ target: { name: category, value: index + 1 } })}>
            <MaterialCommunityIcon name='star' size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        )
    }
  }

  return (
    <ReviewOrderContainer>
      <NavBar
        title={t('REVIEW_ORDER', 'Review your Order')}
        titleAlign={'center'}
        onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
        showCall={false}
        btnStyle={{ paddingLeft: 0 }}
        paddingTop={0}
        theme={theme}
      />
      <BusinessLogo>
        <OIcon
          colors={theme.colors}
          url={order?.logo}
          width={100}
          height={100}
        />
      </BusinessLogo>
      <View style={{flex: 1, justifyContent: 'flex-end'}}>

      <FormReviews>
        {Object.values(categories).map((category: any) => (
          <Category
            key={category.name}
            colors={theme.colors}
          >
            <OText>{category.show}</OText>
            <Stars>
              {getStarArr(stars[category?.name]).map((star, index) => getStar(star, index, category.name))}
            </Stars>
          </Category>
        ))}
        <Controller
          control={control}
          defaultValue=''
          name='comments'
          render={({ onChange }: any) => (
            <OInput
              colors={theme.colors}
              name='comments'
              placeholder={t('COMMENTS', 'Comments')}
              onChange={(val: string) => {
                onChange(val)
                handleChangeInput(val)
              }}
              style={styles.inputTextArea}
              multiline
              bgColor={theme.colors.inputDisabled}
            />
          )}
        />
      </FormReviews>
      <OButton
        colors={theme.colors}
        textStyle={{ color: theme.colors.white }}
        style={{ marginTop: 20 }}
        text={t('SAVE', 'Save')}
        imgRightSrc=''
        onClick={handleSubmit(onSubmit)}
        />
        </View>
      <Spinner visible={formState.loading} />
    </ReviewOrderContainer>
  )
}

export const ReviewOrder = (props: ReviewOrderParams) => {
  const reviewOrderProps = {
    ...props,
    UIComponent: ReviewOrderUI
  }
  return <ReviewOrderController {...reviewOrderProps} />
}
