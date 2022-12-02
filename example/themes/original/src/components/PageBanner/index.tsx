import React from 'react'
import { useUtils, PageBanner as PageBannerController } from 'ordering-components/native'

import { View, StyleSheet } from 'react-native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import Swiper from 'react-native-swiper'
import FastImage from 'react-native-fast-image';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import { useTheme } from 'styled-components/native';
import { PageBannerWrapper } from './styles'

const PageBannerUI = (props: any) => {
  const {
    pageBannerState
  } = props

	const theme = useTheme();
	const [{ optimizeImage }] = useUtils();

  const styles = StyleSheet.create({
    mainSwiper: {
			height: 300,
		},
    swiperButton: {
			marginHorizontal: 25,
			alignItems: 'center',
			justifyContent: 'center',
			width: 32,
			height: 32,
			borderRadius: 16,
			backgroundColor: 'rgba(208,208,208,0.5)'
		},
    sliderWrapper: {
      width: '100%',
      height: 300
    }
  })

  return (
    <>
      {pageBannerState.loading ? (
        <PageBannerWrapper>
          <Placeholder
            Animation={Fade}
          >
            <PlaceholderLine
							height={300}
							style={{ marginBottom: 20, borderRadius: 8 }}
						/>
          </Placeholder>
        </PageBannerWrapper>
      ) : (
        <>
          {pageBannerState.banner?.items && pageBannerState.banner?.items.length > 0 && (
            <PageBannerWrapper>
              <Swiper
                loop={pageBannerState.banner?.items.length > 1}
                showsButtons={true}
                style={styles.mainSwiper}
                showsPagination={false}
                prevButton={
                  <View style={styles.swiperButton}>
                    <IconAntDesign
                      name="caretleft"
                      color={theme.colors.white}
                      size={13}
                    />
                  </View>
                }
                nextButton={
                  <View style={styles.swiperButton}>
                    <IconAntDesign
                      name="caretright"
                      color={theme.colors.white}
                      size={13}
                    />
                  </View>
                }
              >
                {pageBannerState.banner?.items.map((img, i) => (
                  <View key={i} style={styles.sliderWrapper}>
                    <FastImage
                      style={{ height: '100%', width: '100%' }}
                      resizeMode='cover'
                      source={{ uri: optimizeImage(img.url, 'h_300,c_limit') }}
                    />
                  </View>
                ))}
              </Swiper>
            </PageBannerWrapper>
          )}
        </>
      )}
    </>
  )
}

export const PageBanner = (props: any) => {
  const pageBannerProps = {
    ...props,
    UIComponent: PageBannerUI
  }
  return <PageBannerController {...pageBannerProps} />
}
