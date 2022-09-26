import { IStyle, IStyleFunctionOrObject, ITheme } from '@fluentui/react';
import { ISubMenuStyleProps, ISubMenuStyles } from './Shared.types';

export type IImportSubMenuProps = {
    setSubMenuActive: React.Dispatch<React.SetStateAction<boolean>>;
    isActive?: boolean;
    targetId?: string;
    uploadFile?: () => void;
    uploadFolder?: () => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<
        IImportSubMenuStyleProps,
        IImportSubMenuStyles
    >;
};

export interface IImportSubMenuStyleProps extends ISubMenuStyleProps {
    theme: ITheme;
}

export interface IImportSubMenuStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IImportSubMenuSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IImportSubMenuSubComponentStyles extends ISubMenuStyles {}
