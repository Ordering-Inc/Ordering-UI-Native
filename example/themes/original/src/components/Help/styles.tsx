import styled from 'styled-components/native'

export const HelpSubItem = styled.TouchableOpacity`
  border-bottom-color: ${(props: any) => props.theme.colors.border};
  border-bottom-width: 1px;
  padding-vertical: 15px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const LastOrdersContainer = styled.View`
  margin-vertical: 30px;
`
