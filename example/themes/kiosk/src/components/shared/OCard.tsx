import React from 'react';
import { TextStyle, ImageBackground, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';
import FastImage from 'react-native-fast-image'

import styled, { css } from 'styled-components/native';
import OText from './OText';

const CardContainer = styled.TouchableOpacity`
	position: relative;
  flex-direction: column;
  border-radius: 10px;
  position: relative;
  margin: 0 30px 30px 0;
  align-self: flex-start;
`

const WrapPrice = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
`

const WrapImage = styled.View`
  width: 100%;
  height: 120px;
`

const WrapContent = styled.View`
  display: flex;
  flex-direction: column;
	${(props: any) => props.isCentered && css`
		align-items: center;
	`}
`

const OCard = (props: Props): React.ReactElement => {
	const theme = useTheme()

	const styles = StyleSheet.create({
    textStyle: {
      marginTop: 10
    },
    image: {
      width: '100%',
      height: '100%',
			borderBottomLeftRadius: 0,
			borderBottomRightRadius: 0,
    }
  })

	return (
		<CardContainer
			activeOpacity={1}
      style={props.style}
      onPress={props?.onPress}
			disabled={!props?.onPress}
    >
      <WrapImage>
				{props.isUri ? (
					<FastImage
						style={[styles.image, props.style]}
						source={{
							uri: props.image?.uri,
							priority: FastImage.priority.normal,
							// cache:FastImage.cacheControl.web
						}}
						resizeMode={FastImage.resizeMode.cover}
					/>
				) : (
					<ImageBackground
						style={[styles.image, props.style]}
						source={props.image}
						imageStyle={{
							borderBottomLeftRadius: 0,
							borderBottomRightRadius: 0,
							borderRadius: 10
						}}
						resizeMode='cover'
					/>
				)}
      </WrapImage>
      <WrapContent isCentered={props.isCentered}>
        <OText
          size={18}
          numberOfLines={1}
          ellipsizeMode='tail'
          style={styles.textStyle}
        >
          {props.title}
        </OText>
        {!!props?.description && (
          <OText
            color={theme.colors.mediumGray}
            size={18}
            numberOfLines={3}
            ellipsizeMode='tail'
            style={styles.textStyle}
          >
            {props?.description}
          </OText>
        )}
        <WrapPrice>
          <OText
            size={18}
          >
            {props.price}
          </OText>
          {props?.prevPrice && (
            <OText
              size={18}
              color={theme.colors.mediumGray}
              style={{
                textDecorationLine: 'line-through',
                textDecorationStyle: 'solid',
                marginLeft: 20,
              }}
            >
              {props?.prevPrice}
            </OText>
          )}
        </WrapPrice>
      </WrapContent>
    </CardContainer>
	)
}

interface Props {
	badgeText?: string;
	isUri?: boolean;
	onPress?(): void;
	image: any;
	isCentered?: any;
	title: string;
	titleStyle?: TextStyle;
	description?: string;
	descriptionStyle?: TextStyle;
	price?: string;
	prevPrice?: string;
	style?: any;
}

export default OCard;
