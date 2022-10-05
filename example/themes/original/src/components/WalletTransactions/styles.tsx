import styled from 'styled-components/native'

export const Container = styled.View`
  display: flex;
  flex-direction: column;
`

export const TransactionsWrapper = styled.View`
  display: flex;
  flex-direction: column;
  border-left-width: 2px;
  border-left-color: ${(props: any) => props.theme.colors.disabled};
`
