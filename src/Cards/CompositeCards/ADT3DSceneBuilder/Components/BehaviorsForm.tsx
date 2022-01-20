import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    DatasourceType,
    defaultBehavior,
    IBehavior,
    ITwinToObjectMapping
} from '../../../../Models/Classes/3DVConfig';
import {
    ADT3DSceneBuilderMode,
    WidgetFormMode
} from '../../../../Models/Constants/Enums';
import {
    BehaviorSaveMode,
    IADT3DSceneBuilderBehaviorFormProps,
    IBehaviorFormContext,
    WidgetFormInfo
} from '../ADT3DSceneBuilder.types';
import produce from 'immer';
import { PrimaryButton } from '@fluentui/react/lib/components/Button/PrimaryButton/PrimaryButton';
import { Pivot } from '@fluentui/react/lib/components/Pivot/Pivot';
import { PivotItem } from '@fluentui/react/lib/components/Pivot/PivotItem';
import { IBreadcrumbItem, TextField, DefaultButton } from '@fluentui/react';
import BehaviorFormElementsTab from './BehaviorFormElementsTab';
import BehaviorFormAlertsTab from './BehaviorFormAlertsTab';
import BehaviorFormWidgetsTab from './BehaviorFormWidgetsTab';
import WidgetForm from './WidgetForm';
import SceneBuilderFormBreadcrumb from './SceneBuilderFormBreadcrumb';

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
    onBehaviorBackClick,
    onBehaviorSave,
    setSelectedMeshIds
}) => {
    const { t } = useTranslation();

    const [behaviorToEdit, setBehaviorToEdit] = useState<IBehavior>(
        Object.keys(selectedBehavior as any).length === 0
            ? defaultBehavior
            : selectedBehavior
    );

    const [widgetFormInfo, setWidgetFormInfo] = useState<WidgetFormInfo>(null);

    const [
        selectedBehaviorPivotKey,
        setSelectedBehaviorPivotKey
    ] = useState<BehaviorPivot>(BehaviorPivot.elements);

    const [originalBehaviorId, setOriginalBehaviorId] = useState(
        selectedBehavior?.id
    );

    const colorSelectedElements = (
        elementsToColor: Array<ITwinToObjectMapping>
    ) => {
        const meshIds = [].concat(...elementsToColor.map((etc) => etc.meshIDs));
        setSelectedMeshIds(meshIds);
    };

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
            colorSelectedElements(selectedElements);
        }
        // Save original Id
        setOriginalBehaviorId(selectedBehavior.id);
    }, []);

    const getBehaviorFormBreadcrumbItems = () => {
        let breadcrumbItems: IBreadcrumbItem[] = [
            {
                text: t('3dSceneBuilder.behaviors'),
                key: 'behaviorRoot',
                onClick: () => {
                    onBehaviorBackClick();
                    setSelectedMeshIds([]);
                }
            }
        ];
        if (widgetFormInfo) {
            breadcrumbItems = [
                ...breadcrumbItems,
                {
                    text: t('3dSceneBuilder.createBehavior'),
                    key: 'behaviorAdd',
                    onClick: () => setWidgetFormInfo(null)
                },
                {
                    text:
                        widgetFormInfo.mode === WidgetFormMode.Create
                            ? t('3dSceneBuilder.addWidget')
                            : t('3dSceneBuilder.editWidget'),
                    key: 'widgetAddEdit'
                }
            ];
        } else {
            breadcrumbItems = [
                ...breadcrumbItems,
                {
                    text: t('3dSceneBuilder.createBehavior'),
                    key: 'behaviorAdd'
                }
            ];
        }
        return breadcrumbItems;
    };

    return (
        <BehaviorFormContext.Provider
            value={{
                behaviorToEdit,
                setBehaviorToEdit,
                widgetFormInfo,
                setWidgetFormInfo
            }}
        >
            <div className="cb-scene-builder-left-panel-create-wrapper">
                <SceneBuilderFormBreadcrumb
                    items={getBehaviorFormBreadcrumbItems()}
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

                                <Pivot
                                    selectedKey={selectedBehaviorPivotKey}
                                    onLinkClick={(item) =>
                                        setSelectedBehaviorPivotKey(
                                            item.props.itemKey as BehaviorPivot
                                        )
                                    }
                                    styles={{
                                        root: {
                                            marginLeft: -8,
                                            marginBottom: 8
                                        }
                                    }}
                                >
                                    <PivotItem
                                        headerText={t(
                                            '3dSceneBuilder.elements'
                                        )}
                                        itemKey={BehaviorPivot.elements}
                                    >
                                        <BehaviorFormElementsTab
                                            elements={elements}
                                            colorSelectedElements={
                                                colorSelectedElements
                                            }
                                        />
                                    </PivotItem>
                                    <PivotItem
                                        headerText={t('3dSceneBuilder.alerts')}
                                        itemKey={BehaviorPivot.alerts}
                                    >
                                        <BehaviorFormAlertsTab />
                                    </PivotItem>
                                    <PivotItem
                                        headerText={t('3dSceneBuilder.widgets')}
                                        itemKey={BehaviorPivot.widgets}
                                    >
                                        <BehaviorFormWidgetsTab />
                                    </PivotItem>
                                </Pivot>
                            </div>
                        </div>
                        <div className="cb-scene-builder-left-panel-create-form-actions">
                            <PrimaryButton
                                onClick={() => {
                                    onBehaviorSave(
                                        behaviorToEdit,
                                        builderMode as BehaviorSaveMode,
                                        originalBehaviorId
                                    );
                                    onBehaviorBackClick();
                                    setSelectedMeshIds([]);
                                }}
                                text={
                                    builderMode ===
                                    ADT3DSceneBuilderMode.CreateBehavior
                                        ? t('create')
                                        : t('update')
                                }
                                disabled={!behaviorToEdit?.id}
                            />
                            <DefaultButton
                                text={t('cancel')}
                                styles={{ root: { marginLeft: 8 } }}
                                onClick={() => {
                                    onBehaviorBackClick();
                                    setSelectedMeshIds([]);
                                }}
                            />
                        </div>
                    </>
                )}
            </div>
        </BehaviorFormContext.Provider>
    );
};
export default SceneBehaviorsForm;
