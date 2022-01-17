import React from 'react';
import { Platform } from 'react-native';
import styled, { css } from 'styled-components/native';

const ContainerStyled = styled.ScrollView`
  flex: 1;
  ${(props: any) => !props.nopadding && css`
    padding: ${Platform.OS === 'ios' ? '0px 30px 0px' : '30px'};
  `}
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`;

const SafeAreaStyled = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`;


export const Container = (props: any) => {
  return (
    <SafeAreaStyled>
      <ContainerStyled ref={props?.forwardRef} style={props?.style} {...props} keyboardShouldPersistTaps='handled'>
          {props.children}
      </ContainerStyled>
    </SafeAreaStyled>
  )
}