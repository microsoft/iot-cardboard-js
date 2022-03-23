import { getTheme, IconButton, IIconProps } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import { DTwin } from '../../Models/Constants';
import { IPopoverVisual } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { getDismissButtonStyles, getStyles } from './PopoverVisual.styles';

interface IPopoverVisualProps {
    onClose: () => any;
    popoverVisual: IPopoverVisual;
    twins: Record<string, DTwin>;
}

const cancelIcon: IIconProps = { iconName: 'Cancel' };

const PopoverVisual: React.FC<IPopoverVisualProps> = ({
    onClose,
    popoverVisual,
    twins
}) => {
    const boundaryRef = useRef<HTMLDivElement>(null);
    const titleId = useId('title');
    const theme = getTheme();
    const styles = getStyles(theme);

    return (
        <div ref={boundaryRef} className={styles.boundaryLayer}>
            <Draggable bounds="parent" defaultClassName={styles.draggable}>
                <div className={styles.modalContainer}>
                    <div className={styles.modalHeader}>
                        {popoverVisual?.title && (
                            <span
                                className={styles.modalTitle}
                                id={titleId}
                                title={popoverVisual.title}
                            >
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
                    Hello world model contents
                </div>
            </Draggable>
        </div>
    );
};

export default React.memo(PopoverVisual);
