import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context'
import styled, { css, useTheme } from 'styled-components/native';
import { Platform } from 'react-native';

const ContainerStyled = styled.ScrollView`
  flex: 1;
  ${(props: any) => !props.noPadding && css`
    padding: ${Platform.OS === 'ios' ? '0px 40px' : '20px 40px'};
  `}
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`;

export const Container = (props: any) => {
  const theme = useTheme()
  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.backgroundPage
      }}
      edges={['bottom']}
    >
      <ContainerStyled {...props} ref={props?.forwardRef} keyboardShouldPersistTaps='handled' style={{...props.style}}>
        {props.children}
      </ContainerStyled>
    </SafeAreaView>
  )
}
