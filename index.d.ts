import * as React from 'react';
import { OToggleProps } from './src/components/shared/OToggle';
import { OTextAreaProps } from './src/components/shared/OTextarea';
import { OIconButtonProps } from './src/components/shared/OIconButton';
import { OCheckboxProps } from './src/components/shared/OCheckbox';
import { ODropDownProps } from './src/components/shared/ODropDown';
import { OSegmentProps } from './src/components/shared/OSegment';
import { OInputProps } from './src/components/shared/OInput';
import { OButtonProps } from './src/components/shared/OButton';
import { OTextProps } from './src/components/shared/OText';
import { OIconProps } from './src/components/shared/OIcon';
import { LoginParams, PhoneInputParams } from './src/types';

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

declare class LoginForm extends React.Component<LoginParams> { }
declare class PhoneInput extends React.Component<PhoneInputParams> {}

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
    LoginForm,
    PhoneInput
}
