import styled, { css } from 'styled-components/native'

export const OrdersContainer = styled.View`
  margin-bottom: 10px;
`

export const Card = styled.TouchableOpacity`
  ${(props: any) => props.themetwo ? css`
    padding-vertical: 5px;
    margin-bottom: 12px;
    flex-direction: row;
    width: 100%;
  ` : css`
    flex: 1;
  `};
`

export const Map = styled.View`
  flex: 1;
  height: 125px;
  margin-bottom: 22px;
`

export const Information = styled.View`
  ${(props: any) => props.themetwo ? css`
    justify-content: center;
    align-items: flex-start;
    margin-end: 7px;
    flex: 1;
  ` : css`
    flex-direction: row;
    align-items: center;
    padding-vertical: 5px;
    margin-bottom: 12px;
  `};
`

export const OrderInformation = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
`

export const BusinessInformation = styled.View`
	flex-basis: 65%;
`

export const Price = styled.View`
  justify-content: flex-start;
  align-items: flex-end;
  margin-left: 10px;
  width: 30%;
`

export const OptionTitle = styled.View`
  margin-top: 10px;
`

export const Status = styled.View`
  align-items: center;
  justify-content: space-between;
`
