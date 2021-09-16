import React, { useState, useEffect } from 'react'
import { useLanguage } from 'ordering-components/native'
import { StyleSheet, View, I18nManager, TouchableOpacity } from 'react-native'
import { ReviewDriverParams } from '../../types'
import { useTheme } from 'styled-components/native'
import { OText, OIcon, OButton, OInput } from '../shared'
import NavBar from '../NavBar'
import LinearGradient from 'react-native-linear-gradient'
import { FloatingBottomContainer } from '../../layouts/FloatingBottomContainer'

import {
  ReviewDriverContainer,
  DriverPhotoContainer,
  FormReviews,
  RatingBarContainer,
  RatingTextContainer,
  CommentsButtonGroup,
  ActionContainer,
} from './styles'

export const ReviewDriver = (props: ReviewDriverParams) => {
  const {
    order,
    navigation
  } = props
  const [, t] = useLanguage()
  const theme = useTheme()

  const styles = StyleSheet.create({
    photoWrapper: {
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

  const qualificationList = [
    { key: 1, text: t('TERRIBLE', 'Terrible'), percent: 0,  parentStyle: { left: '0%' }, isInnerStyle: false, pointerColor: false },
    { key: 2, text: t('BAD', 'Bad'), percent: 0.25, parentStyle: { left: '25%' }, isInnerStyle: true, pointerColor: true },
    { key: 3, text: t('OKAY', 'Okay'), percent: 0.5, parentStyle: { left: '50%' }, isInnerStyle: true, pointerColor: true },
    { key: 4, text: t('GOOD', 'Good'), percent: 0.75, parentStyle: { left: '75%' }, isInnerStyle: true, pointerColor: true },
    { key: 5, text: t('GREAT', 'Great'), percent: 1, parentStyle: { right: '0%' }, isInnerStyle: false,  pointerColor: false }
  ]

  const commentsList = [
    { key: 0, content: t('FAST_AND_EFFICIENT', "Fast and efficient") },
    { key: 1, content: t('DELIVERY_PERFECT', "Delivery perfect") },
    { key: 2, content: t('EXCELLENT_COMMUNICATION', "Excellent communication") },
    { key: 3, content: t('CORDIAL_SERVICE', 'Cordial service') }
  ]

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

  return (
    <>
      <ReviewDriverContainer>
        <NavBar
          title={t('REVIEW_DRIVER', 'Review driver')}
          titleAlign={'center'}
          onActionLeft={() => navigation?.canGoBack() && navigation.goBack()}
          showCall={false}
          btnStyle={{ paddingLeft: 0 }}
          paddingTop={0}
        />
        <DriverPhotoContainer>
          <View
            style={styles.photoWrapper}
          >
            <OIcon
              url={order?.driver?.photo}
              cover
              width={80}
              height={80}
            />
          </View>
          <OText weight={500} style={{ marginVertical: 10 }}>{order?.driver?.name} {order?.driver?.lastname}</OText>
        </DriverPhotoContainer>

        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          <FormReviews>
            <OText mBottom={13}>{t('HOW_WAS_YOUR_ORDER', 'How was your order?')}</OText>
            <RatingBarContainer>
              <LinearGradient
                start={{ x: 0.0, y: 0.0 }}
                end={{ x: 0.5 || 0, y: 0 }}
                locations={[.9999, .9999]}
                colors={[theme.colors.primary, theme.colors.lightGray]}
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
                      // onPress={() => handleChangeStars(qualification.key)}
                    >
                      <View
                        style={{
                          ...styles.ratingLineStyle,
                          backgroundColor: qualification.pointerColor ? theme.colors.dusk : 'transparent'
                        }}
                      />
                      <OText size={12} color={theme.colors.lightGray}>{qualification.text}</OText>
                    </TouchableOpacity>
                  </View>
                ))}
              </RatingTextContainer>
            </RatingBarContainer>

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
            <OInput
              name='comments'
              onChange={(val: any) => {
                setExtraComment(val.target.value)
              }}
              style={styles.inputTextArea}
              multiline
            />
          </FormReviews>
        </View>
      </ReviewDriverContainer>

      <FloatingBottomContainer>
        <ActionContainer>
          <OButton
            textStyle={{ color: theme.colors.white, paddingRight: 10 }}
            text={t('SEND_REVIEW', 'Send Review')}
            style={{ borderRadius: 8 }}
            imgRightStyle={{ tintColor: theme.colors.white, right: 5, margin: 5 }}
            // onClick={() => (!order?.review && !isReviewed) ? handleSubmit(onSubmit) : onNavigationRedirect('ReviewProducts', { order: order })}
          />
        </ActionContainer>
      </FloatingBottomContainer>
    </>
  )
}
