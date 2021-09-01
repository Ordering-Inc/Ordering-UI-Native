import React from 'react';
import styled, { css } from 'styled-components/native';

const ContainerStyled = styled.ScrollView`
  flex: 1;
  padding: ${(props: any) => props.noPadding ? '0' : '0 40px'};
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`;

const SafeAreaStyled = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`;

export const Container = (props: any) => {
  return (
    <SafeAreaStyled>
      <ContainerStyled keyboardShouldPersistTaps='handled' {...props} style={{...props.style}}>
        {props.children}
      </ContainerStyled>
    </SafeAreaStyled>
  )
}
