import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    DatasourceType,
    defaultBehavior
} from '../../../../Models/Classes/3DVConfig';
import { ADT3DSceneBuilderMode } from '../../../../Models/Constants/Enums';
import {
    BehaviorSaveMode,
    IADT3DSceneBuilderBehaviorFormProps,
    IBehaviorFormContext
} from '../../ADT3DSceneBuilder.types';
import produce from 'immer';
import { PrimaryButton } from '@fluentui/react/lib/components/Button/PrimaryButton/PrimaryButton';
import { Pivot } from '@fluentui/react/lib/components/Pivot/Pivot';
import { PivotItem } from '@fluentui/react/lib/components/Pivot/PivotItem';
import { TextField, DefaultButton, Separator } from '@fluentui/react';
import WidgetForm from './Widgets/WidgetForm';
import LeftPanelBuilderHeader, {
    getLeftPanelBuilderHeaderParams
} from '../LeftPanelBuilderHeader';
import SceneElements from '../Elements/Elements';
import { SceneBuilderContext } from '../../ADT3DSceneBuilder';
import { leftPanelPivotStyles } from '../Shared/LeftPanel.styles';
import { IBehavior } from '../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import ViewerConfigUtility from '../../../../Models/Classes/ViewerConfigUtility';
import { createGUID } from '../../../../Models/Services/Utils';
import { createColoredMeshItems } from '../../../3DV/SceneView.Utils';

export const BehaviorFormContext = React.createContext<IBehaviorFormContext>(
    null
);

enum BehaviorPivot {
    elements = 'elements',
    twins = 'twins',
    alerts = 'alerts',
    widgets = 'widgets'
}

const SceneBehaviorsForm: React.FC<IADT3DSceneBuilderBehaviorFormProps> = ({
    elements,
    builderMode,
    selectedBehavior,
    selectedElements,
    onBehaviorBackClick,
    onBehaviorSave,
    setSelectedElements,
    updateSelectedElements
}) => {
    const { t } = useTranslation();

    const { widgetFormInfo, setColoredMeshItems } = useContext(
        SceneBuilderContext
    );

    const [behaviorToEdit, setBehaviorToEdit] = useState<IBehavior>(
        !selectedBehavior
            ? { ...defaultBehavior, id: createGUID(false) }
            : selectedBehavior
    );

    const [
        selectedBehaviorPivotKey,
        setSelectedBehaviorPivotKey
    ] = useState<BehaviorPivot>(BehaviorPivot.elements);

    useEffect(() => {
        // Color selected meshes
        const selectedElements = [];

        behaviorToEdit.datasources
            .filter(ViewerConfigUtility.isElementTwinToObjectMappingDataSource)
            .forEach((ds) => {
                ds.elementIDs.forEach((elementId) => {
                    const element = elements.find((el) => el.id === elementId);
                    element && selectedElements.push(element);
                });
            });

        if (selectedElements?.length > 0) {
            setSelectedElements(selectedElements);
        }

        let meshIds: string[] = [];
        for (const element of selectedElements) {
            if (element.meshIDs) {
                meshIds = meshIds.concat(element.meshIDs);
            }
        }
        setColoredMeshItems(createColoredMeshItems(meshIds, null));
    }, []);

    useEffect(() => {
        const elementIds = [];
        selectedElements?.forEach((element) => {
            elementIds.push(element.id);
        });

        setBehaviorToEdit(
            produce((draft) => {
                if (
                    draft.datasources &&
                    draft.datasources[0] &&
                    draft.datasources[0].elementIDs
                ) {
                    draft.datasources[0].elementIDs = elementIds;
                } else {
                    draft.datasources[0] = {
                        type:
                            DatasourceType.ElementTwinToObjectMappingDataSource,
                        elementIDs: elementIds
                    };
                }
            })
        );
    }, [selectedElements]);

    const onBehaviorSaveClick = () => {
        onBehaviorSave(behaviorToEdit, builderMode as BehaviorSaveMode);
        onBehaviorBackClick();
        setSelectedElements([]);
    };

    const { headerText, subHeaderText, iconName } = useMemo(
        () => getLeftPanelBuilderHeaderParams(widgetFormInfo, builderMode),
        [widgetFormInfo, builderMode]
    );

    return (
        <BehaviorFormContext.Provider
            value={{
                behaviorToEdit,
                setBehaviorToEdit
            }}
        >
            <div className="cb-scene-builder-left-panel-create-wrapper">
                <LeftPanelBuilderHeader
                    headerText={headerText}
                    subHeaderText={subHeaderText}
                    iconName={iconName}
                />
                {widgetFormInfo ? (
                    <WidgetForm />
                ) : (
                    <>
                        <div className="cb-scene-builder-left-panel-create-form">
                            <div className="cb-scene-builder-left-panel-create-form-contents">
                                <div>
                                    <TextField
                                        label={t('displayName')}
                                        value={behaviorToEdit.displayName}
                                        required
                                        onChange={(_e, newValue) => {
                                            setBehaviorToEdit(
                                                produce((draft) => {
                                                    draft.displayName = newValue;
                                                })
                                            );
                                        }}
                                    />

                                    <Separator />

                                    <Pivot
                                        selectedKey={selectedBehaviorPivotKey}
                                        onLinkClick={(item) =>
                                            setSelectedBehaviorPivotKey(
                                                item.props
                                                    .itemKey as BehaviorPivot
                                            )
                                        }
                                        styles={leftPanelPivotStyles}
                                    >
                                        <PivotItem
                                            headerText={t(
                                                '3dSceneBuilder.elements'
                                            )}
                                            itemKey={BehaviorPivot.elements}
                                        >
                                            <div>
                                                <SceneElements
                                                    elements={elements}
                                                    selectedElements={
                                                        selectedElements
                                                    }
                                                    updateSelectedElements={
                                                        updateSelectedElements
                                                    }
                                                    isEditBehavior={true}
                                                    hideSearch={true}
                                                />
                                            </div>
                                        </PivotItem>
                                        <PivotItem
                                            headerText={t(
                                                '3dSceneBuilder.alerts'
                                            )}
                                            itemKey={BehaviorPivot.alerts}
                                        >
                                            {/* TODO SCHEMA MIGRATION - update
                                            Alerts tab to new schema & types */}
                                            {/* <AlertsTab /> */}
                                        </PivotItem>
                                        <PivotItem
                                            headerText={t(
                                                '3dSceneBuilder.widgets'
                                            )}
                                            itemKey={BehaviorPivot.widgets}
                                        >
                                            {/* TODO SCHEMA MIGRATION - update
                                            Widgets tab to new schema & types */}
                                            {/* <WidgetsTab /> */}
                                        </PivotItem>
                                    </Pivot>
                                </div>
                            </div>
                        </div>

                        <div className="cb-scene-builder-left-panel-create-form-actions">
                            <div>
                                <PrimaryButton
                                    onClick={onBehaviorSaveClick}
                                    text={
                                        builderMode ===
                                        ADT3DSceneBuilderMode.CreateBehavior
                                            ? t('3dSceneBuilder.createBehavior')
                                            : t('3dSceneBuilder.updateBehavior')
                                    }
                                    disabled={
                                        !behaviorToEdit?.id ||
                                        behaviorToEdit.datasources.filter(
                                            ViewerConfigUtility.isElementTwinToObjectMappingDataSource
                                        )?.[0]?.elementIDs?.length === 0
                                    }
                                />
                                <DefaultButton
                                    text={t('cancel')}
                                    styles={{ root: { marginLeft: 8 } }}
                                    onClick={() => {
                                        onBehaviorBackClick();
                                        setSelectedElements([]);
                                    }}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </BehaviorFormContext.Provider>
    );
};
export default SceneBehaviorsForm;
