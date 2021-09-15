import React, { useState } from 'react'
import { useLanguage } from 'ordering-components/native'
import { OText, OButton, OInput } from '../shared'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import AntDesignIcons from 'react-native-vector-icons/AntDesign'
import { useTheme } from 'styled-components/native'
import { SingleProductReviewParams } from '../../types'

import {
  ProductContainer,
  ProductHeader,
  LikeHandsActionContainer,
  LikeHandsButton,
  CommentsButtonGroup
} from './styles'

export const SingleProductReview = (props: SingleProductReviewParams) => {
  const {
    product
  } = props

  const [, t] = useLanguage()
  const theme = useTheme()

  const styles = StyleSheet.create({
    inputTextArea: {
      borderColor: theme.colors.lightGray,
      borderRadius: 8,
      marginTop: 10,
      marginBottom: 40,
      height: 100,
      alignItems: 'flex-start'
    },
    additionalCommentButton: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginVertical: 10
    }
  })

  const [comments, setComments] = useState<Array<any>>([])
  const [extraComment, setExtraComment] = useState('')
  const [isShowTextArea, setIsShowTextArea] = useState(false)

  const commentsList = [
    { key: 0, content: t('IT_WASNT_TASTY', "It wasn't tasty") },
    { key: 1, content: t('SMALL_PORTION', 'Small portion') },
    { key: 2, content: t('WET_OR_LEAKY', 'Wet or leaky') },
    { key: 3, content: t('SLOPPY_PRESENTATION', 'Sloppy presentation') },
    { key: 4, content: t('COLD_OR_MELTED', 'Cold or melted') }
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
      <ProductContainer>
        <ProductHeader>
          <OText numberOfLines={1} style={{ flex: 1 }}>{product?.name}</OText>
          <LikeHandsActionContainer>
            <LikeHandsButton isLike>
              <AntDesignIcons name='like2' size={20} color={theme.colors.primary} />
            </LikeHandsButton>
            <LikeHandsButton>
              <AntDesignIcons name='dislike2' size={20} />
            </LikeHandsButton>
          </LikeHandsActionContainer>
        </ProductHeader>
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
        <TouchableOpacity
          style={styles.additionalCommentButton}
          onPress={() => setIsShowTextArea(!isShowTextArea)}
        >
          <OText
            color={isShowTextArea ? theme.colors.primary : theme.colors.lightGray}
            style={{
              borderBottomColor: isShowTextArea ? theme.colors.primary : theme.colors.lightGray,
              borderBottomWidth: 1
            }}
          >
            {t('ADDITIONAL_COMMENTS', 'Additional comments')}
          </OText>
        </TouchableOpacity>
        {isShowTextArea && (
          <View>
            <OText style={{ marginTop: 10 }}>{t('REVIEW_COMMENT_QUESTION', 'Do you want to add something?')}</OText>
            <OInput
              name='comments'
              onChange={(val: any) => {
                setExtraComment(val.target.value)
              }}
              style={styles.inputTextArea}
              multiline
            />
          </View>
        )}
      </ProductContainer>
    </>
  )
}
