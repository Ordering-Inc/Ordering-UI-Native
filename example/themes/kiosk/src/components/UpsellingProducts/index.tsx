import React,{ useState, useEffect } from 'react'
import Spinner from 'react-native-loading-spinner-overlay';
import { StyleSheet, View, Platform, ImageBackground } from 'react-native'
import {
  UpsellingPage as UpsellingPageController,
  useUtils,
  useLanguage
} from 'ordering-components/native'
import { OText, OModal, OButton, OImage } from '../shared'
import { UpsellingProductsParams } from '../../types'
import {
  Item,
  Details,
  CloseUpselling,
  CloseUpsellingLand
} from './styles'
import { ProductForm } from '../ProductForm';
import NavBar from '../NavBar';
import { Container } from '../../layouts/Container';
import GridContainer from '../../layouts/GridContainer';
import { PORTRAIT, useDeviceOrientation } from "../../../../../src/hooks/DeviceOrientation";
import { useTheme } from 'styled-components/native';
import FastImage from 'react-native-fast-image';

const UpsellingProductsUI = (props: UpsellingProductsParams) => {
  const {
    isCustomMode,
    upsellingProducts,
    business,
    handleUpsellingPage,
    openUpselling,
    canOpenUpselling,
    setCanOpenUpselling,
    onClose,
    resetInactivityTimeout,
  } = props
  const [actualProduct, setActualProduct] = useState<any>(null)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [{ parsePrice }] = useUtils()
  const [, t] = useLanguage()
  const [orientationState] = useDeviceOrientation();

  const styles = StyleSheet.create({
    imageStyle: {
      width: '100%',
      height: Platform.OS === 'ios' ? 250 : 180,
      resizeMode: Platform.OS === 'ios' ? 'contain' : 'cover',
      borderRadius: 10,
    },
    closeUpsellingButton: {
      marginVertical: 10,
      marginHorizontal: 20,
      marginLeft: orientationState.orientation === PORTRAIT ? 20 : 0
    },
    upsellingModal: {
      height: '50%',
      top: 250
    }
  })

  useEffect(() => {
    if (!isCustomMode) {
      if (upsellingProducts?.products?.length && !upsellingProducts.loading) {
        setCanOpenUpselling && setCanOpenUpselling(true)
      }
      if ((!upsellingProducts?.products?.length && !upsellingProducts.loading && !canOpenUpselling && openUpselling) ||
          (!upsellingProducts?.products?.length && !upsellingProducts.loading && openUpselling)) {
            handleUpsellingPage && handleUpsellingPage()
      }
    }
  }, [upsellingProducts.loading, upsellingProducts?.products.length])

  const handleFormProduct = (product: any) => {
    setActualProduct(product)
    setModalIsOpen(true)
  }

  const handleSaveProduct = () => {
    setActualProduct(null)
    setModalIsOpen(false)
  }

  const UpsellingLayout = () => {

    const theme = useTheme()

    return (
      <Container>
        {
          !upsellingProducts.loading ? (
            orientationState.orientation === PORTRAIT ? (
            <>
              <NavBar
                title={t('BEFORE_YOU_GO', 'Before you go')}
                onActionLeft={onClose}
                btnStyle={{paddingLeft: 0}}
              />

              <View style={{ marginVertical: orientationState?.dimensions?.height * 0.03 }}>
                <OText
                  size={orientationState?.dimensions?.width * 0.048}
                >
                  {t('DO_YOU_WANT', 'Do you want')} {'\n'}
                  <OText
                    size={orientationState?.dimensions?.width * 0.048}
                    weight={'700'}
                  >
                    {t('SOMETHING_ELSE', 'something else')} {'?'}
                  </OText>
                </OText>
              </View>


              <GridContainer>
                {
                  !upsellingProducts.error ? upsellingProducts.products.map((product: any) => (
                    <Item key={product.id}>
                      {product?.images ? (
                        <FastImage
                          style={styles.imageStyle}
                          source={{
                            uri: product?.images,
                            priority: FastImage.priority.normal,
                            // cache:FastImage.cacheControl.web
                          }}
                          resizeMode={FastImage.resizeMode.cover}
                        />
                      ) : (
                        <ImageBackground
                          style={styles.imageStyle}
                          source={theme.images.dummies.product}
                          imageStyle={{ borderRadius: 10 }}
                          resizeMode='cover'
                        />
                      )}
                      <Details>
                        <OText
                          weight="500"
                          size={18}
                          numberOfLines={2}
                          mBottom={10}
                        >
                          {product.name}
                        </OText>

                        <OText>
                          <OText
                            color={theme.colors.primary}
                            weight="500"
                          >
                            {parsePrice(product.price)}
                          </OText>

                          <OText
                            color={theme.colors.mediumGray}
                            size={12}
                            style={{textDecorationLine: 'line-through', textDecorationStyle: 'solid'}}
                          >
                            {product?.offer_price ? `  ${parsePrice(product?.offer_price)}  ` : ''}
                          </OText>
                        </OText>
                      </Details>

                      <OButton
                        text={t('ADD_PRODUCT', 'add product')}
                        textStyle={{ color: theme.colors.primary }}
                        style={{ height: 40, width: '100%' }}
                        bgColor="#EAF2FE"
                        borderColor="#EAF2FE"
                        onClick={() => {
                          resetInactivityTimeout()
                          handleFormProduct(product)
                        }}
                      />
                    </Item>
                  )) : (
                    <OText>
                      {upsellingProducts.message}
                    </OText>
                  )
                }
              </GridContainer>

              <View  style={{ height: orientationState?.dimensions?.height * 0.03 }} />
            </>
            ) : (
              <>
                <NavBar
                  title={t('BEFORE_YOU_GO', 'Before you go')}
                  onActionLeft={onClose}
                  btnStyle={{paddingLeft: 0}}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                  }}
                >
                  <View style={{ width: '65%', marginBottom: 30 }}>
                    <GridContainer>
                      {
                        !upsellingProducts.error ? upsellingProducts.products.map((product: any) => (
                          <React.Fragment key={product.id}>
                          {!product?.inventoried && (
                            <Item>
                              <OImage source={{ uri: product.images }} style={styles.imageStyle} />
                              <Details>
                                <OText
                                  weight="500"
                                  size={18}
                                  numberOfLines={3}
                                  mBottom={10}
                                  >
                                  {product.name}
                                </OText>

                                <OText>
                                  <OText
                                    color={theme.colors.primary}
                                    weight="500"
                                    >
                                    {parsePrice(product.price)}
                                  </OText>

                                  <OText
                                    color={theme.colors.mediumGray}
                                    size={12}
                                    style={{textDecorationLine: 'line-through', textDecorationStyle: 'solid'}}
                                    >
                                    {product?.offer_price ? parsePrice(product?.offer_price) : ''}
                                  </OText>
                                </OText>
                              </Details>
                              <OButton
                                text={t('ADD_PRODUCT', 'add product')}
                                textStyle={{ color: theme.colors.primary, textAlign: "center" }}
                                style={{ minHeight: 40, height: 'auto', width: '100%' }}
                                bgColor="#EAF2FE"
                                borderColor="#EAF2FE"
                                onClick={() => {
                                  resetInactivityTimeout()
                                  handleFormProduct(product)
                                }}
                              />
                            </Item>
                          )}
                          </React.Fragment>
                        )) : (
                          <OText>
                            {upsellingProducts.message}
                          </OText>
                        )
                      }
                    </GridContainer>
                  </View>
                  <View style={{ height: '100%', width: '35%' }}>
                    <OText
                      size={orientationState?.dimensions?.width * 0.040}
                    >
                      {t('DO_YOU_WANT', 'Do you want')} {'\n'}
                      <OText
                        size={orientationState?.dimensions?.width * 0.040}
                        weight={'700'}
                      >
                        {t('SOMETHING_ELSE', 'something else')} {'?'}
                      </OText>
                    </OText>
                    <CloseUpsellingLand>
                      <OButton
                        imgRightSrc=''
                        text={t('I_AM_FINE_THANK_YOU', 'I’m fine, thank you')}
                        style={styles.closeUpsellingButton}
                        onClick={() => {
                          resetInactivityTimeout()
                          handleUpsellingPage()
                        }}
                      />
                    </CloseUpsellingLand>
                  </View>
                </View>
              </>
            )
          ) : (
            <Spinner visible={upsellingProducts.loading} />
          )
        }
      </Container>
    )
  };

  return (
    <>
      {isCustomMode ? (
        <UpsellingLayout />
      ) : (
        <>
          {!canOpenUpselling || upsellingProducts?.products?.length === 0 ? null : (
            <>
            {!modalIsOpen && (
              <OModal
                open={openUpselling}
                onClose={() => handleUpsellingPage()}
                entireModal
                customClose
              >
               <UpsellingLayout />
                {orientationState.orientation == PORTRAIT && (
                  <CloseUpselling>
                    <OButton
                      imgRightSrc=''
                      text={t('I_AM_FINE_THANK_YOU', 'I’m fine, thank you')}
                      style={styles.closeUpsellingButton}
                      onClick={() => handleUpsellingPage()}
                    />
                  </CloseUpselling>
                )}
              </OModal>
            )}
            </>
          )}
        </>
      )}
      <OModal
        open={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        entireModal
        customClose
      >
        {actualProduct && (
         <ProductForm
          product={actualProduct}
          businessId={actualProduct?.api?.businessId}
          businessSlug={business.slug}
          onSave={() => handleSaveProduct()}
          onClose={() => setModalIsOpen(false)}
        />
        )}
      </OModal>
    </>
  )
}

export const UpsellingProducts = (props : UpsellingProductsParams) => {
  const upsellingProductsProps = {
    ...props,
    UIComponent: UpsellingProductsUI
  }
  return (
    <UpsellingPageController {...upsellingProductsProps} />
  )
}
