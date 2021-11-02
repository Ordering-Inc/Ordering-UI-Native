import styled from 'styled-components/native';

export const FiltersTab = styled.View`
  margin-bottom: 20px;
`;

export const TabsContainer = styled.View`
  width: ${({ width }: { width: number }) => `${width-42}px`};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: ${(props: any) => props.theme.colors.tabBar};
`;

export const Tag = styled.Pressable`
  background-color: ${({ isSelected }: { isSelected: string }) => isSelected};
  justify-content: center;
  align-items: center;
  min-height: 34px;
  padding: 4px 10px;
  border-radius: 50px;
  margin-right: 15px;
`;

export const IconWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`

export const ModalContainer = styled.ScrollView`
  padding: 20px 40px 10px 40px;
`

export const ModalTitle = styled.Text`
  font-family: Poppins;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  color: ${(props: any) => props.theme.colors.textGray};
  text-transform: capitalize;
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
