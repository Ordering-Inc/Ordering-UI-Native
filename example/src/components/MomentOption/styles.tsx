import styled, { css } from 'styled-components/native'
import { colors } from '../../theme'

export const Container = styled.ScrollView`
  flex: 1;
  background-color: ${colors.backgroundPage};
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
  border-right-width: 1;
  width: 25%;
  margin-vertical: 10px;
  border-color: ${colors.textSecondary};

  ${(props: any) => props.borderLeftShow && css`
    border-left-width: 1;
  `}
`
export const WrapHours = styled.ScrollView`
  border-width: 1px;
  border-color: ${colors.textSecondary};
  border-radius: 10px;
  margin-top: 20px;
  height: 120px;
  max-height: 120px;
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
  border-color: ${colors.textSecondary};
  width: 90px;
  margin-vertical: 10px;
`

export const WrapDelveryTime = styled.View`
  flex: 1;
`
