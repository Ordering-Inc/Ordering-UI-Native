import React, { useRef } from 'react'
import { useUtils, PageBanner as PageBannerController } from 'ordering-components/native'
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import { Fade, Placeholder, PlaceholderLine } from 'rn-placeholder';
import Carousel from 'react-native-snap-carousel'
import FastImage from 'react-native-fast-image';
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import { useTheme } from 'styled-components/native';
import { PageBannerWrapper } from './styles'

const PageBannerUI = (props: any) => {
  const {
    pageBannerState,
    navigation
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
      position: 'absolute',
      zIndex: 100,
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

  const onRedirect = (route: string, params?: any) => {
		navigation.navigate(route, params)
	}

  const handleGoToPage = (action: any) => {
    if (!action?.url) return
    let slug
    if (action.type === 'business') {
      slug = action.url.split('store/')[1]
      onRedirect('Business', {
        store: slug
      })
    }
    if (action.type === 'product') {
      slug = action.url.split('store/')[1]?.split('?')[0]
      onRedirect('ProductDetails', {
				businessSlug: slug,
				businessId: action.business_id,
        categoryId: action.category_id,
        productId: action.product_id
			})
    }
  }

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => handleGoToPage(item.action)}
      >
        <View style={styles.sliderWrapper}>
          <FastImage
            style={{ height: '100%', width: '100%' }}
            resizeMode='cover'
            source={{ uri: optimizeImage(item.url, 'h_300,c_limit') }}
          />
        </View>
      </TouchableOpacity>
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
              <TouchableOpacity
                style={[styles.swiperButton, { left: 25 }]}
                onPress={() => carouselRef.current.snapToPrev()}
              >
                <IconAntDesign
                  name="caretleft"
                  color={theme.colors.white}
                  size={13}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.swiperButton, { right: 25 }]}
                onPress={() => carouselRef.current.snapToNext()}
              >
                <IconAntDesign
                  name="caretright"
                  color={theme.colors.white}
                  size={13}
                />
              </TouchableOpacity>
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
