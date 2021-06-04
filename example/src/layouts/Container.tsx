import React from 'react';
import { Platform } from 'react-native';
import styled, { css } from 'styled-components/native';
import { colors } from '../theme.json';

const ContainerStyled = styled.ScrollView`
  flex: 1;
  ${(props: any) => !props.nopadding && css`
    padding: ${Platform.OS === 'ios' ? '0px 20px 20px' : '20px'};
  `}
  background-color: ${colors.backgroundPage};
`;

const SafeAreaStyled = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.backgroundPage};
`;

export const Container = (props: any) => {
  return (
    <SafeAreaStyled>
      <ContainerStyled>
        {props.children}
      </ContainerStyled>
    </SafeAreaStyled>
  )
}
