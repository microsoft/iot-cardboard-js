import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
    IBehavior,
    IExpressionRangeVisual,
    IValueRangeVisual
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { FontSizes, Stack, Text, useTheme } from '@fluentui/react';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';
import {
    defaultSwatchColors,
    defaultSwatchIcons
} from '../../../../../Theming/Palettes';
import { getDefaultAlertVisualWithId } from '../../../../../Models/Classes/3DVConfig';
import {
    wrapTextInTemplateString,
    deepCopy,
    stripTemplateStringsFromText,
    getDebugLogger
} from '../../../../../Models/Services/Utils';
import ColorPicker from '../../../../Pickers/ColorSelectButton/ColorPicker';
import { IPickerOption } from '../../../../Pickers/Internal/Picker.base.types';
import IconPicker from '../../../../Pickers/IconSelectButton/IconPicker';
import { getLeftPanelStyles } from '../../Shared/LeftPanel.styles';
import { SceneBuilderContext } from '../../../ADT3DSceneBuilder';
import ModelledPropertyBuilder from '../../../../ModelledPropertyBuilder/ModelledPropertyBuilder';
import {
    ModelledPropertyBuilderMode,
    PropertyExpression
} from '../../../../ModelledPropertyBuilder/ModelledPropertyBuilder.types';
import { TransformedElementItem } from '../../../../../Models/Classes/SceneView.types';
import { useBehaviorFormContext } from '../../../../../Models/Context/BehaviorFormContext/BehaviorFormContext';
import { BehaviorFormContextActionType } from '../../../../../Models/Context/BehaviorFormContext/BehaviorFormContext.types';
import { FakePanel } from '../../../../3DV/SceneViewWithGizmoWrapper';

const debugLogging = true;
const logDebugConsole = getDebugLogger('AlertsTab', debugLogging);

const getAlertFromBehavior = (behavior: IBehavior) =>
    behavior.visuals.filter(ViewerConfigUtility.isAlertVisual)[0] || null;
const getValueRangeVisualFromAlert = (visual: IExpressionRangeVisual) =>
    visual?.valueRanges?.[0]?.visual || null;

const ROOT_LOC = '3dSceneBuilder.behaviorAlertForm';
const LOC_KEYS = {
    colorPickerLabel: `${ROOT_LOC}.colorPickerLabel`,
    expressionLabel: `${ROOT_LOC}.expressionLabel`,
    expressionPlaceholder: `${ROOT_LOC}.expressionPlaceholder`,
    iconPickerLabel: `${ROOT_LOC}.iconPickerLabel`,
    tabDescription: `${ROOT_LOC}.tabDescription`,
    notificationLabel: `${ROOT_LOC}.notificationLabel`,
    notificationLabelDescription: `${ROOT_LOC}.notificationLabelDescriptionPart1`,
    notificationLabelDescriptionExample: `${ROOT_LOC}.notificationLabelDescriptionPart2`,
    notificationLabelTooltip: `${ROOT_LOC}.notificationLabelTooltip`,
    notificationPlaceholder: `${ROOT_LOC}.notificationPlaceholder`
};

const AlertsTab: React.FC = () => {
    // contexts
    const {
        setGizmoElementItem,
        setGizmoTransformItem,
        adapter,
        config,
        sceneId,
        state: { selectedElements, gizmoTransformItem }
    } = useContext(SceneBuilderContext);
    const {
        behaviorFormDispatch,
        behaviorFormState
    } = useBehaviorFormContext();

    // hooks
    const { t } = useTranslation();

    const alertVisualStateRef = useRef<IExpressionRangeVisual>(
        getAlertFromBehavior(behaviorFormState.behaviorToEdit) ||
            getDefaultAlertVisualWithId()
    );

    const gizmoElementRef = useRef<TransformedElementItem>(null);

    useEffect(() => {
        if (selectedElements.length > 0) {
            // these should have the transform property populated if already transformed?
            const element = selectedElements[0]; // just grabbing the first element for now -- later need to support selecting diff meshes
            // iterate through all meshes in selectedElement; assign first mesh as parent
            // will need to do the actual setting of mesh to parent in SceneView if no access to meshes here
            gizmoElementRef.current = {
                meshIds: [],
                parentMeshId: ''
            };
            const meshIds = gizmoElementRef.current.meshIds;
            if (element.objectIDs.length > 0) {
                gizmoElementRef.current.parentMeshId = element.objectIDs[0];
                element.objectIDs.forEach((objectID) => {
                    meshIds.push(objectID);
                });
                setGizmoElementItem(gizmoElementRef.current); // just adding one gizmoElement so far ...
            }
        }
        return () => {
            // clean up gizmo after exiting tab
            setGizmoElementItem({ parentMeshId: null, meshIds: null });
        };
    }, [selectedElements]);

    // a different useEffect for transform item we get back from SceneView
    // will be called both when inputting values in the field and manipulating gizmo
    useEffect(() => {
        // updates the config on save
        if (gizmoTransformItem) {
            setValueRangeProperty('extensionProperties', {
                transform: true,
                xRot: gizmoTransformItem.rotation.x,
                yRot: gizmoTransformItem.rotation.y,
                zRot: gizmoTransformItem.rotation.z,
                xPos: gizmoTransformItem.position.x,
                yPos: gizmoTransformItem.position.y,
                zPos: gizmoTransformItem.position.z
            });
        }
    }, [gizmoTransformItem]);

    const getAndCreateIfNotExistsAlertVisual = (draft: IBehavior) => {
        // Assuming only 1 alert visual per behavior
        const alertVisual = getAlertFromBehavior(draft);

        if (alertVisual) {
            return alertVisual;
        } else {
            const alertVisual = alertVisualStateRef.current;
            draft.visuals.push(alertVisual);
            return alertVisual;
        }
    };

    const setValueRangeProperty = useCallback(
        (propertyName: keyof IValueRangeVisual, value: string | any) => {
            logDebugConsole(
                'info',
                `[START] Update value range property ${propertyName} to value `,
                value
            );
            const alertVisual = getAndCreateIfNotExistsAlertVisual(
                behaviorFormState.behaviorToEdit
            );
            // Edit flow
            if (!alertVisual) {
                logDebugConsole(
                    'warn',
                    `Could not set property (${propertyName}) on Value Range. No alert found. {behavior}`,
                    behaviorFormState.behaviorToEdit
                );
                return;
            }

            // if specifying which valueRange, do specified value range (mostly applies to transforms)
            const valueRangeVisual = alertVisual?.valueRanges?.[0]?.visual;
            if (!valueRangeVisual) {
                logDebugConsole(
                    'warn',
                    `Could not set property (${propertyName}) on Value Range. No visual found. {alertVisual}`,
                    alertVisual
                );
                return;
            }

            // set the value
            valueRangeVisual[propertyName] = value as any;

            behaviorFormDispatch({
                type:
                    BehaviorFormContextActionType.FORM_BEHAVIOR_ALERT_VISUAL_ADD_OR_UPDATE,
                payload: {
                    visual: alertVisual
                }
            });
            logDebugConsole(
                'info',
                `[END] Update value range property ${propertyName}. {visual}`,
                alertVisual
            );
        },
        [behaviorFormDispatch, behaviorFormState.behaviorToEdit]
    );

    const onExpressionChange = useCallback(
        (newPropertyExpression: PropertyExpression) => {
            const alertVisual = getAndCreateIfNotExistsAlertVisual(
                behaviorFormState.behaviorToEdit
            );

            // If clearing out expression
            if (newPropertyExpression.expression === '') {
                // Backup current state of alert visual form
                alertVisualStateRef.current = deepCopy(alertVisual);
                behaviorFormDispatch({
                    type:
                        BehaviorFormContextActionType.FORM_BEHAVIOR_ALERT_VISUAL_REMOVE
                });
            } else {
                alertVisual.valueExpression = newPropertyExpression.expression;
                behaviorFormDispatch({
                    type:
                        BehaviorFormContextActionType.FORM_BEHAVIOR_ALERT_VISUAL_ADD_OR_UPDATE,
                    payload: {
                        visual: alertVisual
                    }
                });
            }
        },
        [behaviorFormDispatch, behaviorFormState.behaviorToEdit]
    );

    const onColorChange = useCallback(
        (newValue: IPickerOption) =>
            setValueRangeProperty('color', newValue.item),
        [setValueRangeProperty]
    );

    const onIconChange = useCallback(
        (newValue: IPickerOption) =>
            setValueRangeProperty('iconName', newValue.item),
        [setValueRangeProperty]
    );

    const onNoteChange = useCallback(
        (newPropertyExpression: PropertyExpression) =>
            setValueRangeProperty(
                'labelExpression',
                wrapTextInTemplateString(newPropertyExpression.expression)
            ),
        [setValueRangeProperty]
    );

    // we only grab the first alert in the collection
    const alertVisual = getAlertFromBehavior(behaviorFormState.behaviorToEdit);
    const color = getValueRangeVisualFromAlert(alertVisual)?.color;
    const icon = getValueRangeVisualFromAlert(alertVisual)?.iconName;
    const notificationExpression = getValueRangeVisualFromAlert(alertVisual)
        ?.labelExpression;
    const expression = alertVisual?.valueExpression;
    const theme = useTheme();
    const commonPanelStyles = getLeftPanelStyles(theme);

    logDebugConsole('debug', 'Render');
    return (
        <Stack
            tokens={{ childrenGap: 8 }}
            className={commonPanelStyles.paddedLeftPanelBlock}
        >
            <Text className={commonPanelStyles.text}>
                {t(LOC_KEYS.tabDescription)}
            </Text>
            <ModelledPropertyBuilder
                adapter={adapter}
                twinIdParams={{
                    behavior: behaviorFormState.behaviorToEdit,
                    config,
                    sceneId,
                    selectedElements
                }}
                mode={ModelledPropertyBuilderMode.INTELLISENSE}
                propertyExpression={{
                    expression: expression || ''
                }}
                onChange={onExpressionChange}
                customLabel={t(LOC_KEYS.expressionLabel)}
                intellisensePlaceholder={t(LOC_KEYS.expressionPlaceholder)}
            />
            {alertVisual && (
                <>
                    <Stack tokens={{ childrenGap: 12 }} horizontal>
                        <IconPicker
                            selectedItem={icon}
                            items={defaultSwatchIcons}
                            label={t(LOC_KEYS.iconPickerLabel)}
                            onChangeItem={onIconChange}
                        />
                        <ColorPicker
                            selectedItem={color}
                            items={defaultSwatchColors}
                            label={t(LOC_KEYS.colorPickerLabel)}
                            onChangeItem={onColorChange}
                            styles={{
                                // match the icon picker
                                button: {
                                    height: 32,
                                    width: 32
                                }
                            }}
                        />
                    </Stack>
                    <FakePanel
                        gizmoTransformItem={gizmoTransformItem}
                        setGizmoTransformItem={setGizmoTransformItem}
                    />
                    <Stack tokens={{ childrenGap: 4 }}>
                        <ModelledPropertyBuilder
                            adapter={adapter}
                            twinIdParams={{
                                behavior: behaviorFormState.behaviorToEdit,
                                config,
                                sceneId,
                                selectedElements
                            }}
                            mode={ModelledPropertyBuilderMode.INTELLISENSE}
                            propertyExpression={{
                                expression:
                                    stripTemplateStringsFromText(
                                        notificationExpression
                                    ) || ''
                            }}
                            onChange={onNoteChange}
                            customLabel={t(LOC_KEYS.notificationLabel)}
                            customLabelTooltip={{
                                buttonAriaLabel: t(
                                    LOC_KEYS.notificationLabelTooltip
                                ),
                                calloutContent: t(
                                    LOC_KEYS.notificationLabelTooltip
                                )
                            }}
                            intellisensePlaceholder={t(
                                LOC_KEYS.notificationPlaceholder
                            )}
                        />
                        <Text styles={{ root: { fontSize: FontSizes.small } }}>
                            {t(LOC_KEYS.notificationLabelDescription)}{' '}
                            <i>
                                {t(
                                    LOC_KEYS.notificationLabelDescriptionExample
                                )}
                            </i>
                        </Text>
                    </Stack>
                </>
            )}
        </Stack>
    );
};

export default AlertsTab;
