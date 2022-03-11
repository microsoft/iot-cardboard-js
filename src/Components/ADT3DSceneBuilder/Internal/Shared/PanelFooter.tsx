import { mergeStyleSets, Separator, IStyle } from '@fluentui/react';
import React from 'react';

interface IPanelFooterProps {
    className?: string;
}
const PanelFooter: React.FC<IPanelFooterProps> = ({ children, className }) => {
    return (
        <div className={`${styles.root} ${className}`}>
            <Separator />
            <div className={styles.content}>{children}</div>
        </div>
    );
};
const styles = mergeStyleSets({
    root: {
        display: 'flex',
        flexDirection: 'column'
    } as IStyle,
    content: {
        display: 'flex',
        padding: '12px 20px 24px 20px' // separator has weird built in padding on top
    } as IStyle
});
export default PanelFooter;
