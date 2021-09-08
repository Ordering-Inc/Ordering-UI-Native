import styled from 'styled-components/native'

export const CenterView = styled.View`
  align-items: center;
`;

export const UserData = styled.View`
  text-align: center;
`

export const Names = styled.View`
  flex-direction: row;
  align-items: baseline;
  padding: 17px 40px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.border};
`

export const EditButton = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding-horizontal: 40px;
  flex: 1;
`

export const Actions = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 10px;
  padding-horizontal: 40px;
  justify-content: space-between;
`

export const WrapperPhone = styled.View`
  padding: 8px 0px;
`
