import React, { useRef } from 'react'
import { useUtils, PageBanner as PageBannerController } from 'ordering-components/native'

import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import Carousel from 'react-native-snap-carousel'
import FastImage from 'react-native-fast-image';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import { useTheme } from 'styled-components/native';
import { PageBannerWrapper, ArrowButtonsContainer } from './styles'

const PageBannerUI = (props: any) => {
  const {
    pageBannerState
  } = props

	const theme = useTheme();
	const [{ optimizeImage }] = useUtils();
  const carouselRef = useRef(null)

  const windowWidth = Dimensions.get('window').width;

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

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.sliderWrapper}>
        <FastImage
          style={{ height: '100%', width: '100%' }}
          resizeMode='cover'
          source={{ uri: optimizeImage(item.url, 'h_300,c_limit') }}
        />
      </View>
    )
  }

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
              <ArrowButtonsContainer>
                <TouchableOpacity
                  style={styles.swiperButton}
                  onPress={() => carouselRef.current.snapToPrev()}
                >
                  <IconAntDesign
                    name="caretleft"
                    color={theme.colors.white}
                    size={13}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.swiperButton}
                  onPress={() => carouselRef.current.snapToNext()}
                >
                  <IconAntDesign
                    name="caretright"
                    color={theme.colors.white}
                    size={13}
                  />
                </TouchableOpacity>
              </ArrowButtonsContainer>
              <Carousel
                ref={carouselRef}
                loop={pageBannerState.banner?.items.length > 1}
                data={pageBannerState.banner?.items}
                renderItem={renderItem}
                sliderWidth={windowWidth - 80}
                itemWidth={windowWidth - 80}
                inactiveSlideScale={1}
                pagingEnabled
                removeClippedSubviews={false}
                inactiveSlideOpacity={1}
              />
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
