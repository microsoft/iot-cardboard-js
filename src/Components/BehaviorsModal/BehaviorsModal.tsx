import {
    IconButton,
    IIconProps,
    Pivot,
    PivotItem,
    Separator,
    useTheme
} from '@fluentui/react';
import { useId } from '@fluentui/react-hooks';
import React, { createContext, useContext, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { useTranslation } from 'react-i18next';
import MockAdapter from '../../Adapters/MockAdapter';
import {
    BehaviorModalMode,
    DTwin,
    IADTDataHistoryAdapter,
    IPropertyInspectorAdapter
} from '../../Models/Constants';
import {
    IBehavior,
    ITwinToObjectMapping
} from '../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { ADT3DScenePageContext } from '../../Pages/ADT3DScenePage/ADT3DScenePage';
import PropertyInspector from '../PropertyInspector/PropertyInspector';
import { OnCommitPatchParams } from '../PropertyInspector/StandalonePropertyInspector.types';
import {
    dismissButtonStyles,
    getStyles,
    pivotStyles,
    getSeparatorStyles
} from './BehaviorsModal.styles';
import BehaviorSection from './Internal/BehaviorSection/BehaviorSection';

export type IBehaviorsModalProps = IBehaviorsModalBaseProps &
    (ViewerModeProps | PreviewModeProps);
interface IBehaviorsModalBaseProps {
    activeWidgetId?: string;
    adapter?:
        | MockAdapter
        | (IPropertyInspectorAdapter & IADTDataHistoryAdapter);
    behaviors: IBehavior[];
    onClose?: () => any;
    onPropertyInspectorPatch?: (patchData: OnCommitPatchParams) => any;
    title?: string;
    twins: Record<string, DTwin>;
}

interface ViewerModeProps {
    mode: BehaviorModalMode.viewer;
    element: ITwinToObjectMapping;
}

interface PreviewModeProps {
    mode: BehaviorModalMode.preview;
    element?: undefined;
}

const cancelIcon: IIconProps = { iconName: 'Cancel' };

export const BehaviorsModalContext = createContext<{
    adapter?:
        | MockAdapter
        | (IPropertyInspectorAdapter & IADTDataHistoryAdapter);
    twins: Record<string, DTwin>;
    mode: BehaviorModalMode;
    activeWidgetId: string | null;
}>(null);

enum BehaviorModalPivotKey {
    State = 'state',
    Properties = 'properties'
}

const BehaviorsModal: React.FC<IBehaviorsModalProps> = (props) => {
    const {
        activeWidgetId,
        adapter,
        behaviors = [],
        element,
        mode = BehaviorModalMode.viewer,
        onClose,
        onPropertyInspectorPatch,
        title,
        twins
    } = props;
    const { t } = useTranslation();
    const boundaryRef = useRef<HTMLDivElement>(null);
    const titleId = useId('title');
    const theme = useTheme();
    const nodeRef = React.useRef(null); // <Draggable> requires an explicit ref to avoid using findDOMNode

    const scenePageContext = useContext(ADT3DScenePageContext);

    const [activePivot, setActivePivot] = useState<BehaviorModalPivotKey>(
        BehaviorModalPivotKey.State
    );

    const styles = getStyles(theme, mode);
    const behaviorsPresent = behaviors?.length > 0;

    // If no adapter given & no behaviors present, hide modal
    if (!adapter && !behaviorsPresent) {
        return null;
    }

    return (
        <BehaviorsModalContext.Provider
            value={{ adapter, twins, mode, activeWidgetId }}
        >
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
                            {/* Show pivots if both behaviors & adapter present */}
                            {mode === BehaviorModalMode.viewer &&
                                behaviorsPresent &&
                                adapter && (
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
                                            <PivotItem
                                                headerText={t(
                                                    'behaviorsModal.state'
                                                )}
                                                itemKey={
                                                    BehaviorModalPivotKey.State
                                                }
                                            ></PivotItem>
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
                            {/* Show state tab only if behaviors are present */}
                            {activePivot === BehaviorModalPivotKey.State &&
                                behaviorsPresent &&
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
                            {/* Fallback to properties tab if behaviors not present (filtered out by layers) */}
                            {(activePivot ===
                                BehaviorModalPivotKey.Properties ||
                                !behaviorsPresent) &&
                                adapter && (
                                    <PropertyInspector
                                        adapter={adapter}
                                        twinId={element?.primaryTwinID || ''}
                                        parentHandlesScroll={true}
                                        onPatch={(patchData) =>
                                            onPropertyInspectorPatch &&
                                            onPropertyInspectorPatch(patchData)
                                        }
                                        readonly={
                                            !scenePageContext?.isTwinPropertyInspectorPatchModeEnabled
                                        }
                                        customCommandBarTitleSpan={
                                            <span
                                                className={
                                                    styles.customPropertyInspectorCommandBarTitle
                                                }
                                                title={t(
                                                    'behaviorsModal.PrimaryTwin'
                                                )}
                                            >
                                                {t(
                                                    'behaviorsModal.PrimaryTwin'
                                                )}
                                            </span>
                                        }
                                        isWithDataHistory={{
                                            isEnabled: !!adapter.getADXConnectionInformation()
                                        }}
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
