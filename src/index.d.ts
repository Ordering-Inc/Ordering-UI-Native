import * as React from 'react';
import { OToggleProps } from './components/shared/OToggle';
import { OTextAreaProps } from './components/shared/OTextarea';
import { OIconButtonProps } from './components/shared/OIconButton';
import { OCheckboxProps } from './components/shared/OCheckbox';
import { ODropDownProps } from './components/shared/ODropDown';
import { OSegmentProps } from './components/shared/OSegment';
import { OInputProps } from './components/shared/OInput';
import { OButtonProps } from './components/shared/OButton';
import { OTextProps } from './components/shared/OText';
import { OIconProps } from './components/shared/OIcon';
import {
    AddressFormParams,
    BusinessControllerParams,
    BusinessProductsListParams,
    BusinessProductsListingParams,
    BusinessTypeFilterParams,
    ForgotPasswordParams,
    GoogleMapsParams,
    LanguageSelectorParams,
    LoginParams,
    NotFoundSourceParams,
    OrderTypeSelectParams,
    PhoneInputParams,
    SearchBarParams,
    SignupParams,
    SingleProductCardParams,
} from './types';
import { BusinessesListingParams } from '../example/src/types';

declare class OText extends React.Component<OTextProps> { }
declare class OButton extends React.Component<OButtonProps> { }
declare class OInput extends React.Component<OInputProps> { }
declare class OSegment extends React.Component<OSegmentProps> { }
declare class OIcon extends React.Component<OIconProps> { }
declare class ODropDown extends React.Component<ODropDownProps> { }
declare class OIconText extends React.Component<OIconProps> { }
declare class OCheckbox extends React.Component<OCheckboxProps> { }
declare class OIconButton extends React.Component<OIconButtonProps> { }
declare class OTextarea extends React.Component<OTextAreaProps> { }
declare class OToggle extends React.Component<OToggleProps> { }

declare class AddressForm extends React.Component<AddressFormParams> { }
declare class BusinessController extends React.Component<BusinessControllerParams> { }
declare class BusinessesListing extends React.Component<BusinessesListingParams> { }
declare class BusinessProductsList extends React.Component<BusinessProductsListingParams> { }
declare class BusinessTypeFilter extends React.Component<BusinessTypeFilterParams> { }
declare class ForgotPassword extends React.Component<ForgotPasswordParams> { }
declare class GoogleMap extends React.Component<GoogleMapsParams> { }
declare class LanguageSelector extends React.Component<LanguageSelectorParams> { }
declare class LoginForm extends React.Component<LoginParams> { }
declare class NotFoundSource extends React.Component<NotFoundSourceParams> { }
declare class OrderTypeSelector extends React.Component<OrderTypeSelectParams> { }
declare class PhoneInputNumber extends React.Component<PhoneInputParams> {}
declare class SearchBar extends React.Component<SearchBarParams> { }
declare class SignupForm extends React.Component<SignupParams> { }
declare class SingleProductCard extends React.Component<SingleProductCardParams> { }

export {
    OText,
    OButton,
    OInput,
    OSegment,
    ODropDown,
    OIcon,
    OIconText,
    OCheckbox,
    OIconButton,
    OTextarea,
    OToggle,
    AddressForm,
    BusinessesListing,
    BusinessTypeFilter,
    BusinessController,
    BusinessProductsList,
    ForgotPassword,
    GoogleMap,
    LanguageSelector,
    NotFoundSource,
    OrderTypeSelector,
    SearchBar,
    SignupForm,
    SingleProductCard,
    LoginForm,
    PhoneInputNumber
}
