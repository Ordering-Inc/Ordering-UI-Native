import styled, { css } from 'styled-components/native'

export const Container = styled.ScrollView`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
  padding: 0 20px;
  padding-bottom: 20px;
`

export const WrapSelectOption = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-vertical: 5px;
`
export const OrderTimeWrapper = styled.View`
  margin-top: 34px;
`

export const TimeListWrapper = styled.ScrollView`
  margin-top: 30px;
  max-height: 210px;
`

export const TimeContentWrapper = styled.View`
  flex: 1;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
`

export const TimeItem = styled.View`
  width: 86px;
  height: 34px;
  background: #E9ECEF;
  border-radius: 7.6px;
  justify-content: center;
  align-items: center;
  margin: 10px 0px;
  ${({ active }: any) => active && css`
    background: #F5F9FF;
  `}
`
