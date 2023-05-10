import React, { useEffect, useState, useRef } from 'react'
import { useUtils, useEvent, PageBanner as PageBannerController } from 'ordering-components/native'
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
  const [events] = useEvent()
  const carouselRef = useRef<any>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [viewedBanner, setViewedBanner] = useState<any>(null)

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
		navigation.push(route, params)
	}

  const handleGoToPage = (item: any) => {
    const action = item.action
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
        productId: action.product_id,
        isRedirect: 'business',
        business: {
          store: slug
        }
			})
    }
    const clickedBanner = pageBannerState.result.find(banner => banner.id === item?.banner_id)
    events.emit('promotion_clicked', clickedBanner)
  }

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => handleGoToPage(item)}
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

  const updateIndex = () => {
    setCurrentIndex(carouselRef?.current?.currentIndex)
  }

  useEffect(() => {
    if (pageBannerState.loading) return
    if (pageBannerState.banner?.items && pageBannerState.banner?.items.length > 0) {
      const bannerId = pageBannerState.banner.items[currentIndex]?.banner_id
      if (pageBannerState.result && bannerId) {
        const _viewedBanner = pageBannerState.result.find(banner => banner.id === bannerId)
        if (_viewedBanner?.id !== viewedBanner?.id) {
          setViewedBanner(_viewedBanner)
          events.emit('promotion_viewed', _viewedBanner)
        }
      }
    }
  }, [pageBannerState.loading, currentIndex, viewedBanner])

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
              {pageBannerState.banner?.items.length > 1 && (
                <>
                  <TouchableOpacity
                    activeOpacity={1}
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
                    activeOpacity={1}
                    style={[styles.swiperButton, { right: 25 }]}
                    onPress={() => carouselRef.current.snapToNext()}
                  >
                    <IconAntDesign
                      name="caretright"
                      color={theme.colors.white}
                      size={13}
                    />
                  </TouchableOpacity>
                </>
              )}
              <Carousel
                ref={carouselRef}
                loop={pageBannerState.banner?.items.length > 1}
                data={pageBannerState.banner?.items}
                renderItem={renderItem}
                sliderWidth={windowWidth}
                itemWidth={windowWidth}
                inactiveSlideScale={1}
                pagingEnabled
                removeClippedSubviews={false}
                inactiveSlideOpacity={1}
                onSnapToItem={updateIndex}
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
