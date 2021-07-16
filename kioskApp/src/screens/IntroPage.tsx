import React from 'react';
import Intro from '../components/Intro';

const IntroPage = (props: any): React.ReactElement => {
  return (
		<Intro
			{...props}
		/>
	);
};

export default IntroPage;
