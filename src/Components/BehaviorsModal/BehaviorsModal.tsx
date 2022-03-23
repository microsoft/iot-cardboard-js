import { IconButton, IIconProps, Separator } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import React, { createContext, useRef } from 'react';
import Draggable from 'react-draggable';
import { DTwin } from '../../Models/Constants';
import {
    IBehavior,
    ITwinToObjectMapping
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    dismissButtonStyles,
    getStyles,
    separatorStyles
} from './BehaviorsModal.styles';
import BehaviorSection from './Internal/BehaviorSection/BehaviorSection';

export interface IBehaviorsModalProps {
    onClose: () => any;
    element: ITwinToObjectMapping;
    behaviors: IBehavior[];
    twins: Record<string, DTwin>;
}

const cancelIcon: IIconProps = { iconName: 'Cancel' };

export const BehaviorsModalContext = createContext<{
    twins: Record<string, DTwin>;
}>(null);

const BehaviorsModal: React.FC<IBehaviorsModalProps> = ({
    onClose,
    behaviors,
    element,
    twins
}) => {
    const boundaryRef = useRef<HTMLDivElement>(null);
    const titleId = useId('title');
    const styles = getStyles();

    return (
        <BehaviorsModalContext.Provider value={{ twins }}>
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
                        {behaviors.map((behavior, idx) => {
                            return (
                                <>
                                    <BehaviorSection behavior={behavior} />
                                    {idx < behaviors.length - 1 && (
                                        <Separator styles={separatorStyles} />
                                    )}
                                </>
                            );
                        })}
                    </div>
                </Draggable>
            </div>
        </BehaviorsModalContext.Provider>
    );
};

export default React.memo(BehaviorsModal);
