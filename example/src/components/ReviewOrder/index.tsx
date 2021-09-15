import React, { useState, useEffect } from 'react'
import { OrderReview as ReviewOrderController, useLanguage, useToast, ToastType } from 'ordering-components/native'
import { useForm, Controller } from 'react-hook-form'

import {
  ReviewOrderContainer,
  BusinessLogo,
  FormReviews,
  Stars,
  CommentsButtonGroup,
  ActionContainer,
  SkipButton
} from './styles'
import { OButton, OIcon, OInput, OText } from '../shared'
import { TouchableOpacity, StyleSheet,View } from 'react-native';
import NavBar from '../NavBar'
import { FloatingBottomContainer } from '../../layouts/FloatingBottomContainer'
import Spinner from 'react-native-loading-spinner-overlay'

import { ReviewOrderParams } from '../../types'
import { useTheme } from 'styled-components/native'

export const ReviewOrderUI = (props: ReviewOrderParams) => {
  const {
    order,
    stars,
    handleSendReview,
    formState,
    navigation,
    setIsReviewed,
    setStars,
    onNavigationRedirect
  } = props

  const theme = useTheme()

  const styles = StyleSheet.create({
    logoWrapper: {
      shadowColor: theme.colors.black,
      shadowRadius: 3,
      shadowOffset: {width: 1, height: 4},
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
    ratingItemContainer: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center'
    }
  })

  const [, t] = useLanguage()
  const [, { showToast }] = useToast()
  const { handleSubmit, control, errors } = useForm()

  const [alertState, setAlertState] = useState<{ open: boolean, content: Array<any>, success?: boolean }>({ open: false, content: [], success: false })
  const [comments, setComments] = useState<Array<any>>([])
  const [extraComment, setExtraComment] = useState('')

  const onSubmit = () => {
    if (Object.values(stars).some((value: any) => value === 0)) {
      setAlertState({
        open: true,
        content: stars.quality === 0 ? [`${t('REVIEW_QUALIFICATION_REQUIRED', 'Review qualification is required')}`] : []
      })
      return
    }
    handleSendReview()
    setIsReviewed && setIsReviewed(true)
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

  const getReviewText = (index: number) => {
    switch (index) {
      case 0:
        return t('TERRIBLE', 'Terrible');
      case 1:
        return t('BAD', 'Bad');
      case 2:
        return t('OKAY', 'Okay');
      case 3:
        return t('GOOD', 'Good');
      case 4:
        return t('GREAT', 'Great');
      default:
        return ''
    }
  }

  const commentsList = [
    { key: 0, content: t('IT_WASNT_TASTY', "It wasn't tasty") },
    { key: 1, content: t('IT_DOESNT_PACK_WELL', "It doesn't pack well") },
    { key: 2, content: t('IT_ISNT_WORTH_WHAT_IT_COSTS', "It isn't worth what it costs") },
    { key: 3, content: t('TOO_SLOW', 'Too slow') },
    { key: 4, content: t('SUSTAINABLE_PACKAGING_WASNT_USED', "Sustainable packaging wasn't used") },
    { key: 5, content: t('THEY_DID_NOT_FOLLOW_THE_ORDER_NOTES', 'They did not follow the order notes') }
  ]

  const handleChangeStars = (index: number) => {
    switch (index) {
      case 1:
        setStars({ ...stars, quality: 1, punctiality: 1, service: 1, packaging: 1 })
        break
      case 2:
        setStars({ ...stars, quality: 2, punctiality: 2, service: 2, packaging: 2 })
        break
      case 3:
        setStars({ ...stars, quality: 3, punctiality: 3, service: 3, packaging: 3 })
        break
      case 4:
        setStars({ ...stars, quality: 4, punctiality: 4, service: 4, packaging: 4 })
        break
      case 5:
        setStars({ ...stars, quality: 5, punctiality: 5, service: 5, packaging: 5 })
        break
    }
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
  }, [errors]);

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
    _comment = _comments  + extraComment
    setStars({ ...stars, comments: _comment })
  }, [comments, extraComment])

  const getStar = (star: number, index: number) => {
    switch (star) {
      case 0:
        return (
          <TouchableOpacity
            key={index}
            onPress={() => handleChangeStars(index + 1)}
            style={styles.ratingItemContainer}
          >
            <View
              style={{
                backgroundColor: theme.colors.lightGray,
                width: '100%',
                height: 8,
                borderRightWidth: index === 4 ? 0 : 1,
                borderRightColor: theme.colors.dusk,
                borderTopLeftRadius: index === 0 ? 5 : 0,
                borderBottomLeftRadius: index === 0 ? 5 : 0,
                borderTopRightRadius: index === 4 ? 5 : 0,
                borderBottomRightRadius: index === 4 ? 5 : 0,
                marginBottom: 9
              }}
            />
            <OText numberOfLines={1} size={12} color={theme.colors.lightGray}>{getReviewText(index)}</OText>
          </TouchableOpacity>
        )
      case 1:
        return (
          <TouchableOpacity
            key={index}
            onPress={() => handleChangeStars(index + 1)}
            style={styles.ratingItemContainer}
          >
            <View
              style={{
                backgroundColor: theme.colors.primary,
                width: '100%',
                height: 8,
                borderRightWidth: index === 4 ? 0 : 1,
                borderRightColor: theme.colors.primary,
                borderTopLeftRadius: index === 0 ? 5 : 0,
                borderBottomLeftRadius: index === 0 ? 5 : 0,
                borderTopRightRadius: index === 4 ? 5 : 0,
                borderBottomRightRadius: index === 4 ? 5 : 0,
                marginBottom: 9
              }}
            />
            <OText numberOfLines={1} size={12} color={theme.colors.lightGray}>{getReviewText(index)}</OText>
          </TouchableOpacity>
        )
    }
  }

  return (
    <>
      <ReviewOrderContainer>
        <NavBar
          title={t('REVIEW_ORDER', 'Review your Order')}
          titleAlign={'center'}
          onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
          showCall={false}
          btnStyle={{ paddingLeft: 0 }}
          paddingTop={0}
        />
        <BusinessLogo>
          <View style={styles.logoWrapper}>
            <OIcon
              url={order?.logo}
              width={80}
              height={80}
            />
          </View>
        </BusinessLogo>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <FormReviews>
            <OText mBottom={13}>{t('HOW_WAS_YOUR_ORDER', 'How was your order?')}</OText>
            <Stars>
              {getStarArr(stars?.quality).map((star, index) => getStar(star, index))}
            </Stars>

            <OText style={{ marginTop: 30 }}>{t('COMMENTS', 'Comments')}</OText>
            <CommentsButtonGroup>
              {commentsList.map(commentItem => (
                <OButton
                  key={commentItem.key}
                  text={commentItem.content}
                  bgColor={isSelectedComment(commentItem.key) ? theme.colors.primary : theme.colors.lightGray}
                  borderColor={isSelectedComment(commentItem.key) ? theme.colors.primary : theme.colors.lightGray}
                  textStyle={{
                    color: isSelectedComment(commentItem.key) ? theme.colors.white : theme.colors.black,
                    fontSize: 13,
                    paddingRight: isSelectedComment(commentItem.key) ? 15 : 0
                  }}
                  style={{ height: 35, paddingLeft: 5, paddingRight: 5, marginHorizontal: 3, marginVertical: 10 }}
                  imgRightSrc={isSelectedComment(commentItem.key) ? theme.images.general.close : null}
                  imgRightStyle={{ tintColor: theme.colors.white, right: 5, margin: 5 }}
                  onClick={() => handleChangeComment(commentItem) }
                />
              ))}
            </CommentsButtonGroup>

            <OText style={{ marginTop: 30 }}>{t('REVIEW_COMMENT_QUESTION', 'Do you want to add something?')}</OText>
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
        <Spinner visible={formState.loading} />
      </ReviewOrderContainer>
      <FloatingBottomContainer>
        <ActionContainer>
          <SkipButton
            onPress={() => onNavigationRedirect('ReviewProducts', { order: order })}
          >
            <OText weight={700} size={18}>{t('FRONT_VISUALS_SKIP', 'Skip')}</OText>
          </SkipButton>
          <OButton
            textStyle={{ color: theme.colors.white, paddingRight: 10 }}
            text={t('CONTINUE', 'Continue')}
            style={{ borderRadius: 8 }}
            imgRightStyle={{ tintColor: theme.colors.white, right: 5, margin: 5 }}
            onClick={handleSubmit(onSubmit)}
          />
        </ActionContainer>
      </FloatingBottomContainer>
    </>
  )
}

export const ReviewOrder = (props: ReviewOrderParams) => {
  const reviewOrderProps = {
    ...props,
    UIComponent: ReviewOrderUI
  }
  return <ReviewOrderController {...reviewOrderProps} />
}
