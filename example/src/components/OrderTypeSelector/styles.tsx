import styled from 'styled-components/native'

export const OrderTypeWrapper = styled.View`
  flex: 1;
  max-width: 140px;
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
  background-color: ${(props: any) => props.theme.colors.inputDisabled};
`
