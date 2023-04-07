import { IStyle, IStyleFunctionOrObject } from '@fluentui/react';
import { IExtendedTheme } from '../../../../Theming/Theme.types';
import { ITargetDatabaseConnection } from '../../Contexts/AppDataContext/AppDataContext.types';

export interface IStoreListProps {
    onNavigateNext: (args: {
        targetDatabase: ITargetDatabaseConnection;
    }) => void;
    /**
     * Call to provide customized styling that will layer on top of the variant rules.
     */
    styles?: IStyleFunctionOrObject<IStoreListStyleProps, IStoreListStyles>;
}

export interface IStoreListStyleProps {
    theme: IExtendedTheme;
}
export interface IStoreListStyles {
    root: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IStoreListSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IStoreListSubComponentStyles {}
