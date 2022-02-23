import styled, { css } from 'styled-components/native'

export const Container = styled.View`
  width: 100%;
  display: flex;
  padding: 20px 0;
  margin-top: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-top-width: 1px;
  border-top-color: ${(props: any) => props.theme.colors.backgroundGray200};
  ${(props: any) => props.isBottomBorder && css`
    border-bottom-width: 1px;
    border-bottom-color: ${(props: any) => props.theme.colors.backgroundGray200};
  `}
`

export const SectionLeft = styled.View`
  margin-left: 20px;
  max-width: 55%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`

export const SectionLeftText = styled.View`
  alignSelf: flex-start;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
`

export const SectionWrapper = styled.View`
  padding-top: 10px;
  display: flex;
  flex-direction: column;
`
