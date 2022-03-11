import {
    mergeStyleSets,
    Separator,
    IStyle,
    Stack,
    IStackTokens,
    IStackStyles
} from '@fluentui/react';
import React from 'react';

interface IPanelFooterProps {
    className?: string;
}
const PanelFooter: React.FC<IPanelFooterProps> = ({ children, className }) => {
    return (
        <div className={`${styles.root} ${className}`}>
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
        padding: '12px 20px 24px 20px' // separator has weird built in padding on top
    }
};
const styles = mergeStyleSets({
    root: {
        display: 'flex',
        flexDirection: 'column'
    } as IStyle,
    content: {} as IStyle
});
export default PanelFooter;
