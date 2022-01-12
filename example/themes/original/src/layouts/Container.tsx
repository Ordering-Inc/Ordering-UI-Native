import React from 'react';
import styled, { css } from 'styled-components/native';
import { Platform } from 'react-native';

const ContainerStyled = styled.ScrollView`
  flex: 1;
  ${(props: any) => !props.noPadding && css`
    padding: ${Platform.OS === 'ios' ? '0px 40px' : '20px 40px'};
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
      <ContainerStyled {...props} ref={props?.forwardRef} keyboardShouldPersistTaps='handled' style={{...props.style}}>
        {props.children}
      </ContainerStyled>
    </SafeAreaStyled>
  )
}
