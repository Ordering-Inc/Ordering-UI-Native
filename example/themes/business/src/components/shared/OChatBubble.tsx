import * as React from 'react';
import styled from 'styled-components/native';
import { OIcon } from '.';
import { DIRECTION } from '../../config/constants';
import { useTheme } from 'styled-components/native';
import OText from './OText';

const Wrapper = styled.View`
  flex: 1;
  border-radius: 35px;
  min-height: 50px;
  padding-horizontal: 25px;
  padding-vertical: 10px;
  max-width: 80%;
  margin-bottom: 14px;
`;

const ImageContainer = styled.TouchableOpacity`
  flex: 1;
`;
interface Props {
  side?: string;
  bgColor?: string;
  textColor?: string;
  contents?: any;
  datetime?: string;
  data?: any;
  image?: string;
  onClick?: () => void;
}

const OChatBubble = (props: Props) => {
  const theme = useTheme();
  return (
    <Wrapper
      style={
        props?.side
          ? props.side === DIRECTION.RIGHT
            ? {
                borderBottomRightRadius: 0,
                backgroundColor: props.bgColor
                  ? props.bgColor
                  : theme.colors.primary,
                alignSelf: 'flex-end',
              }
            : {
                borderBottomLeftRadius: 0,
                backgroundColor: props.bgColor
                  ? props.bgColor
                  : theme.colors.backgroundGray,
                alignSelf: 'flex-start',
              }
          : {
              borderRadius: 5,
              backgroundColor: props.bgColor
                ? props.bgColor
                : theme.colors.backgroundGray,
              alignSelf: 'center',
            }
      }>
      {props?.image && (
        <ImageContainer onPress={props.onClick}>
          <OIcon cover url={props.image} width={250} height={250} />
        </ImageContainer>
      )}
      <OText
        color={
          props.textColor
            ? props.textColor
            : props.side == DIRECTION.RIGHT
            ? theme.colors.white
            : 'black'
        }>
        {props.contents}
      </OText>
      <OText
        color={
          props.textColor
            ? props.textColor
            : props.side == DIRECTION.RIGHT
            ? theme.colors.white
            : 'black'
        }
        style={{ textAlign: 'right' }}
        size={9}>
        {props.datetime}
      </OText>
    </Wrapper>
  );
};

export default OChatBubble;
