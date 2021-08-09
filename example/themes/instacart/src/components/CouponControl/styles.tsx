import styled from 'styled-components/native';

export const CContainer = styled.View`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  padding: 5px 0px;
`

export const CCWrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

export const CCButton = styled.View`
  width: 100%;
  background-color: ${(props: any) => props.theme.colors.backgroundGray};
  padding-horizontal: 10px;
  border-radius: 3px;
  height: 42px;
`
