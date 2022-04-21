import {
    IconButton,
    IIconProps,
    Pivot,
    PivotItem,
    Separator,
    useTheme
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import React, { createContext, useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { useTranslation } from 'react-i18next';
import {
    BehaviorModalMode,
    DTwin,
    IPropertyInspectorAdapter,
    linkedTwinName
} from '../../Models/Constants';
import { IBehavior } from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import PropertyInspector from '../PropertyInspector/PropertyInspector';
import { OnCommitPatchParams } from '../PropertyInspector/StandalonePropertyInspector.types';
import {
    dismissButtonStyles,
    getStyles,
    pivotStyles,
    getSeparatorStyles
} from './BehaviorsModal.styles';
import BehaviorSection from './Internal/BehaviorSection/BehaviorSection';

export interface IBehaviorsModalProps {
    onClose?: () => any;
    title?: string;
    behaviors: IBehavior[];
    twins: Record<string, DTwin>;
    mode?: BehaviorModalMode;
    activeWidgetId?: string;
    adapter?: IPropertyInspectorAdapter;
    onPropertyInspectorPatch?: (patchData: OnCommitPatchParams) => any;
}

const cancelIcon: IIconProps = { iconName: 'Cancel' };

export const BehaviorsModalContext = createContext<{
    twins: Record<string, DTwin>;
    mode: BehaviorModalMode;
    activeWidgetId: string | null;
}>(null);

enum BehaviorModalPivotKey {
    State = 'state',
    Properties = 'properties'
}

const BehaviorsModal: React.FC<IBehaviorsModalProps> = ({
    onClose,
    behaviors = [],
    title,
    twins,
    mode = BehaviorModalMode.viewer,
    activeWidgetId,
    adapter,
    onPropertyInspectorPatch
}) => {
    const { t } = useTranslation();
    const boundaryRef = useRef<HTMLDivElement>(null);
    const titleId = useId('title');
    const theme = useTheme();
    const nodeRef = React.useRef(null); // <Draggable> requires an explicit ref to avoid using findDOMNode

    const [activePivot, setActivePivot] = useState<BehaviorModalPivotKey>(
        BehaviorModalPivotKey.State
    );

    // When title (popover element), or behaviors change, snap to correct pivot
    useEffect(() => {
        if (
            activePivot === BehaviorModalPivotKey.Properties &&
            behaviors.length > 0
        ) {
            setActivePivot(BehaviorModalPivotKey.State);
        } else if (
            activePivot === BehaviorModalPivotKey.State &&
            behaviors.length === 0 &&
            adapter
        ) {
            setActivePivot(BehaviorModalPivotKey.Properties);
        }
    }, [title, behaviors]);

    const styles = getStyles(theme, mode);

    return (
        <BehaviorsModalContext.Provider value={{ twins, mode, activeWidgetId }}>
            <div ref={boundaryRef} className={styles.boundaryLayer}>
                <Draggable
                    nodeRef={nodeRef}
                    bounds="parent"
                    defaultClassName={styles.draggable}
                    handle=".handle"
                >
                    <div ref={nodeRef} className={styles.modalContainer}>
                        <div
                            className={`${styles.modalHeaderContainer} handle`}
                        >
                            <div className={styles.modalHeader}>
                                <span
                                    className={styles.modalTitle}
                                    id={titleId}
                                    title={title}
                                >
                                    {mode === BehaviorModalMode.preview
                                        ? t('behaviorsModal.behaviorPreview')
                                        : title}
                                </span>
                                {onClose && (
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
                            {mode === BehaviorModalMode.viewer && (
                                <div className={styles.modalSubHeaderPivot}>
                                    <Pivot
                                        aria-label={t(
                                            'behaviorsModal.behaviorPopoverMode'
                                        )}
                                        selectedKey={activePivot}
                                        onLinkClick={(item) =>
                                            setActivePivot(
                                                item.props
                                                    .itemKey as BehaviorModalPivotKey
                                            )
                                        }
                                        styles={pivotStyles}
                                    >
                                        {behaviors?.length > 0 && (
                                            <PivotItem
                                                headerText={t(
                                                    'behaviorsModal.state'
                                                )}
                                                itemKey={
                                                    BehaviorModalPivotKey.State
                                                }
                                            ></PivotItem>
                                        )}
                                        <PivotItem
                                            headerText={t(
                                                'behaviorsModal.allProperties'
                                            )}
                                            itemKey={
                                                BehaviorModalPivotKey.Properties
                                            }
                                        ></PivotItem>
                                    </Pivot>
                                </div>
                            )}
                        </div>
                        <div className={styles.modalContents}>
                            {activePivot === BehaviorModalPivotKey.State &&
                                behaviors.map((behavior, idx) => {
                                    return (
                                        <div key={behavior.id}>
                                            <BehaviorSection
                                                behavior={behavior}
                                            />
                                            {idx < behaviors.length - 1 && (
                                                <Separator
                                                    styles={(props) =>
                                                        getSeparatorStyles(
                                                            props.theme,
                                                            mode
                                                        )
                                                    }
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            {activePivot === BehaviorModalPivotKey.Properties &&
                                adapter && (
                                    <PropertyInspector
                                        adapter={adapter}
                                        twinId={twins[linkedTwinName].$dtId}
                                        parentHandlesScroll={true}
                                        onPatch={(patchData) =>
                                            onPropertyInspectorPatch &&
                                            onPropertyInspectorPatch(patchData)
                                        }
                                        readonly={true}
                                        customCommandBarTitleSpan={
                                            <span
                                                className={
                                                    styles.customPropertyInspectorCommandBarTitle
                                                }
                                                title={t(
                                                    'behaviorsModal.LinkedTwinProperties'
                                                )}
                                            >
                                                {t(
                                                    'behaviorsModal.LinkedTwinProperties'
                                                )}
                                            </span>
                                        }
                                    />
                                )}
                        </div>
                    </div>
                </Draggable>
            </div>
        </BehaviorsModalContext.Provider>
    );
};

export default React.memo(BehaviorsModal);
