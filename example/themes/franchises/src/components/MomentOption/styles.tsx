import styled, { css } from 'styled-components/native'

export const Container = styled.ScrollView`
  flex: 1;
  background-color: ${(props: any) => props.theme.colors.backgroundPage};
  padding: 0 20px;
  padding-bottom: 20px;
`
export const HeaderTitle = styled.View`
  flex-direction: column;
  margin-bottom: 20px;
`
export const WrapSelectOption = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-vertical: 5px;
`
export const Days = styled.View`
  flex-wrap: wrap;
  flex-direction: row;
  margin-vertical: 10px;
`
export const Day = styled.TouchableOpacity`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-right-width: 1px;
  width: 25%;
  margin-vertical: 10px;
  border-color: ${(props: any) => props.theme.colors.textSecondary};

  ${(props: any) => props.borderLeftShow && css`
    border-left-width: 1px;
  `}
`
export const WrapHours = styled.ScrollView`
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.border};
  border-radius: 7.6px;
  margin-top: 6px;
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
  border-radius: 7.6px;
  border-color: ${(props: any) => props.theme.colors.border};
  width: 90px;
  margin-vertical: 7px;
`

export const WrapDelveryTime = styled.View`
  flex: 1;
`
