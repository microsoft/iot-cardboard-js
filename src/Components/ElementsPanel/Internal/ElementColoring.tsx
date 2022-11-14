import React from 'react';
import {
    IElementColoringProps,
    IElementColoringStyleProps,
    IElementColoringStyles
} from './ElementColoring.types';
import { getStyles } from './ElementColoring.styles';
import { classNamesFunction, styled, DirectionalHint } from '@fluentui/react';
import { Callout } from '@fluentui/react';
import ColorPills from '../../ColorPills/ColorPills';
import ColorPillsCalloutContent from '../../ColorPillsCalloutContent/ColorPillsCalloutContent';
import { useExtendedTheme } from '../../../Models/Hooks/useExtendedTheme';

const getClassNames = classNamesFunction<
    IElementColoringStyleProps,
    IElementColoringStyles
>();

const ElementColoring: React.FC<IElementColoringProps> = (props) => {
    const { colorings, isCalloutOpen = false, isModal, rowId, styles } = props;

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    if (!isModal) {
        return (
            <>
                <ColorPills visualColorings={colorings} width={'wide'} />
                {isCalloutOpen && (
                    <Callout
                        target={`#${rowId}`}
                        directionalHint={DirectionalHint.leftTopEdge}
                        styles={classNames.subComponentStyles.callout}
                        isBeakVisible={false}
                        gapSpace={8}
                    >
                        <ColorPillsCalloutContent visualColorings={colorings} />
                    </Callout>
                )}
            </>
        );
    } else {
        return <ColorPills visualColorings={colorings} width={'wide'} />;
    }
};

export default styled<
    IElementColoringProps,
    IElementColoringStyleProps,
    IElementColoringStyles
>(ElementColoring, getStyles);
