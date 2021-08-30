import React from 'react';
import { Platform } from 'react-native';
import styled, { css } from 'styled-components/native';

const ContainerStyled = styled.ScrollView`
flex: 1;
${(props: any) => !props.nopadding && css`
  padding: ${Platform.OS === 'ios' ? '0px 40px 20px' : '40px'};
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
      <ContainerStyled style={props?.style} keyboardShouldPersistTaps='handled'>
        {props.children}
      </ContainerStyled>
    </SafeAreaStyled>
  )
}
