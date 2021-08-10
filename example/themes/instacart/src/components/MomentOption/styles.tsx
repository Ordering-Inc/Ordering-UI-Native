import styled, { css } from 'styled-components/native'

export const HeaderTitle = styled.View`
  flex-direction: column;
  margin-bottom: 20px;
`
export const WrapSelectOption = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-vertical: 5px;
`
export const Days = styled.ScrollView`
  flex-direction: row;
  margin-vertical: 10px;
  margin-horizontal: -40px;
`
export const Day = styled.TouchableOpacity`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 110px;
  height: 62px;
  border-radius: 3px;
  margin-end: 8px;
  margin-vertical: 10px;
  background-color: ${(props: any) => props.isActive ? props.theme.colors.primary : props.theme.colors.inputDisabled};
`
export const WrapHours = styled.ScrollView`
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.textSecondary};
  border-radius: 10px;
  margin: 20px 0;
  height: 140px;
  max-height: 140px;
`
export const Hours = styled.View`
  flex: 1;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 20px;
`
export const Hour = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-width: 1px;
  border-radius: 10px;
  border-color: ${(props: any) => props.theme.colors.textSecondary};
  width: 90px;
  margin-vertical: 10px;
`
export const WrapDelveryTime = styled.View`
  flex: 1;
  margin-top: 16px;
`
export const TimePickerWrapper = styled.View`
	flex: 1;
	min-height: 42px;
	height: 42px;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	border-radius: 3px;
	padding-start: 16px;
	padding-end: 7px;
	border: 1px solid ${(props: any) => props.theme.colors.border};
	margin-top: 10px;
`
