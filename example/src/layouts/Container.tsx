import React from 'react';
import { Platform , I18nManager } from 'react-native';
import styled, { css } from 'styled-components/native';

const ContainerStyled = styled.ScrollView`
  flex: 1;
  ${(props: any) => !props.nopadding && css`
    padding: ${Platform.OS === 'ios' ? '0px 20px 20px' : '20px'};
  `}
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
  left: ${Platform.OS === 'ios' && I18nManager.isRTL ? '20px' : '0px'} ;
`;

const SafeAreaStyled = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`;

export const Container = (props: any) => {
  return (
    <SafeAreaStyled>
      <ContainerStyled keyboardShouldPersistTaps='handled'>
        {props.children}
      </ContainerStyled>
    </SafeAreaStyled>
  )
}
