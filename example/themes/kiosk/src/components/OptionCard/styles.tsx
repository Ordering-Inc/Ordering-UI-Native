import styled from 'styled-components/native'

export const Container = styled.ImageBackground`
	height: auto;
	justify-content: center;
`
export const InnerContainer = styled.View`
	position: absolute;
	background: ${(props : any) => props.isLoading ? 'rgba(24, 28, 50, 0.7)' : 'rgba(24, 28, 50, 0.4)'};
	width: 100%;
	height: 100%;
	padding: 10%;
	justify-content: center;
`

export const ActivityIndicatorContainer = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
	position: absolute;
	left: 60%
`
