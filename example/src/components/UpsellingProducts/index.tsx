import React,{ useState, useEffect } from 'react'
import { StyleSheet } from 'react-native'
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import {
  UpsellingPage as UpsellingPageController,
  useUtils,
  useLanguage
} from 'ordering-components/native'
import { OText, OIcon, OModal, OBottomPopup, OButton } from '../shared'
import { UpsellingProductsParams } from '../../types'
import {
  Container,
  UpsellingContainer,
  Item,
  Details,
  AddButton,
  CloseUpselling
} from './styles'
import { ProductForm } from '../ProductForm';
import { useTheme } from 'styled-components/native'

const UpsellingProductsUI = (props: UpsellingProductsParams) => {
  const {
    isCustomMode,
    upsellingProducts,
    business,
    handleUpsellingPage,
    openUpselling,
    canOpenUpselling,
    setCanOpenUpselling
  } = props

  const theme = useTheme();

  const styles = StyleSheet.create({
    imageStyle: {
      width: 120,
      height: 90,
      resizeMode: 'cover',
      borderRadius: 10
    },
    closeUpsellingButton: {
      borderRadius: 25,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.white,
      borderWidth: 1,
      height: 42,
      marginBottom: 10
    },
    upsellingModal: {
      height: '50%',
      top: 250
    }
  })

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
        <UpsellingContainer
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {
            !upsellingProducts.loading && (
              <>
                {
                  !upsellingProducts.error ? upsellingProducts.products.map((product: any) => (
                    <Item
                      key={product.id}
                    >
                      <OIcon
                        url={product.images}
                        style={styles.imageStyle}
                      />
                      <Details>
                        <OText size={12} numberOfLines={1} ellipsizeMode='tail'>{product.name}</OText>
                        <OText color={theme.colors.primary} weight='bold'>{parsePrice(product.price)}</OText>
                      </Details>
                      <AddButton onPress={() => handleFormProduct(product)}>
                        <MaterialComIcon
                          name='plus-circle'
                          color={theme.colors.primary}
                          size={35}
                        />
                      </AddButton>
                    </Item>
                  )) : (
                    <OText>
                      {upsellingProducts.message}
                    </OText>
                  )
                }
              </>
            )
          }
        </UpsellingContainer>
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
              <OBottomPopup
                title={t('WANT_SOMETHING_ELSE', 'Do you want something else?')}
                open={openUpselling}
                onClose={() => handleUpsellingPage()}
              >
               <UpsellingLayout />
                <CloseUpselling>
                  <OButton
                    imgRightSrc=''
                    text={t('NO_THANKS', 'No Thanks')}
                    style={styles.closeUpsellingButton}
                    onClick={() => handleUpsellingPage()}
                  />
                </CloseUpselling>
              </OBottomPopup>
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
        isAvoidKeyBoardView
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
