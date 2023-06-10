import styled from 'styled-components/native'

export const ProgressContentWrapper = styled.View`
  height: 12px;
  background: #F8F9FA;
  flex: 1;
`

export const ProgressBar = styled.View`
  height: 12px;
  background: ${(props: any) => props.theme.colors.primary};
`

export const TimeWrapper = styled.View`
  flex-direction: column;
`

export const ProgressTextWrapper = styled.View`
  margin-top: 7px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

export const OrderInfoWrapper = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
  margin-bottom: 15px;
`
export const OrderProgressWrapper = styled.View`
  margin-top: 37px;
  margin-bottom: 20px;
	padding-horizontal: 20px;
`
