import styled from 'styled-components/native'

export const Container = styled.View`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
  position: relative;
  padding-left: 10px;
`

export const DateBlock = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

export const MessageBlock = styled.View`
  display: flex;
  font-size: 14px;
`

export const Dot = styled.View`
  position: absolute;
  top: ${(props: any) => props.isTop ? 0 : 6}px;
  left: -4px;
  width: 6px;
  height: 6px;
  border-radius: 50px;
  background-color: ${(props: any) => props.theme.colors.disabled};
`

export const DescriptionBlock = styled(MessageBlock)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`
