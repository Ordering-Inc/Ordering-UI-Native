import * as React from 'react';
import {TextStyle} from 'react-native';
import styled, {css} from 'styled-components/native';

const SText = styled.Text`
  color: ${(props: any) => props.color || 'black'};
  font-family: 'Poppins-Regular';
  font-size: ${(props: any) => (props.size ? `${props.size}px` : '14px')};
  flex-wrap: wrap;
  margin-bottom: ${(props: any) =>
    props.hasBottom ? '10px' : props.mBottom ? `${props.mBottom}px` : 0};
  margin-right: ${(props: any) =>
    props.hasBottom ? '10px' : props.mRight ? `${props.mRight}px` : 0};
  margin-left: ${(props: any) =>
    props.hasBottom ? '10px' : props.mLeft ? `${props.mLeft}px` : 0};
  ${(props: any) =>
    props.weight &&
    css`
      font-weight: ${props.weight};
    `};
  ${(props: any) =>
    props.isWrap &&
    css`
      flex: ${props.weight ? 1 : 0};
    `};
`;
interface Props {
  color?: string;
  size?: number;
  weight?: any;
  style?: TextStyle;
  children?: JSX.Element | JSX.Element[] | string;
  isWrap?: boolean;
  hasBottom?: boolean;
  mBottom?: any;
  space?: any;
  mRight?: number;
  mLeft?: number;
  numberOfLines?: number;
  ellipsizeMode?: string;
  key?: any;
}

const OText = (props: Props): React.ReactElement => {
  return (
    <SText {...props} style={props.style}>
      {props.children}{props.space && ' '}
    </SText>
  );
};

export default OText;
