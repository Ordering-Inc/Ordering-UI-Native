import styled from 'styled-components/native'

export const MenuListWrapper = styled.ScrollView`
  padding: 20px 40px 30px 40px;
`

export const DropOption = styled.View`
  padding: 10px;
  margin-bottom: 5px;
  font-size: 16px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.lightGray};
  flex-direction: row;
  align-items: center;
`
