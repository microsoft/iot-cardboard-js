import { ITheme, IStyleFunctionOrObject } from '@fluentui/react';
import { ISharedModalStyles, ISharedModalStyleProps } from './Shared.types';

export interface IFormOpenProps {
    setModalBody?: React.Dispatch<React.SetStateAction<string>>;
    onClose?: () => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IFormOpenStyleProps, IFormOpenStyles>;
}

export interface IFormOpenStyleProps extends ISharedModalStyleProps {
    theme: ITheme;
}

export interface IFormOpenStyles extends ISharedModalStyles {
    /**
     * SubComponent styles.
     */
    subComponentStyles?: IFormOpenComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IFormOpenComponentStyles {}
