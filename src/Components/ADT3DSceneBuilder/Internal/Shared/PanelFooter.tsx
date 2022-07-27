import { Separator, Stack, IStackTokens, css } from '@fluentui/react';
import React from 'react';
import {
    PanelFooterStackStyles,
    PanelFooterStyles
} from './PanelFooter.styles';

interface IPanelFooterProps {
    className?: string;
}
const sectionStackTokens: IStackTokens = { childrenGap: 8 };
const PanelFooter: React.FC<IPanelFooterProps> = ({ children, className }) => {
    return (
        <div className={css(PanelFooterStyles.root, className)}>
            <Separator />
            <Stack
                horizontal
                tokens={sectionStackTokens}
                styles={PanelFooterStackStyles}
            >
                {children}
            </Stack>
        </div>
    );
};
export default PanelFooter;
