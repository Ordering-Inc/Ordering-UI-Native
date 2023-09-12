import * as React from 'react';
import styled from 'styled-components/native';
import { useTheme } from 'styled-components/native';

const Wrapper = styled.View`
  border-radius: 10px;
  border-width: 1px;
  border-color: ${(props: any) => props.theme.colors.lightGray};
`;

const Inner = styled.TextInput`
  height: 100px;
  padding: 5px 10px 5px 10px;
`;

interface Props {
  lines?: number;
  value?: string;
  placeholder?: string;
  onChange?: any;
  onFocus?: any;
  textTareaRef?: any;
  autoFocus?: boolean;
}

const OTextarea = (props: Props) => {
  const theme = useTheme();
  return (
    <Wrapper>
      <Inner
        ref={props.textTareaRef}
        onFocus={() => props.onFocus()}
        onChangeText={(txt: any) => props.onChange(txt)}
        placeholder={props.placeholder}
				placeholderTextColor={theme.colors.lightGray}
				numberOfLines={props.lines}
				underlineColorAndroid={'transparent'}
				value={props.value}
				multiline={true}
        autoFocus={props.autoFocus}
      />
    </Wrapper>
  );
};

export default OTextarea;
