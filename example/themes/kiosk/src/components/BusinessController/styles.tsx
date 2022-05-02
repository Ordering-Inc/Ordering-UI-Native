import styled, { css } from 'styled-components/native';

export const Card = styled.TouchableOpacity`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin: 0 15px 20px;
  width: 120px;
`

export const BusinessLogo = styled.ImageBackground`
  position: relative;
  height: 120px;
  width: 120px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.border};
`
