import styled from 'styled-components/native'

export const BusinessContainer = styled.View`
  flex-direction: column;
`
export const BusinessHeader = styled.ImageBackground`
  flex-direction: row;
  width: 100%;
  height: 100%;
  position: relative;
  max-height: 200px;
  resize-mode: cover;
  min-height: 200px;
`
export const BusinessLogo = styled.View`
  flex: 1;
  align-self: flex-end;
`
export const BusinessInfo = styled.View`
  flex-direction: column;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
  padding-horizontal: 30px;
  padding-top: 20px;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
`
export const BusinessInfoItem = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 6px;
`
export const WrapReviews = styled.View`
  flex-direction: row;
  align-items: center;
  margin-vertical: 6px;
`

export const VerticalLine = styled.View`
  width: 1px;
  background-color: ${(props: any) => props.theme.colors.gray};
`
