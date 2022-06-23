import produce from 'immer';
import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
    IBehavior,
    IExpressionRangeVisual
} from '../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { FontSizes, Stack, Text, TextField, useTheme } from '@fluentui/react';
import ViewerConfigUtility from '../../../../../Models/Classes/ViewerConfigUtility';
import {
    defaultSwatchColors,
    defaultSwatchIcons
} from '../../../../../Theming/Palettes';
import { getUIDDefaultAlertVisual } from '../../../../../Models/Classes/3DVConfig';
import {
    wrapTextInTemplateString,
    deepCopy,
    stripTemplateStringsFromText
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
import {
    TransformedElementItem,
    TransformInfo
} from '../../../../../Models/Classes/SceneView.types';

const getAlertFromBehavior = (behavior: IBehavior) =>
    behavior.visuals.filter(ViewerConfigUtility.isAlertVisual)[0] || null;

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
    const { t } = useTranslation();
    const {
        behaviorToEdit,
        setBehaviorToEdit,
        setGizmoElementItems,
        adapter,
        config,
        sceneId,
        state: { selectedElements, gizmoElementItems, gizmoTransformItem } // do I need access to gizmoElement items or just the setter?
    } = useContext(SceneBuilderContext);

    const alertVisualStateRef = useRef<IExpressionRangeVisual>(
        getAlertFromBehavior(behaviorToEdit) || getUIDDefaultAlertVisual()
    );

    const gizmoElementRef = useRef<TransformedElementItem>(null);

    useEffect(() => {
        if (selectedElements.length > 0) {
            console.log('selectedElements: ', selectedElements);
            // need to handle case for if there are already gizmoElementItems?
            // these should have the transform property populated if already transformed?
            const element = selectedElements[0]; // just grabbing the first element for now -- later need to support selecting diff meshes
            // iterate through all meshes in selectedElement; assign first mesh as parent
            // will need to do the actual setting of mesh to parent in SceneView if no access to meshes here
            gizmoElementRef.current = {
                meshIds: [],
                parentMeshId: ''
            };
            // gizmoElementRef.current.meshIds = [];
            const meshIds = gizmoElementRef.current.meshIds;
            if (element.objectIDs.length > 0) {
                gizmoElementRef.current.parentMeshId = element.objectIDs[0];
                element.objectIDs.forEach((objectID) => {
                    meshIds.push(objectID);
                });
                // gizmoElementItems.push(gizmoElementRef.current);
                setGizmoElementItems([gizmoElementRef.current]); // just adding one gizmoElement so far ...
                console.log('gizmo element ref: ', gizmoElementRef.current);
            }
        }
        return () => {
            // clean up gizmo after exiting tab
            setGizmoElementItems([]);
        };
    }, [selectedElements]);

    // a different useEffect for transform item we get back from SceneView
    useEffect(() => {
        console.log('gizmoTransformItem: ', gizmoTransformItem);
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

    const onExpressionChange = useCallback(
        (newPropertyExpression: PropertyExpression) =>
            setBehaviorToEdit(
                produce((draft) => {
                    const alertVisual = getAndCreateIfNotExistsAlertVisual(
                        draft
                    );

                    // If clearing out expression
                    if (newPropertyExpression.expression === '') {
                        // Remove visual from behavior
                        if (alertVisual) {
                            const avIdx = draft.visuals.indexOf(alertVisual);
                            draft.visuals.splice(avIdx, 1);

                            // Backup current state of alert visual form
                            alertVisualStateRef.current = deepCopy(alertVisual);
                            alertVisual.valueExpression = '';
                        }
                    } else {
                        alertVisual.valueExpression =
                            newPropertyExpression.expression;
                    }
                })
            ),
        [setBehaviorToEdit]
    );

    const onColorChange = useCallback(
        (newValue: IPickerOption) =>
            setBehaviorToEdit(
                produce((draft) => {
                    const alertVisual = getAndCreateIfNotExistsAlertVisual(
                        draft
                    );
                    alertVisual.valueRanges[0].visual.color = newValue.item;
                })
            ),
        [setBehaviorToEdit]
    );

    const onIconChange = useCallback(
        (newValue: IPickerOption) =>
            setBehaviorToEdit(
                // update a property of behavior state variable
                produce((draft) => {
                    const alertVisual = getAndCreateIfNotExistsAlertVisual(
                        draft
                    );
                    alertVisual.valueRanges[0].visual.iconName = newValue.item;
                })
            ),
        [setBehaviorToEdit]
    );

    // onTransformChange()
    // const onTransformChange = useCallback(
    //     (newValue: HTMLTextAreaElement) =>
    //         setBehaviorToEdit(
    //             produce((draft) => {
    //                 const alertVisual = getAndCreateIfNotExistsAlertVisual(
    //                     draft
    //                 );
    //                 alertVisual.valueRanges[0].visual.extensionProperties = {
    //                     transform: true,
    //                     // xRot: newValue.rotation.x,
    //                     // yRot: newValue.rotation.y,
    //                     // zRot: newValue.rotation.z,
    //                     // xPos: newValue.position.x,
    //                     // yPos: newValue.position.y,
    //                     // zPos: newValue.position.z
    //                     xRot: newValue,
    //                     yRot: 0,
    //                     zRot: 0,
    //                     xPos: 0,
    //                     yPos: 0,
    //                     zPos: 0
    //                 };
    //             })
    //         ),
    //     [setBehaviorToEdit]
    // );
    const onTransformChange = useCallback(
        (event) =>
            setBehaviorToEdit(
                produce((draft) => {
                    const alertVisual = getAndCreateIfNotExistsAlertVisual(
                        draft
                    );
                    alertVisual.valueRanges[0].visual.extensionProperties = {
                        transform: true,
                        // xRot: newValue.rotation.x,
                        // yRot: newValue.rotation.y,
                        // zRot: newValue.rotation.z,
                        // xPos: newValue.position.x,
                        // yPos: newValue.position.y,
                        // zPos: newValue.position.z
                        xRot: event.target.value,
                        yRot: 0,
                        zRot: 0,
                        xPos: 0,
                        yPos: 0,
                        zPos: 0
                    };
                })
            ),
        [setBehaviorToEdit]
    );

    const onNoteChange = useCallback(
        (newPropertyExpression: PropertyExpression) =>
            setBehaviorToEdit(
                produce((draft) => {
                    const alertVisual = getAndCreateIfNotExistsAlertVisual(
                        draft
                    );
                    alertVisual.valueRanges[0].visual.labelExpression = wrapTextInTemplateString(
                        newPropertyExpression.expression
                    );
                })
            ),
        [setBehaviorToEdit]
    );

    // we only grab the first alert in the collection
    const alertVisual = getAlertFromBehavior(behaviorToEdit);
    const color = alertVisual?.valueRanges?.[0]?.visual?.color;
    const icon = alertVisual?.valueRanges?.[0]?.visual?.iconName;
    const notificationExpression =
        alertVisual?.valueRanges?.[0]?.visual?.labelExpression;
    const expression = alertVisual?.valueExpression;
    const theme = useTheme();
    const commonPanelStyles = getLeftPanelStyles(theme);

    return (
        <Stack tokens={{ childrenGap: 8 }}>
            <Text className={commonPanelStyles.text}>
                {t(LOC_KEYS.tabDescription)}
            </Text>
            <ModelledPropertyBuilder
                adapter={adapter}
                twinIdParams={{
                    behavior: behaviorToEdit,
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

                        {/* <TransformInput
                        onTransformChange
                        ></> */}
                        <TextField
                            label="X: "
                            type="number"
                            onChange={
                                onTransformChange
                                // onTransformChange({
                                //     position: { x: 0, y: 0, z: 0 },
                                //     rotation: { x: newValue., y: 0, z: 0 }
                                // })
                            }
                        ></TextField>
                        {/* <label htmlFor="xRotation">X: </label>
                        <input
                            id="xRotation"
                            type="number"
                            // value={
                            //     currentMesh ? currentMesh.rotation.x : 'no current mesh'
                            // }
                            onChange={onTransformChange}
                        /> */}
                    </Stack>
                    <Stack tokens={{ childrenGap: 4 }}>
                        <ModelledPropertyBuilder
                            adapter={adapter}
                            twinIdParams={{
                                behavior: behaviorToEdit,
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
