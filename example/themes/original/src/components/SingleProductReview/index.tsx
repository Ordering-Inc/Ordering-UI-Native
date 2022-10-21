import React, { useState, useEffect } from 'react'
import { useLanguage, useUtils } from 'ordering-components/native'
import { OText, OButton, OInput, OIcon } from '../shared'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import AntDesignIcons from 'react-native-vector-icons/AntDesign'
import { useTheme } from 'styled-components/native'
import { SingleProductReviewParams } from '../../types'

import { reviewCommentList } from '../../../../../src/utils'

import {
  ProductContainer,
  ProductHeader,
  LikeHandsActionContainer,
  LikeHandsButton,
  CommentsButtonGroup,
  LogoWrapper,
} from './styles'
import FastImage from 'react-native-fast-image'

export const SingleProductReview = (props: SingleProductReviewParams) => {
  const {
    product,
    formState,
    handleChangeFormState,
  } = props

  const [, t] = useLanguage()
  const theme = useTheme()
  const [{ optimizeImage }] = useUtils()

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
      marginVertical: 10,
    },
    productStyle: {
      width: 80,
      height: 80,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  })

  const [comments, setComments] = useState<Array<any>>([])
  const [extraComment, setExtraComment] = useState('')
  const [isShowTextArea, setIsShowTextArea] = useState(false)
  const [qualification, setQualification] = useState(5)
  const [currentValue, setCurrentValue] = useState(5)

  const commentsList = reviewCommentList('product')

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
    const value = qualification ? 5 : 1
    setCurrentValue(value)
    if (value !== currentValue) setComments([])
    if (comments?.length === 0 && !extraComment && formState.changes?.length === 0 && qualification === 5) return
    let _comments = ''
    if (comments.length > 0) {
      comments.map(comment => (_comments += comment.content + '. '))
    }
    const _comment = _comments + extraComment
    let found = false
    const _changes = formState.changes.map((item: any) => {
      if (item?.product_id === product?.product_id) {
        found = true
        return {
          product_id: product?.product_id,
          comment: _comment,
          qualification: qualification
        }
      }
      return item
    })
    if (!found) {
      _changes.push({
        product_id: product?.product_id,
        comment: _comment,
        qualification: qualification
      })
    }
    handleChangeFormState && handleChangeFormState(_changes)
  }, [comments, extraComment, qualification])

  return (
    <>
      <ProductContainer>
        <LogoWrapper>
          {product?.images ? (
            <FastImage
              style={styles.productStyle}
              source={{
                uri: optimizeImage(product?.images, 'h_250,c_limit'),
                priority: FastImage.priority.normal,
              }}
              resizeMode={FastImage.resizeMode.cover}
            />
          ) : (
            <OIcon
              src={theme?.images?.dummies?.product}
              width={80}
              height={80}
            />
          )}
        </LogoWrapper>
        <ProductHeader>
          <OText numberOfLines={1} style={{ flex: 1 }} color={theme.colors.textNormal}>{product?.name}</OText>
          <LikeHandsActionContainer>
            <LikeHandsButton
              isLike
              onPress={() => setQualification(5)}
            >
              <AntDesignIcons name='like2' size={20} color={qualification === 5 ? theme.colors.primary : theme.colors.lightGray} />
            </LikeHandsButton>
            <LikeHandsButton onPress={() => setQualification(1)}>
              <AntDesignIcons name='dislike2' size={20} color={qualification === 1 ? theme.colors.primary : theme.colors.lightGray} />
            </LikeHandsButton>
          </LikeHandsActionContainer>
        </ProductHeader>
        <CommentsButtonGroup>
          {commentsList[qualification === 5 ? 'like' : 'dislike']?.map(commentItem => (
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
        <TouchableOpacity
          style={styles.additionalCommentButton}
          onPress={() => setIsShowTextArea(!isShowTextArea)}
        >
          <OText
            color={isShowTextArea ? theme.colors.primary : theme.colors.disabled}
            style={{
              borderBottomColor: isShowTextArea ? theme.colors.primary : theme.colors.disabled,
              borderBottomWidth: 1
            }}
          >
            {t('ADDITIONAL_COMMENTS', 'Additional comments')}
          </OText>
        </TouchableOpacity>
        {isShowTextArea && (
          <View>
            <OText style={{ marginTop: 10 }} color={theme.colors.textNormal}>{t('REVIEW_COMMENT_QUESTION', 'Do you want to add something?')}</OText>
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
