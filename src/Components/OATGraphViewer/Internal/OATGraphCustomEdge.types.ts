import { IStyleFunctionOrObject, IStyle } from '@fluentui/react';
import { EdgeProps } from 'react-flow-renderer';
import { IOATRelationshipElement } from '../../../Models/Constants';
import { IExtendedTheme } from '../../../Theming/Theme.types';

export type IOATGraphCustomEdgeProps = IOATRelationshipElement &
    EdgeProps & {
        /**
         * Call to provide customized styling that will layer on top of the variant rules.
         */
        styles?: IStyleFunctionOrObject<
            IOATGraphCustomEdgeStyleProps,
            IOATGraphCustomEdgeStyles
        >;
    };

export interface IOATGraphCustomEdgeStyleProps {
    theme: IExtendedTheme;
}
export interface IOATGraphCustomEdgeStyles {
    stackedReferenceCountLabelRoot: IStyle;
    stackedReferenceCountLabel: IStyle;
    stackedReferencesList: IStyle;

    /**
     * SubComponent styles.
     */
    subComponentStyles?: IOATGraphCustomEdgeSubComponentStyles;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IOATGraphCustomEdgeSubComponentStyles {}
