import * as React from 'react';
import styled, {css} from 'styled-components/native';

const SImage = styled.Image`
  width: ${(props:any) => css`${props?.width || 0}`}px;
  height: ${(props:any) => css`${props?.height || 0}`}px;
	overflow: ${(props:any) => css`${props?.overflow || 'visible'}`};
	resizeMode: ${(props:any) => css`${props?.resizeMode || 'contain'}`};
`;

interface Props {
  source: string,
  width?: number,
  height?: number,
	resizeMode?: string,
  overflow?: string,
}

const OImage = (props: Props): React.ReactElement => {
  return (
    <SImage
      {...props}
    />
  );
};

export default OImage;
