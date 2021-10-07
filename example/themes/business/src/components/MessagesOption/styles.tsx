import styled from 'styled-components/native';

export const FiltersTab = styled.View`
  margin-bottom: 20px;
`;

export const TabsContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom-width: 1px;
  border-bottom-color: #e9ecef;
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
