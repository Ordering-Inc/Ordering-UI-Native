import React from 'react'
import { AddressForm as AddressFormController, useLanguage } from 'ordering-components/native'
import { AddressFormContainer } from './styles'
import { OInput } from '../shared'
import NavBar from '../NavBar'
import {Container} from '../../layouts/Container'

export const AddressFormUI = (props) => {
    const [, t] = useLanguage()
    const {navigation, route} = props

    const {previousComponent, address, nopadding} = route?.params

    const onNavigationRedirect = (page: string) => {
        navigation.navigate(page)
    }

    const goToBack = () => onNavigationRedirect(previousComponent)

    return (
        <Container>
            <NavBar
                title={t('ADDRESS_FORM', 'Address Form')}
                titleAlign={'center'}
                onActionLeft={goToBack}
                showCall={false}
                btnStyle={{ paddingLeft: 0 }}
            />
            <OInput placeholder={t('ADD_ADDRESS', 'Add a Address')} />
        </Container>
    )
}

export const AddressForm = (props) => {
    const addressFormProps = {
        ...props,
        UIComponent: AddressFormUI
    }
    return <AddressFormController {...addressFormProps} />
}
