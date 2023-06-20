import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import styled, { css, useTheme } from 'styled-components/native';
import { Platform, View } from 'react-native';

const ContainerStyled = styled.ScrollView`
  ${(props: any) => !props.disableFlex && css`
    flex: 1
  `}
  ${(props: any) => !props.noPadding && css`
    padding: ${Platform.OS === 'ios' ? '0px 20px' : '20px 20px'};
  `}
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`;

export const Container = (props: any) => {
  const theme = useTheme()
  const insets = useSafeAreaInsets()
  return (
    <View
      style={{
        flex: props.disableFlex ? undefined : 1,
        paddingTop: props.pt ?? insets.top,
        backgroundColor: theme.colors.backgroundPage
      }}
    >
      <ContainerStyled {...props} ref={props?.forwardRef} keyboardShouldPersistTaps='handled' style={{...props.style}}>
        {props.children}
      </ContainerStyled>
    </View>
  )
}
