import React from 'react';
import styled, { css } from 'styled-components/native';
import { colors } from '../theme';

const ContainerStyled = styled.ScrollView`
  flex: 1;
  ${(props: any) => !props.nopadding && css`
    padding: 20px;
  `}
  background-color: ${colors.backgroundPage};
`;

const SafeAreStyled = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.backgroundPage};
`;

export const Container = (props: any) => {
  return (
    <SafeAreStyled>
      <ContainerStyled>
        {props.children}
      </ContainerStyled>
    </SafeAreStyled>
  )
}
