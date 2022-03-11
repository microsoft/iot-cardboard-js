import { Separator, Stack, IStackTokens, IStackStyles } from '@fluentui/react';
import React from 'react';
import { PanelFooterStyles } from './PanelFooter.styles';

interface IPanelFooterProps {
    className?: string;
}
const PanelFooter: React.FC<IPanelFooterProps> = ({ children, className }) => {
    return (
        <div className={`${PanelFooterStyles.root} ${className}`}>
            <Separator />
            <Stack horizontal tokens={sectionStackTokens} styles={stackStyles}>
                {children}
            </Stack>
        </div>
    );
};
const sectionStackTokens: IStackTokens = { childrenGap: 8 };
const stackStyles: IStackStyles = {
    root: {
        display: 'flex',
        padding: '12px 4px 24px 4px' // separator has weird built in padding on top
    }
};
export default PanelFooter;
