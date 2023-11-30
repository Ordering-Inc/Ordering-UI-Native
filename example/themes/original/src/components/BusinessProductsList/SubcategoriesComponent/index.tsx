import React from 'react'
import { StyleSheet } from 'react-native'
import { useLanguage } from 'ordering-components/native'
import FIcon from 'react-native-vector-icons/Feather'
import { SubCategoriesContainer, ContainerButton } from './styles'
import { OButton, OText } from '../../shared'

function SubcategoriesComponentPropsAreEqual(prev: any, next: any) {
  return prev.subcategoriesSelected === next.subcategoriesSelected &&
    prev.category === next.category
}

interface SubcategoriesComponentParams {
  subcategoriesSelected?: any,
  category?: any,
  onClickSubcategory: any
}

const SubcategoriesComponent = (props: SubcategoriesComponentParams) => {
  const {
    subcategoriesSelected,
    category,
    onClickSubcategory
  } = props

  const [, t] = useLanguage()
  const allsubcategorySelected = !subcategoriesSelected?.some((subcategory: any) => category?.id === subcategory?.parent_category_id)

  const bpStyles = StyleSheet.create({
    categoryButtonStyle: {
      borderWidth: 0,
      marginRight: 5,
      borderRadius: 8,
      marginBottom: 5,
      height: 35,
      padding: 0,
      paddingLeft: 3,
      paddingRight: 3,
    }
  });


  return (
    <SubCategoriesContainer>
      <ContainerButton
        isSelected={allsubcategorySelected}
      >
        <OButton
          onClick={() => onClickSubcategory(null, category)}
          text={
            allsubcategorySelected
              ? <OText color='#FFF'>
                  {t('ALL', 'All')}{' '}
                  <FIcon name='x-circle' size={16} />
                </OText>
              : t('ALL', 'All')
          }
          style={bpStyles.categoryButtonStyle}
          textStyle={{ fontSize: 12 }}
        />
      </ContainerButton>
      {category?.subcategories?.map((subcategory: any) => {
        const isSubcategorySelected = subcategoriesSelected?.find((_subcategory: any) => _subcategory?.id === subcategory?.id)
        return (
          <ContainerButton
            key={subcategory?.id}
            isSelected={isSubcategorySelected}
          >
            <OButton
              onClick={() => onClickSubcategory(subcategory, category)}
              text={
                isSubcategorySelected
                  ? <OText color='#FFF'>
                      {subcategory?.name}{' '}
                      <FIcon name='x-circle' size={16} />
                    </OText>
                  : subcategory?.name
              }
              style={bpStyles.categoryButtonStyle}
              textStyle={{ fontSize: 12 }}
            />
          </ContainerButton>
        )
      }
      )}
    </SubCategoriesContainer>
  )
}

export const SubcategoriesComponentMemoized = React.memo(SubcategoriesComponent, SubcategoriesComponentPropsAreEqual)
