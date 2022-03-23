import { getTheme, IconButton, IIconProps, Separator } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import { DTwin } from '../../Models/Constants';
import {
    IBehavior,
    ITwinToObjectMapping
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    dismissButtonStyles,
    getSeparatorStyles,
    getStyles
} from './BehaviorsModal.styles';

export interface IBehaviorsModalProps {
    onClose: () => any;
    element: ITwinToObjectMapping;
    behaviors: IBehavior[];
    twins: Record<string, DTwin>;
}

const cancelIcon: IIconProps = { iconName: 'Cancel' };

const BehaviorsModal: React.FC<IBehaviorsModalProps> = ({
    onClose,
    behaviors,
    element,
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
                        {element?.displayName && (
                            <span
                                className={styles.modalTitle}
                                id={titleId}
                                title={element.displayName}
                            >
                                {element.displayName}
                            </span>
                        )}
                        <IconButton
                            styles={dismissButtonStyles}
                            iconProps={cancelIcon}
                            ariaLabel="Close popup modal"
                            onClick={onClose}
                        />
                    </div>
                    Hello world model contents
                    <Separator styles={getSeparatorStyles(theme)} />
                </div>
            </Draggable>
        </div>
    );
};

export default React.memo(BehaviorsModal);
