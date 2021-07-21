import styled, { css } from 'styled-components/native';

export const FormRedirect = styled.View`
  display: flex;
  flex-direction: column;
  padding-left: 10px;
  /* ${(props: any) => props.theme?.rtl && css`
    padding-right: 10px;
    padding-left: 0px;
  `} */
`

export const FormGroup = styled.View`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`

export const ErrorMessage = styled.View`
  color: #D81212;
  margin: 10px 0 0 0;
  font-weight: bold;
`
