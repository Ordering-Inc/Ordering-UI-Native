import React from 'react';
import { TextStyle, View, ViewStyle } from 'react-native';
import { useTheme } from 'styled-components/native';

import styled from 'styled-components/native';
import { OImage, OText } from '../shared';
import { StyleSheet } from 'react-native';
import {useLanguage} from 'ordering-components/native'

const CardContainer = styled.TouchableOpacity`
	width: 100%;
	overflow: hidden;
	background-color: ${(props: any) => props.theme.colors.mediumGray};
	border-radius: 16px;
`

const CardBody = styled.View`
	padding: 2% 4%;
	position: absolute;
	background-color: transparent;
	z-index: 100;
	width: 60%;
	height: 100%;
	right: 0;
	justify-content: center;
`

const PromoCard = (props: Props): React.ReactElement => {
  const theme = useTheme();
  const [, t] = useLanguage();

  const styles = StyleSheet.create({
    soldOut: {
      position: 'absolute',
      width: '40%',
      height: '50%',
      justifyContent: 'center',
      backgroundColor: theme.colors.white,
      alignItems: 'center',
      borderRadius: 15,
      opacity: 0.8,
    },
  });

  return (
    <CardContainer
      activeOpacity={1}
      style={{...props.style}}
      onPress={props?.onPress}
      disabled={!props?.onPress}>
      <OImage
        source={props.image}
        height={150}
        resizeMode="cover"
        borderRadius={16}
      />
      {!props.isOutOfStock && (
        <View style={styles.soldOut}>
          <OText size={28} color={theme.colors.error}>
            {t('SOLD_OUT', 'SOLD OUT')}
          </OText>
        </View>
      )}
      <CardBody>
        {props?.subtitle && (
          <OText
            color={theme.colors.white}
            numberOfLines={1}
            mBottom={8}
            style={{...props?.subtitleStyle}}
            size={18}
            weight="400">
            {props.subtitle}
          </OText>
        )}

        <OText
          color={theme.colors.white}
          mLeft={0}
          size={32}
          numberOfLines={1}
          mBottom={8}
          style={{...props?.titleStyle}}
          weight="bold">
          {props.title}
        </OText>

        {props?.description && (
          <OText
            color={theme.colors.white}
            numberOfLines={2}
            mBottom={4}
            size={18}
            style={{...props?.descriptionStyle}}
            weight="400">
            {props.description}
          </OText>
        )}
      </CardBody>
    </CardContainer>
  );
};

interface Props {
  onPress?(): void;
  image: string | {uri: string};
  title: string;
  titleStyle?: TextStyle;
  subtitle?: string;
  subtitleStyle?: TextStyle;
  description?: string;
  descriptionStyle?: TextStyle;
  style?: ViewStyle;
  isOutOfStock?: boolean;
}

export default PromoCard;
