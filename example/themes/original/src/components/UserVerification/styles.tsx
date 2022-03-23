import styled, { css } from 'styled-components/native';

export const Container = styled.View`
  padding: 20px;
`

export const WrapperText = styled.View`
  display: flex;
  flex-direction: column;
  margin: 0 auto 0px;
  align-items: center;
`

export const InputWrapper = styled.View`
  ${(props: any) => props.phone && css`
    width: 60%;
    align-self: center;
    padding-top: 20px;
  `}
`

export const WrapperActions = styled.View`
  position: relative;
`

export const ButtonsActions = styled.View`
  position: absolute;
  bottom: 0px;
  left: 0;
  right: 0;
  padding: 12px 40px;
  flex-direction: row;
  border-top-width: 1px;
  border-color: ${(props: any) => props.theme.colors.border};
  width: 100%;
  justify-content: space-between;
  background-color: #FFF;
  z-index: 1000;
  justify-content: space-between;
`

export const OtpSection = styled.SafeAreaView`
  flex: 1;
  align-items: center;
  justify-content: center;
`

export const DigitInput = styled.Pressable`
  width: 80%;
  flex-direction: row;
  justify-content: space-between;
`

export const CountDownContainer = styled.View`
  background-color: ${(props: any) => `${props.color}4D`};
  border-radius: 7.6px;
  padding: 5px 0px 0px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
`

export const WrappCountdown = styled.View`
  padding-bottom: 20px;
  padding-top: 20px;
`

export const InputsSection = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: 20px;
`

export const ErrorSection = styled.View`
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
`
