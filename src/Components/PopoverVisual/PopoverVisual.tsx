import {
    ContextualMenu,
    getTheme,
    IconButton,
    IIconProps,
    Modal
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import React from 'react';
import { DTwin } from '../../Models/Constants';
import { IPopoverVisual } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { getDismissButtonStyles, getStyles } from './PopoverVisual.styles';

interface IPopoverVisualProps {
    isOpen: boolean;
    onClose: () => any;
    popoverVisual: IPopoverVisual;
    twins: Record<string, DTwin>;
}

const cancelIcon: IIconProps = { iconName: 'Cancel' };

const PopoverVisual: React.FC<IPopoverVisualProps> = ({
    isOpen,
    onClose,
    popoverVisual,
    twins
}) => {
    const titleId = useId('title');
    const theme = getTheme();
    const styles = getStyles(theme);

    return (
        <div className={styles.popoverBoundaryLayer}>
            <Modal
                titleAriaId={titleId}
                onDismiss={onClose}
                isModeless={true}
                dragOptions={{
                    keepInBounds: true,
                    moveMenuItemText: 'Move',
                    closeMenuItemText: 'Close',
                    menu: ContextualMenu
                }}
                isOpen={isOpen}
                containerClassName={styles.modalContainer}
                isClickableOutsideFocusTrap={true}
            >
                <div className={styles.modalHeader}>
                    {popoverVisual?.title && (
                        <span className={styles.modalTitle} id={titleId}>
                            {popoverVisual.title}
                        </span>
                    )}
                    <IconButton
                        styles={getDismissButtonStyles(theme)}
                        iconProps={cancelIcon}
                        ariaLabel="Close popup modal"
                        onClick={onClose}
                    />
                </div>
            </Modal>
        </div>
    );
};

export default React.memo(PopoverVisual);
