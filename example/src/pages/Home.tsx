import React from 'react';
import { StyleSheet, SafeAreaView, ImageBackground, View, ImageSourcePropType } from 'react-native';
import { HomeView } from '../themes/original';
import { theme } from '../themes/original';

export const Home = (props: any) => {

	const homeProps = {
		...props,
		onNavigationRedirect: (page: string, params: any) => {
			if (!page) return
			props.navigation.navigate(page, params);
		},
	}

	const homeImage: ImageSourcePropType = theme.images.general
    .homeHero as ImageSourcePropType;

	return (
		<ImageBackground source={homeImage} style={styles.bg}>
			<View style={styles.mask}>
				<SafeAreaView style={styles.wrapper}>
					<HomeView {...homeProps} />
				</SafeAreaView>
			</View>
		</ImageBackground>
	);
};

const styles = StyleSheet.create({
	bg: {
	  flex: 1,
	},
	wrapper: {
	  flex: 1,
	  justifyContent: 'center',
	  alignItems: 'center',
	},
	mask: {
	  width: '100%',
	  height: '100%',
	  backgroundColor: '#0000004D',
	},
 });

export default Home;
