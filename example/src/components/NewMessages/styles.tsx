
import styled from 'styled-components/native'
import { colors } from '../../theme'


export const Wrapper = styled.View`
  flex: 1;
  background-color: ${colors.white};
  padding: 0
`
export const Inner = styled.ScrollView`
  background-color: white;
  padding: 16px;
  flex: 1;
  height: 100%;
`
export const ActionWrapper = styled.View`
  flex-direction: row;
`
export const InputWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  border: 1px solid ${colors.lightGray};
  border-radius: 25px;
  padding-horizontal: 14px;
`
export const SignatureWrap = styled.View`
`
export const SignatureWrapInner = styled.View`
  margin-top: 5px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid ${colors.primary};
`

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  border-bottom-width: 1px;
  border-bottom-color: #d9d9d9;
  padding-bottom: 10px;
  padding-horizontal: 20px;
`

export const TitleHeader = styled.View`

`

export const UploadImage = styled.View`
  position: relative;
  top: 0;
  left: 0;
`
