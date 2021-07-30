import styled from 'styled-components/native'

export const Card = styled.TouchableOpacity`
  margin-vertical: 20px;
  flex: 1;
  width: 100%;
`

export const BusinessHero = styled.ImageBackground`
  height: 180px;
  resize-mode: cover;
  flex-direction: row;
  position: relative;
`

export const BusinessContent = styled.View`
  padding-vertical: 15px;
`

export const BusinessInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const BusinessCategory = styled.View`
`

export const Metadata = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`

export const BusinessState = styled.View`
  margin-right: 20px;
  margin-top: 20px;
`

export const BusinessLogo = styled.View`
  flex: 1;
  align-self: flex-end;
`

export const Reviews = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${(props: any) => props.theme.colors.backgroundGray};
  height: 40px;
  width: 40px;
  border-radius: 100px;
`

export const VerticalLine = styled.View`
  width: 1px;
  background-color: ${(props: any) => props.theme.colors.gray};
`
