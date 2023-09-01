import React, { useState, useEffect } from 'react'
import { useLanguage, useToast, ToastType, ReviewDriver as ReviewDriverController } from 'ordering-components/native'
import { StyleSheet, View, I18nManager, TouchableOpacity } from 'react-native'
import { ReviewDriverParams } from '../../types'
import { useTheme } from 'styled-components/native'
import { useForm, Controller } from 'react-hook-form'
import { OText, OIcon, OButton, OInput } from '../shared'
import NavBar from '../NavBar'
import LinearGradient from 'react-native-linear-gradient'
import { FloatingBottomContainer } from '../../layouts/FloatingBottomContainer'
import Spinner from 'react-native-loading-spinner-overlay'

import { reviewCommentList } from '../../../../../src/utils'

import {
  ReviewDriverContainer,
  DriverPhotoContainer,
  FormReviews,
  RatingBarContainer,
  RatingTextContainer,
  CommentsButtonGroup,
  ActionContainer,
} from './styles'

const ReviewDriverUI = (props: ReviewDriverParams) => {
  const {
    order,
    navigation,
    formState,
    dirverReviews,
    setDriverReviews,
    handleSendDriverReview,
    onNavigationRedirect
  } = props

  const [, t] = useLanguage()
  const theme = useTheme()
  const { handleSubmit, control, errors } = useForm()
  const [, { showToast }] = useToast()

  const [isDriverReviewed, setIsDriverReviewed] = useState(false)

  const styles = StyleSheet.create({
    photoWrapper: {
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
    }
  })

  const [comments, setComments] = useState<Array<any>>([])
  const [extraComment, setExtraComment] = useState('')
  const [alertState, setAlertState] = useState<{ open: boolean, content: Array<any>, success?: boolean }>({ open: false, content: [], success: false })

  const qualificationList = [
    { key: 1, text: t('TERRIBLE', 'Terrible'), percent: 0, parentStyle: { left: '0%' }, isInnerStyle: false, pointerColor: false },
    { key: 2, text: t('BAD', 'Bad'), percent: 0.25, parentStyle: { left: '25%' }, isInnerStyle: true, pointerColor: true },
    { key: 3, text: t('OKAY', 'Okay'), percent: 0.5, parentStyle: { left: '50%' }, isInnerStyle: true, pointerColor: true },
    { key: 4, text: t('GOOD', 'Good'), percent: 0.75, parentStyle: { left: '75%' }, isInnerStyle: true, pointerColor: true },
    { key: 5, text: t('GREAT', 'Great'), percent: 1, parentStyle: { right: '0%' }, isInnerStyle: false, pointerColor: false }
  ]

  const commentsList = reviewCommentList('driver')

  const onSubmit = () => {
    if (dirverReviews?.qualification === 0) {
      setAlertState({
        open: true,
        content: dirverReviews?.qualification === 0 ? [`${t('REVIEW_QUALIFICATION_REQUIRED', 'Review qualification is required')}`] : []
      })
      return
    }
    handleSendDriverReview()
    setAlertState({ ...alertState, success: true })
  }

  const isSelectedComment = (commentKey: number) => {
    const found = comments.find((comment: any) => comment?.key === commentKey)
    return found
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

  const handleChangeQualification = (qualification: number) => {
    if (qualification) setDriverReviews({ ...dirverReviews, qualification: qualification, comment: '' })
    setComments([])
  }

  const handleSendReviewClick = () => {
    if (!order?.user_review && !isDriverReviewed) {
      onSubmit()
    } else {
      onNavigationRedirect('BottomTab', { screen: 'MyOrders' })
    }
  }

  useEffect(() => {
    if (!formState.loading && formState.result?.error) {
      setAlertState({
        open: true,
        success: false,
        content: formState.result?.result || [t('ERROR', 'Error')]
      })
    }
    if (!formState.loading && !formState.result?.error && alertState.success) {
      setIsDriverReviewed && setIsDriverReviewed(true)
      onNavigationRedirect('BottomTab', { screen: 'MyOrders' })
    }
  }, [formState])

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
      comments.map((comment: any) => (_comments += comment.content + '. '))
    }
    const _comment = _comments + extraComment
    setDriverReviews({ ...dirverReviews, comment: _comment })
  }, [comments, extraComment])

  return (
    <>
      <ReviewDriverContainer>
        <NavBar
          title={t('REVIEW_DRIVER', 'Review driver')}
          titleAlign={'center'}
          onActionLeft={() => onNavigationRedirect('BottomTab', { screen: 'MyOrders' })}
          showCall={false}
          btnStyle={{ paddingLeft: 0 }}
          style={{ flexDirection: 'column', alignItems: 'flex-start' }}
          titleWrapStyle={{ paddingHorizontal: 0 }}
          titleStyle={{ marginRight: 0, marginLeft: 0 }}
          buttonProps={{
            bgColor: theme.colors.white,
            borderColor: theme.colors.white,
            textStyle: { color: theme.colors.btnFont }
          }}
        />
        <DriverPhotoContainer>
          <View
            style={{
              ...styles.photoWrapper,
              backgroundColor: theme.colors.white,
              padding: !order?.driver?.photo ? 5 : 0
            }}
          >
            <OIcon
              url={order?.driver?.photo}
              src={!order?.driver?.photo && theme.images.general.user}
              cover={order?.driver?.photo ? true : false}
              width={80}
              height={80}
            />
          </View>
          <OText weight={500} style={{ marginVertical: 10 }} color={theme.colors.textNormal}>{order?.driver?.name} {order?.driver?.lastname}</OText>
        </DriverPhotoContainer>

        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <FormReviews>
            <OText mBottom={13} color={theme.colors.textNormal}>{t('HOW_WAS_YOUR_DRIVER', 'How was your driver?')}</OText>
            <RatingBarContainer>
              <LinearGradient
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: qualificationList[dirverReviews?.qualification - 1]?.percent || 0, y: 0 }}
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
                      onPress={() => handleChangeQualification(qualification.key)}
                    >
                      <View
                        style={{
                          ...styles.ratingLineStyle,
                          backgroundColor: (qualification.pointerColor && !(dirverReviews?.qualification >= qualification.key)) ? theme.colors.dusk : 'transparent'
                        }}
                      />
                      <OText size={12} color={dirverReviews?.qualification === qualification.key ? theme.colors.black : theme.colors.lightGray}>{qualification.text}</OText>
                    </TouchableOpacity>
                  </View>
                ))}
              </RatingTextContainer>
            </RatingBarContainer>

            <OText style={{ marginTop: 30 }} color={theme.colors.textNormal}>
              {commentsList[dirverReviews?.qualification || 1]?.title}
            </OText>
            <CommentsButtonGroup>
              {commentsList[dirverReviews?.qualification || 1]?.list?.map(commentItem => (
                <OButton
                  key={commentItem.key}
                  text={commentItem.content}
                  bgColor={isSelectedComment(commentItem.key) ? theme.colors.primary : theme.colors.backgroundGray200}
                  borderColor={isSelectedComment(commentItem.key) ? theme.colors.primary : theme.colors.backgroundGray200}
                  textStyle={{
                    color: isSelectedComment(commentItem.key) ? theme.colors.white : theme.colors.textNormal,
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
      </ReviewDriverContainer>
      <Spinner visible={formState.loading} />
      <FloatingBottomContainer>
        <ActionContainer>
          <OButton
            textStyle={{ color: theme.colors.white, paddingRight: 10 }}
            text={t('SEND_REVIEW', 'Send Review')}
            style={{ borderRadius: 8 }}
            imgRightStyle={{ tintColor: theme.colors.white, right: 5, margin: 5 }}
            onClick={handleSubmit(handleSendReviewClick)}
          />
        </ActionContainer>
      </FloatingBottomContainer>
    </>
  )
}

export const ReviewDriver = (props: any) => {
  const reviewDriverProps = {
    ...props,
    UIComponent: ReviewDriverUI,
    isToast: true
  }
  return <ReviewDriverController {...reviewDriverProps} />
}
