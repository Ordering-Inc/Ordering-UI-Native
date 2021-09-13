import React from 'react';
import { Platform, View } from 'react-native';
import styled, { css } from 'styled-components/native';

const ContainerStyled = styled.ScrollView`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`;

const SafeAreaStyled = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
`;

export const Container = (props: any) => {
	return (
		<SafeAreaStyled style={{ ...props?.style } || {}}>
			{props.noScroll ? (
				<View style={{ flex: 1 }}>
					{props.children}
				</View>
			) : (
				<ContainerStyled keyboardShouldPersistTaps='handled' {...props} style={{ padding: props.nopadding ? 0 : 40, paddingTop: 0 }}>
					{props.children}
				</ContainerStyled>
			)}
		</SafeAreaStyled>
	)
}
