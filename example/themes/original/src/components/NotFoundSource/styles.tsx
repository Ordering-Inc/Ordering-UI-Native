import styled, { css } from 'styled-components/native'

export const NotFound = styled.View`
  ${(props: any) => props.simple
    ? css`
        background-color: ${(props: any) => props.theme.colors?.white};
        border-radius: 10px;
        padding: 15px;
        padding-horizontal: 20px;
        border: 1px ${(props: any) => props.theme.colors?.border};
    ` : css`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: auto;
      margin: auto auto;
      padding: 10px;
    `}
`

export const NotFoundImage = styled.View`
  max-width: 300px;
`
