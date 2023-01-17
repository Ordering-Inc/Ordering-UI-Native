import styled from 'styled-components/native'

export const SessionsWrapper = styled.View`
`
export const SessionItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-vertical: 15px;
  border-bottom-color: ${(props: any) => props.theme.colors.lightGray};
  border-bottom-width: 1px;
`
export const DurationWrapper = styled.View`
  /* flex-direction: row; */
`

export const Container = styled.View`
  padding-top: ${(props: any) => props.pdng};
  margin-bottom: 50px;
`
