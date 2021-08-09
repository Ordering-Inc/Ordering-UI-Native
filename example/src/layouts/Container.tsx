import React from 'react';
import { Platform , I18nManager } from 'react-native';
import styled, { css } from 'styled-components/native';

const ContainerStyled = styled.ScrollView`
  flex: 1;
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
			{props.noScroll ? (
				<View style={{ flex: 1 }}>
					{props.children}
				</View>
			) : (
				<ContainerStyled keyboardShouldPersistTaps='handled' style={{padding: props.nopadding ? 0 : 20, paddingTop: 0}}>
					{props.children}
				</ContainerStyled>
			)}
		</SafeAreaStyled>
	)
}
