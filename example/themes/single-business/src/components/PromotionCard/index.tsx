import React from 'react'
import { StyleSheet, ImageBackground } from 'react-native'
import { useUtils } from 'ordering-components/native'
import { Placeholder, PlaceholderLine } from 'rn-placeholder';
import { useTheme } from 'styled-components/native'
import { OText } from '../shared'

import {
  CardContainer,
  WrapImage,
  WrapContent,
  LineDivider
} from './styles'

export const PromotionCard = (props: any) => {
  const {
    promotion,
    isLoading,
    onPromotionClick,
  } = props

  const [theme] = useTheme();
  const [{ optimizeImage }] = useUtils();

  return (
    <>
      <CardContainer
        style={{ width: '100%' }}
        onPress={() => onPromotionClick && onPromotionClick(promotion)}
      >
        <WrapImage>
          {isLoading ? (
            <PlaceholderLine
              width={100}
              height={80}
              style={{borderRadius: 10}}
            />
          ) : (
            <ImageBackground
              style={styles.image}
              source={promotion.image
                ? { uri: optimizeImage(promotion?.image, 'h_200,c_limit') }
                : theme.images.dummies.promotion
              }
              imageStyle={{ borderRadius: 10 }}
              resizeMode='cover'
            />
          )}
        </WrapImage>
        <WrapContent>
          {isLoading ? (
            <Placeholder>
              <PlaceholderLine width={40} style={{ marginTop: 5 }} />
              <PlaceholderLine width={80} />
              <PlaceholderLine width={30} />
            </Placeholder>
          ) : (
            <>
              <OText
                size={16}
                numberOfLines={1}
                ellipsizeMode='tail'
                style={styles.textStyle}
              >
                {promotion?.name}
              </OText>
              {!!promotion?.description && (
                <OText
                  color={theme.colors.lightGray}
                  size={16}
                  numberOfLines={3}
                  ellipsizeMode='tail'
                  style={styles.textStyle}
                >
                  {promotion?.description}
                </OText>
              )}
            </>
          )}
        </WrapContent>
      </CardContainer>
      <LineDivider />
    </>
  )
}

const styles = StyleSheet.create({
  textStyle: {
    // marginTop: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  }
})
