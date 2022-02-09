import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    DatasourceType,
    defaultBehavior,
    IBehavior
} from '../../../../../Models/Classes/3DVConfig';
import { ADT3DSceneBuilderMode } from '../../../../../Models/Constants/Enums';
import {
    BehaviorSaveMode,
    IADT3DSceneBuilderBehaviorFormProps,
    IBehaviorFormContext,
    WidgetFormInfo
} from '../../ADT3DSceneBuilder.types';
import produce from 'immer';
import { PrimaryButton } from '@fluentui/react/lib/components/Button/PrimaryButton/PrimaryButton';
import { Pivot } from '@fluentui/react/lib/components/Pivot/Pivot';
import { PivotItem } from '@fluentui/react/lib/components/Pivot/PivotItem';
import { IBreadcrumbItem, TextField, DefaultButton } from '@fluentui/react';
import BehaviorFormAlertsTab from './BehaviorFormTabs/BehaviorFormAlertsTab';
import WidgetForm from './Widgets/WidgetForm';
import BehaviorFormWidgetsTab from './BehaviorFormTabs/BehaviorFormWidgetsTab';
import LeftPanelBuilderHeader from '../../../ADT3DScenePage/Components/LeftPanelBuilderHeader';
import SceneElements from '../Elements/Elements';

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
    onElementEnter,
    onElementLeave,
    updateSelectedElements
}) => {
    const { t } = useTranslation();

    const [behaviorToEdit, setBehaviorToEdit] = useState<IBehavior>(
        !selectedBehavior ? defaultBehavior : selectedBehavior
    );

    const [widgetFormInfo, setWidgetFormInfo] = useState<WidgetFormInfo>(null);

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

        // Save original Id
        setOriginalBehaviorId(selectedBehavior?.id);
    }, []);

    const getBehaviorFormBreadcrumbItems = () => {
        let breadcrumbItems: IBreadcrumbItem[] = [
            {
                text: t('3dSceneBuilder.behaviors'),
                key: 'behaviorRoot',
                onClick: () => {
                    onBehaviorBackClick();
                    setSelectedElements([]);
                }
            }
        ];
        if (widgetFormInfo) {
            breadcrumbItems = [
                ...breadcrumbItems,
                {
                    text:
                        builderMode === ADT3DSceneBuilderMode.CreateBehavior
                            ? t('3dSceneBuilder.newBehavior')
                            : t('3dSceneBuilder.editBehavior'),
                    key: 'behaviorAdd',
                    onClick: () => setWidgetFormInfo(null)
                },
                {
                    text:
                        widgetFormInfo.mode ===
                        ADT3DSceneBuilderMode.CreateWidget
                            ? t('3dSceneBuilder.newWidget')
                            : t('3dSceneBuilder.editWidget'),
                    key: 'widgetAddEdit'
                }
            ];
        } else {
            breadcrumbItems = [
                ...breadcrumbItems,
                {
                    text:
                        builderMode === ADT3DSceneBuilderMode.CreateBehavior
                            ? t('3dSceneBuilder.newBehavior')
                            : t('3dSceneBuilder.editBehavior'),
                    key: 'behaviorAdd'
                }
            ];
        }
        return breadcrumbItems;
    };

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

    const { headerText, subHeaderText, iconName } = useMemo(() => {
        let headerText = '',
            subHeaderText = '',
            iconName = 'Ringer';

        if (widgetFormInfo) {
            if (widgetFormInfo.mode === ADT3DSceneBuilderMode.CreateWidget) {
                headerText = t('3dSceneBuilder.newWidget');
            } else {
                headerText = t('3dSceneBuilder.editWidget');
            }
            iconName = widgetFormInfo.widget.iconName;
            subHeaderText = widgetFormInfo.widget.title;
        } else {
            if (builderMode === ADT3DSceneBuilderMode.CreateBehavior) {
                headerText = t('3dSceneBuilder.newBehavior');
            } else if (builderMode === ADT3DSceneBuilderMode.EditBehavior) {
                headerText = t('3dSceneBuilder.modifyBehavior');
            }
            subHeaderText = t('3dSceneBuilder.behaviorTypes.alertBehavior');
            iconName = 'Ringer';
        }

        return {
            headerText,
            subHeaderText,
            iconName
        };
    }, [widgetFormInfo, builderMode]);

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
                <LeftPanelBuilderHeader
                    headerText={headerText}
                    subHeaderText={subHeaderText}
                    iconName={iconName}
                />
                {/* <SceneBuilderFormBreadcrumb
                    items={getBehaviorFormBreadcrumbItems()}
                /> */}
                {widgetFormInfo ? (
                    <WidgetForm />
                ) : (
                    <>
                        <div className="cb-scene-builder-left-panel-create-form">
                            <div className="cb-scene-builder-left-panel-create-form-contents">
                                <div>
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
                                                item.props
                                                    .itemKey as BehaviorPivot
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
                                            <div>
                                                <SceneElements
                                                    elements={elements}
                                                    selectedElements={
                                                        selectedElements
                                                    }
                                                    onElementEnter={
                                                        onElementEnter
                                                    }
                                                    onElementLeave={
                                                        onElementLeave
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
                                            <BehaviorFormAlertsTab />
                                        </PivotItem>
                                        <PivotItem
                                            headerText={t(
                                                '3dSceneBuilder.widgets'
                                            )}
                                            itemKey={BehaviorPivot.widgets}
                                        >
                                            <BehaviorFormWidgetsTab />
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
                                    disabled={!behaviorToEdit?.id}
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
