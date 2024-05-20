import styled, { css } from 'styled-components/native';

export const FiltersTab = styled.View`
  margin-bottom: 20px;
  min-height: 30px;
  max-height: 35px;
  flex: 1;
  width: 100%;
`

export const TabsContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom-width: 1px;
  flex: 1;
  width: 100%;
  border-bottom-color: ${(props: any) => props.theme.colors.tabBar};
`

export const Tag = styled.Pressable`
  background-color: ${({ isSelected }: { isSelected: string }) => isSelected};
  justify-content: center;
  align-items: center;
  min-height: 34px;
  padding: 4px 10px;
  border-radius: 50px;
  margin-right: 15px;
`

export const IconWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  background: #fff;
`

export const ModalContainer = styled.ScrollView`
  padding: 0px 30px;
`

export const ModalTitle = styled.Text`
  font-family: Poppins;
  font-style: normal;
  font-weight: bold;
  font-size: 20px;
  color: ${(props: any) => props.theme.colors.textGray};
  margin-bottom: 24px;
`

export const FilterBtnWrapper = styled.TouchableOpacity`
  background-color: ${(props: any) => props.theme.colors.inputDisabled};
  border-radius: 7.6px;
  margin-vertical: 5px;
  padding: 15px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`

export const TabPressable = styled.Pressable`
  align-items: center;
  border-color: ${(props: any) => props.theme.colors.textGray};
  border-bottom-width: ${(props: any) => props.isSelected ? '1px' : '0px'};
  padding-horizontal: 10px;
`
export const OrderStatus = styled.View`
  margin-right: 5px;
  width: 3px;
  height: 90%;
  border-radius: 6px;

  ${(props: any) => props.timeState === 'in_time' && css`
    background-color: #00D27A;
  `}

  ${(props: any) => props.timeState === 'at_risk' && css`
    background-color: #FFC700;
  `}

  ${(props: any) => props.timeState === 'delayed' && css`
    background-color: #E63757;
  `}
`

export const SlaOption = styled.View`
  flex-direction: row;
  align-items: center;
`

export const SearchModalContent = styled.View`

`

export const SlaSettingModalContent = styled.View`

`

export const DeliveryStatusWrapper = styled.View`
  position: relative;
`
export const VerticalLine = styled.View`
  position: absolute;
  background: #E9ECEF;
  position: absolute;
  width: 1px;
  height: 100%;
  top: 7px;
  left: 7px;
`
export const StatusItems = styled.View`
  position: relative;
  margin-bottom: 20px;
  z-index: 2;
`
export const ItemHeader = styled.View`
  flex-direction: row;
  margin-bottom: 5px;
`
export const ItemStatus = styled.View`
  width: 4px;
  height: 22px;
  margin: 0 15px;
  border-radius: 4px;
  background: ${(props: any) => props.backColor};
`
export const ItemContent = styled.View`
  display: flex;
  padding: 0 30px;
`

export const TimerInputWrapper = styled.View`
  color: ${(props: any) => props.theme.colors.disabled};
  margin-top: 15px;
  margin-left: 30px;
  margin-right: 30px;
  flex-direction: row;
  align-items: flex-end;
`
export const OverLine = styled.View`
  position: absolute;
  height: 100%;
  width: 15px;
  top: 20px;
  left: 0;
  /* border-width: 1px; */
  background-color: #fff;
  z-index: 2;
`
export const Actions = styled.View`

`

export const InputContainer = styled.View`
  position: relative;
`

export const FilterAlert = styled.View`
  position: absolute;
  z-index: 1000;
  flex-direction: row;
  top: 50px;
  background-color: #FFF9E2;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  right: 10px;
  padding: 5px;
  border-radius: 10px
`
