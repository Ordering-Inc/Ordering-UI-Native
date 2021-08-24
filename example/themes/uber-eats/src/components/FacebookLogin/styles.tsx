import styled from 'styled-components/native'

export const Container = styled.View``

export const FacebookButton = styled.TouchableOpacity`
  background-color: ${(props: any) => props.theme.colors.white};
  border-color: ${(props: any) => props.theme.colors.primary};
  border-width: 1px;
  font-size: 16px;
  padding: 15px 30px;
  font-size: 16px;
  font-weight: 400;
  text-align: center;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 52px;
`
