import { getTheme, IconButton, IIconProps, Separator } from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import React, { createContext, useRef } from 'react';
import Draggable from 'react-draggable';
import { useTranslation } from 'react-i18next';
import { DTwin } from '../../Models/Constants';
import { IBehavior } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import {
    dismissButtonStyles,
    getStyles,
    getSeparatorStyles
} from './BehaviorsModal.styles';
import BehaviorSection from './Internal/BehaviorSection/BehaviorSection';

export interface IBehaviorsModalProps {
    onClose?: () => any;
    title: string;
    behaviors: IBehavior[];
    twins: Record<string, DTwin>;
    isPreview?: boolean;
}

const cancelIcon: IIconProps = { iconName: 'Cancel' };

export const BehaviorsModalContext = createContext<{
    twins: Record<string, DTwin>;
    isPreview: boolean;
}>(null);

const BehaviorsModal: React.FC<IBehaviorsModalProps> = ({
    onClose,
    behaviors,
    title,
    twins,
    isPreview = false
}) => {
    const { t } = useTranslation();
    const boundaryRef = useRef<HTMLDivElement>(null);
    const titleId = useId('title');
    const theme = getTheme();
    const styles = getStyles(theme, isPreview);

    return (
        <BehaviorsModalContext.Provider value={{ twins, isPreview }}>
            <div ref={boundaryRef} className={styles.boundaryLayer}>
                <Draggable bounds="parent" defaultClassName={styles.draggable}>
                    <div className={styles.modalContainer}>
                        <div className={styles.modalHeaderContainer}>
                            <div className={styles.modalHeader}>
                                <span
                                    className={styles.modalTitle}
                                    id={titleId}
                                    title={title}
                                >
                                    {isPreview
                                        ? t('behaviorsModal.behaviorPreview')
                                        : title}
                                </span>
                                {typeof onClose === 'function' && (
                                    <IconButton
                                        styles={dismissButtonStyles}
                                        iconProps={cancelIcon}
                                        ariaLabel={t(
                                            'behaviorsModal.closeModal'
                                        )}
                                        onClick={onClose}
                                    />
                                )}
                            </div>
                        </div>
                        <div className={styles.modalContents}>
                            {behaviors.map((behavior, idx) => {
                                return (
                                    <div key={behavior.id}>
                                        <BehaviorSection behavior={behavior} />
                                        {idx < behaviors.length - 1 && (
                                            <Separator
                                                styles={(props) =>
                                                    getSeparatorStyles(
                                                        props,
                                                        isPreview
                                                    )
                                                }
                                            />
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Draggable>
            </div>
        </BehaviorsModalContext.Provider>
    );
};

export default React.memo(BehaviorsModal);
