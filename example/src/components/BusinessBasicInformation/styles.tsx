import styled from 'styled-components/native'
import {colors} from '../../theme'

export const BusinessContainer = styled.View`
  flex-direction: column;
`
export const BusinessHeader = styled.ImageBackground`
  flex-direction: row;
  width: 100%;
  height: 100%;
  position: relative;
  max-height: 260px;
  height: 260px;
  resize-mode: cover;
  min-height: 200px;
`
export const BusinessLogo = styled.View`
  flex: 1;
  align-self: flex-end;
`
export const BusinessInfo = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${colors.backgroundPage};
`
export const BusinessInfoItem = styled.View`
  flex-direction: row;
  align-items: center;
`
export const WrapReviews = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
