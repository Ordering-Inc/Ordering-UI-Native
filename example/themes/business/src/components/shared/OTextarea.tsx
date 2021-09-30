import * as React from 'react';
import styled from 'styled-components/native';
import { useTheme } from 'styled-components/native';

const Wrapper = styled.View`
  padding: 10px;
  border-radius: 10px;
  border: 1px solid ${(props: any) => props.theme.colors.lightGray};
`;
const Inner = styled.TextInput`
  height: 100px;
`;

interface Props {
  lines?: number;
  value?: string;
  placeholder?: string;
  onChange?: any;
  onFocus?: any;
  textTareaRef?: any;
}

const OTextarea = (props: Props) => {
  const theme = useTheme();
  return (
    <Wrapper>
      <Inner
        ref={props.textTareaRef}
        onFocus={() => props.onFocus()}
        onChangeText={(txt: any) => props.onChange(txt)}
        textAlignVertical={'top'}
        placeholder={props.placeholder}
        placeholderTextColor={theme.colors.arrowColor}
        numberOfLines={props.lines}
        underlineColorAndroid={'transparent'}
        value={props.value}
        multiline={true}
        selectionColor={theme.colors.primary}
        color={theme.colors.textGray}
      />
    </Wrapper>
  );
};

export default OTextarea;
