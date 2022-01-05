import styled from 'styled-components/native';

export const OptionTitle = styled.View``;

export const FiltersTab = styled.View`
  margin-bottom: 15px;
`;

export const OTabs = styled.View`
  display: flex;
  flex-direction: row;
`;

export const TagsContainer = styled.ScrollView`
  margin-bottom: 10px;
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
