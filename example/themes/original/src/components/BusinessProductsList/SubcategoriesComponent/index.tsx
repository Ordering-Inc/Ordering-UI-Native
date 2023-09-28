import React from 'react'
import { useTheme } from 'styled-components/native'
import { StyleSheet } from 'react-native'
import { SubCategoriesContainer, ContainerButton } from './styles'
import { OButton } from '../../shared'
import { useLanguage } from 'ordering-components/native'

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

    const theme = useTheme()
    const [, t] = useLanguage()
    const allsubcategorySelected = !subcategoriesSelected?.some((subcategory: any) => category?.id === subcategory?.parent_category_id)

    const bpStyles = StyleSheet.create({
        catWrap: { flexDirection: 'row', alignItems: 'center', marginBottom: 19 },
        catIcon: {
            borderRadius: 7.6,
            shadowColor: '#000000',
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 0 },
            shadowRadius: 1,
            marginEnd: 13,
        },
        categoryButtonStyle: {
            borderWidth: 0,
            marginLeft: 5,
            marginRight: 5,
            marginBottom: 10,
            height: 35,
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
                    text={`${t('ALL', 'All')} ${allsubcategorySelected ? 'X' : ''}`}
                    style={bpStyles.categoryButtonStyle}
                    textStyle={{ fontSize: 12 }}
                    isDisabled={!allsubcategorySelected}
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
                            text={`${subcategory?.name} ${isSubcategorySelected ? 'X' : ''}`}
                            style={bpStyles.categoryButtonStyle}
                            textStyle={{ fontSize: 12 }}
                            isDisabled={!allsubcategorySelected}
                        />
                    </ContainerButton>
                )
            }
            )}
        </SubCategoriesContainer>
    )
}

export const SubcategoriesComponentMemoized = React.memo(SubcategoriesComponent, SubcategoriesComponentPropsAreEqual)
