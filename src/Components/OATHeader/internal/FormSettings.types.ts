import { IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { ISharedModalStyleProps, ISharedModalStyles } from './Shared.types';

export type FormSettingsProps = {
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    onClose?: () => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<FormSettingsStyleProps, FormSettingsStyles>;
};

export interface FormSettingsStyleProps extends ISharedModalStyleProps {
    theme: ITheme;
}

export interface FormSettingsStyles extends ISharedModalStyles {
    /**
     * SubComponent styles.
     */
    subComponentStyles?: FormSettingsComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface FormSettingsComponentStyles {}
