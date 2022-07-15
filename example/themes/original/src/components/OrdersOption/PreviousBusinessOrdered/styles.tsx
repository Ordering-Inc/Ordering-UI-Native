import styled, { css } from 'styled-components/native'

export const ListWrapper = styled.View`
	background-color: ${(props: any) => props.theme.colors.backgroundLight};
	padding-horizontal: ${(props : any) => props.isBusinessesSearchList ? '0' : '40px'};
`;
