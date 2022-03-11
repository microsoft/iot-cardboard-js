import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    DatasourceType,
    defaultBehavior,
    IBehavior
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
import { TextField, DefaultButton, Separator, useTheme } from '@fluentui/react';
import AlertsTab from './Internal/AlertsTab';
import WidgetForm from './Widgets/WidgetForm';
import WidgetsTab from './Internal/WidgetsTab';
import LeftPanelBuilderHeader, {
    getLeftPanelBuilderHeaderParams
} from '../LeftPanelBuilderHeader';
import SceneElements from '../Elements/Elements';
import { SceneBuilderContext } from '../../ADT3DSceneBuilder';
import { leftPanelPivotStyles } from '../Shared/LeftPanel.styles';
import { createColoredMeshItems } from '../../../3DV/SceneView.Utils';
import { getStyles } from './BehaviorsForm.styles';
import PanelFooter from '../Shared/PanelFooter';

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
        !selectedBehavior ? defaultBehavior : selectedBehavior
    );

    const [
        selectedBehaviorPivotKey,
        setSelectedBehaviorPivotKey
    ] = useState<BehaviorPivot>(BehaviorPivot.elements);

    const [originalBehaviorId, setOriginalBehaviorId] = useState(
        selectedBehavior?.id
    );

    useEffect(() => {
        // Color selected meshes
        const selectedElements = [];

        behaviorToEdit.datasources
            .filter((ds) => ds.type === DatasourceType.TwinToObjectMapping)
            .forEach((ds) => {
                ds.mappingIDs.forEach((mappingId) => {
                    const element = elements.find((el) => el.id === mappingId);
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

        // Save original Id
        setOriginalBehaviorId(selectedBehavior?.id);
    }, []);

    useEffect(() => {
        const mappingIds = [];
        selectedElements?.forEach((element) => {
            mappingIds.push(element.id);
        });

        setBehaviorToEdit(
            produce((draft) => {
                if (
                    draft.datasources &&
                    draft.datasources[0] &&
                    draft.datasources[0].mappingIDs
                ) {
                    draft.datasources[0].mappingIDs = mappingIds;
                } else {
                    draft.datasources[0] = {
                        type: DatasourceType.TwinToObjectMapping,
                        mappingIDs: mappingIds
                    };
                }
            })
        );
    }, [selectedElements]);

    const onBehaviorSaveClick = () => {
        onBehaviorSave(
            behaviorToEdit,
            builderMode as BehaviorSaveMode,
            originalBehaviorId
        );
        onBehaviorBackClick();
        setSelectedElements([]);
    };

    const { headerText, subHeaderText, iconName } = useMemo(
        () => getLeftPanelBuilderHeaderParams(widgetFormInfo, builderMode),
        [widgetFormInfo, builderMode]
    );

    const styles = getStyles(useTheme());
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
                                <TextField
                                    label={t('3dSceneBuilder.behaviorId')}
                                    value={behaviorToEdit.id}
                                    required
                                    onChange={(_e, newValue) => {
                                        setBehaviorToEdit(
                                            produce((draft) => {
                                                draft.id = newValue.replace(
                                                    /\s/g,
                                                    ''
                                                );
                                            })
                                        );
                                    }}
                                />

                                <Separator />

                                <Pivot
                                    selectedKey={selectedBehaviorPivotKey}
                                    onLinkClick={(item) =>
                                        setSelectedBehaviorPivotKey(
                                            item.props.itemKey as BehaviorPivot
                                        )
                                    }
                                    styles={leftPanelPivotStyles}
                                >
                                    <PivotItem
                                        headerText={t(
                                            '3dSceneBuilder.elements'
                                        )}
                                        itemKey={BehaviorPivot.elements}
                                        className={styles.pivotItem}
                                    >
                                        <SceneElements
                                            elements={elements}
                                            selectedElements={selectedElements}
                                            updateSelectedElements={
                                                updateSelectedElements
                                            }
                                            isEditBehavior={true}
                                            hideSearch={true}
                                        />
                                    </PivotItem>
                                    <PivotItem
                                        headerText={t('3dSceneBuilder.alerts')}
                                        itemKey={BehaviorPivot.alerts}
                                    >
                                        <AlertsTab />
                                    </PivotItem>
                                    <PivotItem
                                        headerText={t('3dSceneBuilder.widgets')}
                                        itemKey={BehaviorPivot.widgets}
                                    >
                                        <WidgetsTab />
                                    </PivotItem>
                                </Pivot>
                            </div>
                        </div>

                        <PanelFooter>
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
                                    behaviorToEdit.datasources?.[0]?.mappingIDs
                                        ?.length === 0
                                }
                            />
                            <DefaultButton
                                text={t('cancel')}
                                onClick={() => {
                                    onBehaviorBackClick();
                                    setSelectedElements([]);
                                }}
                            />
                        </PanelFooter>
                    </>
                )}
            </div>
        </BehaviorFormContext.Provider>
    );
};
export default SceneBehaviorsForm;
