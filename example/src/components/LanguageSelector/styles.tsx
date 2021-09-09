import styled from 'styled-components/native'

export const Container = styled.View`
  align-items: flex-end;
  justify-content: flex-end;
  flex-direction: row;
`

export const SelectItem = styled.View`
  padding: 8px;
  align-items: center;
  flex-direction: row;
`;

export const SelectItemBtn = styled(SelectItem)`
  border-width: 1px;
  border-color: transparent;
  border-radius: 10px;
  max-width: 140px;
  margin-vertical: 5px;
  padding: 15px 20px;
  background-color: ${(props: any) => props.isFromProfile ? 'transparent' : props.theme.colors.inputDisabled};
`
