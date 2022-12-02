import React from 'react';
import { Platform } from 'react-native';
import styled, { css } from "styled-components/native";

const ContainerStyled = styled.ScrollView`
  flex: 1;
  ${(props: Props) =>
    !props.nopadding &&
    css`
      padding: ${Platform.OS === 'ios' ? '0px 20px 20px' : '20px'};
    `}
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`;

const SafeAreStyled = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`;

export const Container = (props: Props) => {
  return (
    <SafeAreStyled
      nestedScrollEnabled={props.nestedScrollEnabled}
    >
      <ContainerStyled
        {...props}
        keyboardShouldPersistTaps="handled"
        ref={props?.forwardRef}
      >
        {props.children}
      </ContainerStyled>
    </SafeAreStyled>
  );
};

Container.defaultProps = {
  nestedScrollEnabled: false
}

interface Props {
  nestedScrollEnabled: boolean,
  nopadding?: boolean;
  children?: any;
  forwardRef?: any
}
