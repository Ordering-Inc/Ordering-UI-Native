import React,{ useState, useEffect } from 'react'
import Spinner from 'react-native-loading-spinner-overlay';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import { Dimensions, StyleSheet, View } from 'react-native'
import {
  UpsellingPage as UpsellingPageController,
  useUtils,
  useLanguage
} from 'ordering-components/native'
import { OText, OIcon, OModal, OBottomPopup, OButton, OImage } from '../shared'
import { colors } from '../../theme.json'
import { UpsellingProductsParams } from '../../types'
import {
  Item,
  Details,
  AddButton,
  CloseUpselling
} from './styles'
import { ProductForm } from '../ProductForm';
import NavBar from '../NavBar';
import { Container } from '../../layouts/Container';
import GridContainer from '../../layouts/GridContainer';

const _dim = Dimensions.get('window');

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
  } = props
  const [actualProduct, setActualProduct] = useState<any>(null)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [{ parsePrice }] = useUtils()
  const [, t] = useLanguage()

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
    return (
      <Container>
        {
          !upsellingProducts.loading ? (
            <>
              <NavBar
                title={t('BEFORE_YOU_GO', 'Before you go')}
                onActionLeft={onClose}
              />

              <View style={{ marginVertical: _dim.height * 0.03 }}>
                <OText
                  size={_dim.width * 0.05}
                >
                  {t('DO_YOU_WANT', 'Do you want')} {'\n'}
                  <OText
                    size={_dim.width * 0.05}
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
                      <OImage source={{ uri: product.images }} style={styles.imageStyle} />
                      <Details>
                        <OText
                          weight="500"
                          size={18}
                          numberOfLines={2}
                          mBottom={10}
                        >
                          {product.name}
                        </OText>

                        {product?.price && (
                          <OText>
                            <OText
                              color={colors.primary}
                              weight="500"
                            >
                              {`$${product.price}`}
                            </OText>

                            <OText
                              color={colors.mediumGray}
                              size={12}
                              style={{textDecorationLine: 'line-through', textDecorationStyle: 'solid'}}
                            >
                              {product?.offer_price ? `  $${product?.offer_price}  ` : ''}
                            </OText>
                          </OText>
                        )}
                      </Details>

                      <OButton
                        text={t('ADD_PRODUCT', 'add product')}
                        textStyle={{ color: colors.primary }}
                        style={{ height: 40, width: '100%' }}
                        bgColor="#EAF2FE"
                        borderColor="#EAF2FE"
                        onClick={() => handleFormProduct(product)}
                      />
                    </Item>
                  )) : (
                    <OText>
                      {upsellingProducts.message}
                    </OText>
                  )
                }
              </GridContainer>

              <View  style={{ height: _dim.height * 0.03 }} />
            </>
          ) : (
            <Spinner visible={upsellingProducts.loading} />
          )
        }
      </Container>
    )
  }
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
                <CloseUpselling>
                  <OButton
                    imgRightSrc=''
                    text={t('I_AM_FINE_THANK_YOU', 'I’m fine, thank you')}
                    style={styles.closeUpsellingButton}
                    onClick={() => handleUpsellingPage()}
                  />
                </CloseUpselling>
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

const styles = StyleSheet.create({
  imageStyle: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  closeUpsellingButton: {
    marginVertical: 10,
    marginHorizontal: 20,
  },
  upsellingModal: {
    height: '50%',
    top: 250
  }
})

export const UpsellingProducts = (props : UpsellingProductsParams) => {
  const upsellingProductsProps = {
    ...props,
    UIComponent: UpsellingProductsUI
  }
  return (
    <UpsellingPageController {...upsellingProductsProps} />
  )
}
