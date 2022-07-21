import styled, { css } from 'styled-components/native';

export const Container = styled.View`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 10001;
  elevation: 5;
  background-color: #FFF;
`;

export const Wrapper = styled.View`
  width: ${(props: any) => props.width}px;
  height: ${(props: any) => props.height}px;
`;

export const WrapperFloatBtn = styled.View`
  position: absolute;
  top: 10%;
  right: ${(props: any) => props.outside ? 11 : 58}%;
  z-index: 20002;
  elevation: 17;
`;

export const IconControl = styled.TouchableOpacity`
  background-color: ${(props: any) => props.theme.colors.white};
  padding: 10px;
  border-radius: 8px;
  elevation: 17;
`;
