import React from 'react';
import { Platform , I18nManager } from 'react-native';
import styled, { css } from 'styled-components/native';

const ContainerStyled = styled.ScrollView`
  flex: 1;
  padding: 0;
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
      <ContainerStyled keyboardShouldPersistTaps='handled' style={{...props.style}}>
        {props.children}
      </ContainerStyled>
    </SafeAreaStyled>
  )
}
