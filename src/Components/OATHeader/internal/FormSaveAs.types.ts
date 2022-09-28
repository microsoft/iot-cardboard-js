import { IStyleFunctionOrObject, ITheme, IModalStyles } from '@fluentui/react';
import { ISharedModalStyleProps, ISharedModalStyles } from './Shared.types';

export type IFormSaveAsProps = {
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    resetProject?: () => void;
    resetProjectOnSave?: boolean;
    onClose?: () => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IFormSaveAsStyleProps, IFormSaveAsStyles>;
};

export interface IFormSaveAsStyleProps extends ISharedModalStyleProps {
    theme: ITheme;
}

export interface IFormSaveAsStyles extends ISharedModalStyles {
    /**
     * SubComponent styles.
     */
    subComponentStyles?: IFormSaveAsComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IFormSaveAsComponentStyles {}
