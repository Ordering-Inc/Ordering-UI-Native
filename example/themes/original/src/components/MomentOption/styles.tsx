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
  ${({ cateringPreorder }: any) => cateringPreorder && css`
    max-height: 250px;
    height: 250px;
  `}
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
  margin: 10px 5px;
  ${({ cateringPreorder }: any) => cateringPreorder && css`
    background: #fff;
    width: 100%;
    min-width: 100%;
    height: 50px;
    flex-direction: row;
    justify-content: flex-start;
    padding-left: 10px;
    margin: 0;
  `}
  ${({ active }: any) => active && css`
    background: #F5F9FF;
  `}
`
