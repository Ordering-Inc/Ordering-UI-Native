import React, { useState, useEffect } from 'react'
import { OrderReview as ReviewOrderController, useLanguage, useToast, ToastType } from 'ordering-components/native'
import { useForm, Controller } from 'react-hook-form'
import LinearGradient from 'react-native-linear-gradient'

import {
  ReviewOrderContainer,
  BusinessLogo,
  FormReviews,
  CommentsButtonGroup,
  ActionContainer,
  SkipButton,
  RatingBarContainer,
  RatingTextContainer,
  MultiLogosContainer
} from './styles'
import { OButton, OIcon, OInput, OText } from '../shared'
import { TouchableOpacity, StyleSheet, View, I18nManager } from 'react-native';
import NavBar from '../NavBar'
import { FloatingBottomContainer } from '../../layouts/FloatingBottomContainer'
import Spinner from 'react-native-loading-spinner-overlay'

import { ReviewOrderParams } from '../../types'
import { useTheme } from 'styled-components/native'

import { reviewCommentList } from '../../../../../src/utils'

export const ReviewOrderUI = (props: ReviewOrderParams) => {
  const {
    order,
    stars,
    handleSendReview,
    formState,
    navigation,
    setStars,
    onNavigationRedirect,
    handleReviewState,
    setIsReviewed
  } = props

  const theme = useTheme()

  const styles = StyleSheet.create({
    logoWrapper: {
      shadowColor: theme.colors.black,
      shadowRadius: 3,
      shadowOffset: { width: 1, height: 4 },
      elevation: 3,
      borderRadius: 8,
      shadowOpacity: 0.1,
      overflow: 'hidden'
    },
    inputTextArea: {
      borderColor: theme.colors.lightGray,
      borderRadius: 8,
      marginTop: 10,
      marginBottom: 40,
      height: 100,
      alignItems: 'flex-start'
    },
    statusBar: {
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
      height: 10,
      borderRadius: 5,
      marginTop: 5
    },
    ratingItemContainer: {
      position: 'absolute',
      top: -20
    },
    ratingItem: {
      left: '-50%',
      flexDirection: 'column',
      alignItems: 'center'
    },
    ratingLineStyle: {
      height: 10,
      width: 1,
      marginBottom: 10,
      backgroundColor: theme.colors.dusk
    },
    reviewedStyle: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 20
    },
  })

  const [, t] = useLanguage()
  const [, { showToast }] = useToast()
  const { handleSubmit, control, errors } = useForm()

  const [alertState, setAlertState] = useState<{ open: boolean, content: Array<any>, success?: boolean }>({ open: false, content: [], success: false })
  const [comments, setComments] = useState<Array<any>>([])
  const [extraComment, setExtraComment] = useState('')
  const [enableProduct, setEnableProduct] = useState(true)

  const onSubmit = () => {
    if (Object.values(stars).some((value: any) => value === 0)) {
      setAlertState({
        open: true,
        content: stars.quality === 0 ? [`${t('REVIEW_QUALIFICATION_REQUIRED', 'Review qualification is required')}`] : []
      })
      return
    }
    handleSendReview()
    handleReviewState && handleReviewState(order?.id)
    setIsReviewed && setIsReviewed(true)
    setAlertState({ ...alertState, success: true })
    !enableProduct && navigation?.canGoBack() && navigation.goBack()
  }

  const qualificationList = [
    { key: 1, text: t('TERRIBLE', 'Terrible'), percent: 0, parentStyle: { left: '0%' }, isInnerStyle: false, pointerColor: false },
    { key: 2, text: t('BAD', 'Bad'), percent: 0.25, parentStyle: { left: '25%' }, isInnerStyle: true, pointerColor: true },
    { key: 3, text: t('OKAY', 'Okay'), percent: 0.5, parentStyle: { left: '50%' }, isInnerStyle: true, pointerColor: true },
    { key: 4, text: t('GOOD', 'Good'), percent: 0.75, parentStyle: { left: '75%' }, isInnerStyle: true, pointerColor: true },
    { key: 5, text: t('GREAT', 'Great'), percent: 1, parentStyle: { right: '0%' }, isInnerStyle: false, pointerColor: false }
  ]

  const commentsList = reviewCommentList('order')

  const handleChangeStars = (index: number) => {
    if (index) setStars({ ...stars, quality: index, punctiality: index, service: index, packaging: index, comments: '' })
    setComments([])
  }

  const handleChangeComment = (commentItem: any) => {
    const found = comments.find((comment: any) => comment?.key === commentItem.key)
    if (found) {
      const _comments = comments.filter((comment: any) => comment?.key !== commentItem.key)
      setComments(_comments)
    } else {
      setComments([...comments, commentItem])
    }
  }

  const isSelectedComment = (commentKey: number) => {
    const found = comments.find((comment: any) => comment?.key === commentKey)
    return found
  }

  const handleContinueClick = () => {
    if (!order?.review) {
      onSubmit()
    } else {
      skipOrderReview()
    }
  }

  const skipOrderReview = () => {
    if (enableProduct) onNavigationRedirect('ReviewProducts', { order: order })
    else if (order?.driver && !order?.user_review) {
      onNavigationRedirect('ReviewDriver', { order: order })
    } else {
      navigation?.canGoBack() && navigation.goBack()
    }
  }

  useEffect(() => {
    if (formState.error && !formState?.loading) {
      showToast(ToastType.Error, formState.result)
    }
    if (!formState.loading && !formState.error && alertState.success) {
      showToast(ToastType.Success, t('ORDER_REVIEW_SUCCESS_CONTENT', 'Thank you, Order review successfully submitted!'))
      onNavigationRedirect && onNavigationRedirect('ReviewProducts', { order: order })
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
  }, [errors])

  useEffect(() => {
    if (alertState.open) {
      alertState.content && showToast(
        ToastType.Error,
        alertState.content
      )
    }
  }, [alertState.content])

  useEffect(() => {
    let _comments = ''
    if (comments.length > 0) {
      comments.map(comment => _comments += comment.content + '. ')
    }
    let _comment
    _comment = _comments + extraComment
    setStars({ ...stars, comments: _comment })
  }, [comments, extraComment])

  useEffect(() => {
    setEnableProduct(!order?.products.every(product => product?.deleted))
  }, [order])

  return (
    <>
      <ReviewOrderContainer>
        <NavBar
          title={t('REVIEW_ORDER', 'Review your Order')}
          titleAlign={'center'}
          onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
          showCall={false}
          btnStyle={{ paddingLeft: 0 }}
          style={{ flexDirection: 'column', alignItems: 'flex-start' }}
          titleWrapStyle={{ paddingHorizontal: 0 }}
          titleStyle={{ marginRight: 0, marginLeft: 0 }}
        />
        <BusinessLogo isMulti={order?.business?.length > 1}>
          {typeof order?.logo === 'string' || !order?.logo ? (
            <View style={styles.logoWrapper}>
              <OIcon
                url={order?.logo}
                width={80}
                height={80}
              />
            </View>
          ) : (
            <MultiLogosContainer>
              {order?.logo?.map((logo: string, i: number) => (
                <React.Fragment key={logo}>
                  <View style={styles.logoWrapper}>
                    <OIcon
                      url={logo}
                      width={80}
                      height={80}
                    />
                  </View>
                </React.Fragment>
              ))}
            </MultiLogosContainer>
          )}
        </BusinessLogo>
        {order?.review ? (
          <View style={styles.reviewedStyle}>
            <OText color={theme.colors.primary}>{t('ORDER_REVIEWED', 'This order has been already reviewed')}</OText>
          </View>
        ) : (
          <View style={{ flex: 1, justifyContent: 'flex-end' }}>
            <FormReviews>
              <OText mBottom={13} color={theme.colors.textNormal}>{t('HOW_WAS_YOUR_ORDER', 'How was your order?')}</OText>
              <RatingBarContainer>
                <LinearGradient
                  start={{ x: 0.0, y: 0.0 }}
                  end={{ x: qualificationList[stars.quality - 1]?.percent || 0, y: 0 }}
                  locations={[.9999, .9999]}
                  colors={[theme.colors.primary, theme.colors.backgroundGray200]}
                  style={styles.statusBar}
                />
                <RatingTextContainer>
                  {qualificationList.map((qualification: any) => (
                    <View
                      key={qualification.key}
                      style={{ ...qualification.parentStyle, ...styles.ratingItemContainer }}
                    >
                      <TouchableOpacity
                        style={qualification.isInnerStyle && styles.ratingItem}
                        onPress={() => handleChangeStars(qualification.key)}
                      >
                        <View
                          style={{
                            ...styles.ratingLineStyle,
                            backgroundColor: (qualification.pointerColor && !(stars.quality >= qualification.key)) ? theme.colors.dusk : 'transparent'
                          }}
                        />
                        <OText size={12} color={stars.quality === qualification.key ? theme.colors.black : theme.colors.backgroundGray200}>{qualification.text}</OText>
                      </TouchableOpacity>
                    </View>
                  ))}
                </RatingTextContainer>
              </RatingBarContainer>

              <OText style={{ marginTop: 30 }} color={theme.colors.textNormal}>
                {commentsList[stars?.quality || 1]?.title}
              </OText>
              <CommentsButtonGroup>
                {commentsList[stars?.quality || 1]?.list?.map(commentItem => (
                  <OButton
                    key={commentItem.key}
                    text={commentItem.content}
                    bgColor={isSelectedComment(commentItem.key) ? theme.colors.primary : theme.colors.backgroundGray200}
                    borderColor={isSelectedComment(commentItem.key) ? theme.colors.primary : theme.colors.backgroundGray200}
                    textStyle={{
                      color: isSelectedComment(commentItem.key) ? theme.colors.white : theme.colors.black,
                      fontSize: 13,
                      paddingRight: isSelectedComment(commentItem.key) ? 15 : 0
                    }}
                    style={{ height: 35, paddingLeft: 5, paddingRight: 5, marginHorizontal: 3, marginVertical: 10 }}
                    imgRightSrc={isSelectedComment(commentItem.key) ? theme.images.general.close : null}
                    imgRightStyle={{ tintColor: theme.colors.white, right: 5, margin: 5 }}
                    onClick={() => handleChangeComment(commentItem)}
                  />
                ))}
              </CommentsButtonGroup>

              <OText style={{ marginTop: 30 }} color={theme.colors.textNormal}>{t('REVIEW_COMMENT_QUESTION', 'Do you want to add something?')}</OText>
              <Controller
                control={control}
                defaultValue=''
                name='comments'
                render={({ onChange }: any) => (
                  <OInput
                    name='comments'
                    onChange={(val: any) => {
                      onChange(val)
                      setExtraComment(val.target.value)
                    }}
                    style={styles.inputTextArea}
                    multiline
                  />
                )}
              />
            </FormReviews>
          </View>
        )}
        <Spinner visible={formState.loading} />
      </ReviewOrderContainer>
      <FloatingBottomContainer>
        <ActionContainer>
          <SkipButton
            onPress={() => skipOrderReview()}
          >
            <OText weight={700} size={18} color={theme.colors.textNormal}>{t('FRONT_VISUALS_SKIP', 'Skip')}</OText>
          </SkipButton>
          <OButton
            textStyle={{ paddingRight: 10 }}
            text={t('CONTINUE', 'Continue')}
            style={{ borderRadius: 8 }}
            imgRightSrc={theme.images.general.arrow_right}
            imgRightStyle={{ tintColor: theme.colors.white, right: 5, margin: 5 }}
            onClick={handleSubmit(handleContinueClick)}
          />
        </ActionContainer>
      </FloatingBottomContainer>
    </>
  )
}

export const ReviewOrder = (props: ReviewOrderParams) => {
  const reviewOrderProps = {
    ...props,
    UIComponent: ReviewOrderUI,
    defaultStar: props?.defaultStar || 5
  }
  return <ReviewOrderController {...reviewOrderProps} />
}
