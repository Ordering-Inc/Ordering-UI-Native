

import React, { useState, useEffect, useRef } from 'react'
import {
  useLanguage,
  useUtils,
  ReviewCustomer as ReviewCustomerController
} from 'ordering-components/native'
import {
  KeyboardAvoidingView,
  Platform,
  View,
  StyleSheet,
  I18nManager,
  TouchableOpacity,
  Keyboard
} from 'react-native'
import { useTheme } from 'styled-components/native'
import { ReviewCustomerParams } from '../../types'
import { OButton, OText, OIconButton, OIcon, OInput } from '../shared'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { FloatingButton } from '../FloatingButton'
import LinearGradient from 'react-native-linear-gradient'
import Alert from '../../providers/AlertProvider'

import { reviewCommentList } from '../../../../../src/utils'

import {
  Content,
  ActionButtonWrapper,
  CustomerInfoContainer,
  RatingBarContainer,
  RatingTextContainer,
  CommentsButtonGroup
} from './styles'

const ReviewCustomerUI = (props: ReviewCustomerParams) => {
  const {
    order,
    closeModal,
    reviewState,
    setReviewState,
    actionState,
    handleSendCustomerReview,
    handleCustomCustomerReview
  } = props

  const theme = useTheme()
  const [, t] = useLanguage()
  const [{ optimizeImage }] = useUtils()
  const [alertState, setAlertState] = useState<{
    open: boolean;
    content: Array<string>;
    key?: string | null;
  }>({ open: false, content: [] })
  const { top, bottom } = useSafeAreaInsets()
  const [comments, setComments] = useState<Array<any>>([])
  const [extraComment, setExtraComment] = useState('')
  const scrollref = useRef<any>()
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
    statusBar: {
      transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
      height: 8,
      borderRadius: 5,
      marginTop: 5
    },
    ratingItemContainer: {
      position: 'absolute',
      top: -18
    },
    ratingItem: {
      left: '-50%',
      flexDirection: 'column',
      alignItems: 'center'
    },
    ratingLineStyle: {
      height: 8,
      width: 1,
      marginBottom: 10,
      backgroundColor: theme.colors.lightGray
    },
    btnBackArrow: {
      borderWidth: 0,
      width: 32,
      height: 32,
      tintColor: theme.colors.textGray,
      backgroundColor: theme.colors.clear,
      borderColor: theme.colors.clear,
      shadowColor: theme.colors.clear,
      paddingLeft: 0,
      paddingRight: 0,
      marginBottom: 20
    },
    inputTextArea: {
      borderColor: theme.colors.lightGray,
      borderRadius: 8,
      marginTop: 10,
      marginBottom: 40,
      height: 100,
      alignItems: 'flex-start'
    }
  })

  const qualificationList = [
    { key: 1, text: t('TERRIBLE', 'Terrible'), percent: 0, parentStyle: { left: '0%' }, isInnerStyle: false, pointerColor: false },
    { key: 2, text: t('BAD', 'Bad'), percent: 0.25, parentStyle: { left: '25%' }, isInnerStyle: true, pointerColor: true },
    { key: 3, text: t('OKAY', 'Okay'), percent: 0.5, parentStyle: { left: '50%' }, isInnerStyle: true, pointerColor: true },
    { key: 4, text: t('GOOD', 'Good'), percent: 0.75, parentStyle: { left: '75%' }, isInnerStyle: true, pointerColor: true },
    { key: 5, text: t('GREAT', 'Great'), percent: 1, parentStyle: { right: '0%' }, isInnerStyle: false, pointerColor: false }
  ]

  const commentsList = reviewCommentList('customer')

  const handleChangeQualification = (index: any) => {
    if (index) setReviewState({ ...reviewState, qualification: index, comment: '' })
    setComments([])
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

  useEffect(() => {
    let _comments = ''
    if (comments.length > 0) {
      comments.map((comment: any) => (_comments += comment.content + '. '))
    }
    const _comment = _comments + extraComment
    setReviewState({ ...reviewState, comment: _comment })
  }, [comments, extraComment])

  useEffect(() => {
    if (!actionState.error) return
    setAlertState({
      open: true,
      content: actionState.error
    })

  }, [actionState.error])

  useEffect(() => {
    if (scrollref?.current) {
      Keyboard.addListener('keyboardDidShow', () => {
        scrollref?.current?.scrollToEnd && scrollref.current.scrollToEnd()
      })
    }
  }, [scrollref?.current])

  const customerName = `${order?.customer?.name ?? ''} ${order?.customer?.middle_name ?? ''} ${order?.customer?.lastname ?? ''} ${order?.customer?.second_lastname ?? ''}`?.replace('  ', ' ')?.trim() ?? ''

  const handleReviewClick = () => {
    handleCustomCustomerReview
      ? handleCustomCustomerReview({
        qualification: reviewState?.qualification,
        comment: reviewState?.comment
      })
      : handleSendCustomerReview()
  }

  return (
    <KeyboardAvoidingView
      enabled
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 28,
        marginTop: top,
        marginBottom: bottom,
        justifyContent: 'space-between'
      }}
    >
      <View>
        <TouchableOpacity onPress={() => closeModal()} style={styles.btnBackArrow}>
          <OIcon src={theme.images.general.arrow_left} color={theme.colors.textGray} />
        </TouchableOpacity>
        <OText
          size={20}
          weight="600"
        >
          {t('REVIEW_CUSTOMER', 'Review customer')}
        </OText>
      </View>

      <Content
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        ref={scrollref}
      >
        <CustomerInfoContainer>
          <View
            style={{
              ...styles.photoWrapper,
              backgroundColor: theme.colors.white,
              padding: !order?.customer?.photo ? 5 : 0
            }}
          >
            <OIcon
              url={optimizeImage(order?.customer?.photo, 'h_100,c_limit')}
              src={!order?.customer?.photo && theme.images.general.user}
              width={72}
              height={72}
              style={{ borderRadius: 7.6 }}
            />
          </View>
          {!!customerName && <OText
            size={14}
            weight="500"
            style={{
              marginTop: 16
            }}
          >
            {customerName}
          </OText>}
        </CustomerInfoContainer>
        <OText
          size={12}
        >
          {customerName ? t('HOW_WAS_YOUR_CUSTOMER', 'How was your experience with _name_?').replace('_name_', customerName) : t('HOW_WAS_YOUR_NO_CUSTOMER', 'How was your experience?')}
        </OText>
        <RatingBarContainer>
          <LinearGradient
            start={{ x: 0.0, y: 0.0 }}
            end={{ x: qualificationList[reviewState?.qualification - 1]?.percent || 0, y: 0 }}
            locations={[.9999, .9999]}
            colors={[theme.colors.primary, theme.colors.tabBar]}
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
                      backgroundColor: (qualification.pointerColor && !(reviewState?.qualification >= qualification.key)) ? theme.colors.dusk : 'transparent'
                    }}
                  />
                  <OText
                    size={12}
                    color={
                      reviewState?.qualification === qualification.key
                        ? theme.colors.darkText
                        : theme.colors.lightGray
                    }
                  >
                    {qualification.text}
                  </OText>
                </TouchableOpacity>
              </View>
            ))}
          </RatingTextContainer>
        </RatingBarContainer>
        <OText
          size={12}
          style={{ marginTop: 30 }}
        >
          {commentsList[reviewState?.qualification || 1]?.title}
        </OText>
        <CommentsButtonGroup>
          {commentsList[reviewState?.qualification || 1]?.list?.map(commentItem => (
            <OButton
              key={commentItem.key}
              text={commentItem.content}
              bgColor={isSelectedComment(commentItem.key) ? theme.colors.primary : theme.colors.tabBar}
              borderColor={isSelectedComment(commentItem.key) ? theme.colors.primary : theme.colors.tabBar}
              textStyle={{
                color: isSelectedComment(commentItem.key) ? theme.colors.white : theme.colors.darkText,
                fontSize: 12,
                paddingRight: isSelectedComment(commentItem.key) ? 15 : 0
              }}
              style={{ height: 35, paddingLeft: 5, paddingRight: 5, marginHorizontal: 3, marginVertical: 10 }}
              imgRightSrc={isSelectedComment(commentItem.key) ? theme.images.general.close : null}
              imgRightStyle={{ right: 5, margin: 5 }}
              onClick={() => handleChangeComment(commentItem)}
            />
          ))}
        </CommentsButtonGroup>
        <OText
          size={12}
          style={{ marginTop: 30 }}
        >
          {t('REVIEW_COMMENT_QUESTION', 'Do you want to add something?')}
        </OText>
        <OInput
          name='comments'
          onChange={(val: any) => setExtraComment(val.target.value)}
          style={styles.inputTextArea}
          multiline
        />
      </Content>

      <ActionButtonWrapper>
        <FloatingButton
          firstButtonClick={() => handleReviewClick()}
          btnText={actionState.loading ? t('LOADING', 'Loading') : t('SEND_REVIEW', 'Send Review')}
          color={theme.colors.primary}
          widthButton={'100%'}
        />
      </ActionButtonWrapper>
      <Alert
        open={alertState.open}
        onAccept={() => setAlertState({ open: false, content: [] })}
        onClose={() => setAlertState({ open: false, content: [] })}
        content={alertState.content}
        title={t('ERROR', 'Error')}
      />
    </KeyboardAvoidingView>
  )
}

export const ReviewCustomer = (props: any) => {
  const reviewCustomerProps = {
    ...props,
    UIComponent: ReviewCustomerUI
  }
  return <ReviewCustomerController {...reviewCustomerProps} />
}
