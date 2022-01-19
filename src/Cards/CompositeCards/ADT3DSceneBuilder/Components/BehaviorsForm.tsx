import React, { useEffect, useState, createContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
    DatasourceType,
    IBehavior,
    ITwinToObjectMapping
} from '../../../../Models/Classes/3DVConfig';
import { ADT3DSceneBuilderMode } from '../../../../Models/Constants/Enums';
import {
    BehaviorSaveMode,
    IADT3DSceneBuilderBehaviorFormProps
} from '../ADT3DSceneBuilder.types';
import produce from 'immer';
import { PrimaryButton } from '@fluentui/react/lib/components/Button/PrimaryButton/PrimaryButton';
import { Pivot } from '@fluentui/react/lib/components/Pivot/Pivot';
import { PivotItem } from '@fluentui/react/lib/components/Pivot/PivotItem';
import { FontIcon, TextField } from '@fluentui/react';
import BehaviorFormElementsTab from './BehaviorFormElementsTab';
import BehaviorFormAlertsTab from './BehaviorFormAlertsTab';
import BehaviorFormWidgetsTab from './BehaviorFormWidgetsTab';
import { defaultBehavior } from '../../../../Models/Constants/Constants';

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

    const [
        selectedBehaviorPivotKey,
        setSelectedBehaviorPivotKey
    ] = useState<BehaviorPivot>(BehaviorPivot.elements);

    const [originalBehaviorId, setOriginalBehaviorId] = useState(
        selectedBehavior?.id
    );

    const behaviorContext = createContext(null); // TODO add behavior state to context

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

    return (
        <div className="cb-scene-builder-left-panel-create-wrapper">
            <div className="cb-scene-builder-left-panel-create-form">
                <div
                    className="cb-scene-builder-left-panel-create-form-header"
                    tabIndex={0}
                    onClick={() => {
                        onBehaviorBackClick();
                        setSelectedMeshIds([]);
                    }}
                >
                    <FontIcon
                        iconName={'ChevronRight'}
                        className="cb-chevron cb-breadcrumb"
                    />
                    <span>
                        {builderMode !== ADT3DSceneBuilderMode.CreateBehavior
                            ? t('3dSceneBuilder.editBehavior')
                            : t('3dSceneBuilder.newBehavior')}
                    </span>
                </div>
                <div className="cb-scene-builder-left-panel-create-form-contents">
                    <TextField
                        label={t('3dSceneBuilder.behaviorId')}
                        value={behaviorToEdit.id}
                        required
                        onChange={(_e, newValue) => {
                            setBehaviorToEdit(
                                produce((draft) => {
                                    draft.id = newValue.replace(/\s/g, '');
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
                            root: { marginLeft: -8, marginBottom: 8 }
                        }}
                    >
                        <PivotItem
                            headerText={t('3dSceneBuilder.elements')}
                            itemKey={BehaviorPivot.elements}
                        >
                            <BehaviorFormElementsTab
                                behaviorToEdit={behaviorToEdit}
                                elements={elements}
                                setBehaviorToEdit={setBehaviorToEdit}
                                colorSelectedElements={colorSelectedElements}
                            />
                        </PivotItem>
                        <PivotItem
                            headerText={t('3dSceneBuilder.alerts')}
                            itemKey={BehaviorPivot.alerts}
                        >
                            <BehaviorFormAlertsTab
                                behaviorToEdit={behaviorToEdit}
                                setBehaviorToEdit={setBehaviorToEdit}
                            />
                        </PivotItem>
                        <PivotItem
                            headerText={t('3dSceneBuilder.widgets')}
                            itemKey={BehaviorPivot.widgets}
                        >
                            <BehaviorFormWidgetsTab
                                behaviorToEdit={behaviorToEdit}
                                setBehaviorToEdit={setBehaviorToEdit}
                            />
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
                        builderMode === ADT3DSceneBuilderMode.CreateBehavior
                            ? t('create')
                            : t('update')
                    }
                    disabled={!behaviorToEdit?.id}
                />
            </div>
        </div>
    );
};

export default SceneBehaviorsForm;
