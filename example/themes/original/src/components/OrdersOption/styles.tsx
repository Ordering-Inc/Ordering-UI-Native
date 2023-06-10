import styled, { css } from 'styled-components/native'

export const OptionTitle = styled.View`
	margin-top: 24px;
	${(props : any) => props.titleContent && css`
		margin-left: ${() => props.isBusinessesSearchList ? '0' : '20px'};
	`}
`

export const NoOrdersWrapper = styled.View`
	flex-direction: column;
	align-items: center;
	margin-top: 60px;
`
