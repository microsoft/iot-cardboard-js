import { Dropdown } from '@fluentui/react/lib/components/Dropdown/Dropdown';
import { FontIcon } from '@fluentui/react/lib/components/Icon/FontIcon';
import { TextField } from '@fluentui/react/lib/components/TextField/TextField';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    DatasourceType,
    IBehavior,
    ITwinToObjectMapping,
    VisualType
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
import { ColorPicker } from '@fluentui/react/lib/components/ColorPicker/ColorPicker';

const defaultBehavior: IBehavior = {
    id: '',
    type: 'Behavior',
    layers: ['PhysicalProperties'],
    datasources: [],
    visuals: [
        {
            type: VisualType.ColorChange,
            color: {
                type: 'BindingExpression',
                expression: ''
            },
            elementIDs: {
                type: 'MeshIDArray',
                expression: 'meshIDs'
            },
            label: null,
            isHorizontal: false,
            title: '',
            widgets: []
        }
    ],
    twinAliases: []
};

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
    setSelectedObjectIds
}) => {
    const { t } = useTranslation();

    const [behaviorToEdit, setBehaviorToEdit] = useState<IBehavior>(
        selectedBehavior ?? defaultBehavior
    );

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
        setSelectedObjectIds(meshIds);
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
                        setSelectedObjectIds([]);
                    }}
                >
                    <FontIcon
                        iconName={'ChevronRight'}
                        className="cb-chevron cb-breadcrumb"
                    />
                    <span>
                        {builderMode === ADT3DSceneBuilderMode.EditElement
                            ? selectedBehavior.id
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
                        setSelectedObjectIds([]);
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

const BehaviorFormElementsTab: React.FC<{
    behaviorToEdit: IBehavior;
    setBehaviorToEdit: React.Dispatch<React.SetStateAction<IBehavior>>;
    elements: Array<ITwinToObjectMapping>;
    colorSelectedElements: (
        elementsToColor: Array<ITwinToObjectMapping>
    ) => any;
}> = ({
    behaviorToEdit,
    setBehaviorToEdit,
    elements,
    colorSelectedElements
}) => {
    const { t } = useTranslation();

    return (
        <Dropdown
            label={t('3dSceneBuilder.behaviorElementsDropdownLabel')}
            selectedKey={
                behaviorToEdit?.datasources?.[0]?.mappingIDs?.[0] ?? undefined
            }
            onChange={(_ev, option) => {
                setBehaviorToEdit(
                    produce((draft) => {
                        // v1 datasources set to single TwinToObjectMappingDatasource
                        draft.datasources = [
                            {
                                type: DatasourceType.TwinToObjectMapping,
                                mappingIDs: [option.id], // v1 mappingIDs set to single element
                                messageFilter: '',
                                twinFilterQuery: '',
                                twinFilterSelector: ''
                            }
                        ];
                    })
                );

                // Color selected element mesh in scene
                const selectedElement = elements.find(
                    (el) => el.id === option.id
                );
                selectedElement && colorSelectedElements([selectedElement]);
            }}
            placeholder={t(
                '3dSceneBuilder.behaviorElementsDropdownPlaceholder'
            )}
            options={elements.map((el) => ({
                key: el.id,
                text: el.displayName,
                id: el.id,
                data: el
            }))}
        />
    );
};

const BehaviorFormAlertsTab: React.FC<{
    behaviorToEdit: IBehavior;
    setBehaviorToEdit: React.Dispatch<React.SetStateAction<IBehavior>>;
}> = ({ behaviorToEdit, setBehaviorToEdit }) => {
    const { t } = useTranslation();

    let colorAlertTriggerExpression = '';
    const colorChangeVisual = behaviorToEdit.visuals.find(
        (visual) => visual.type === VisualType.ColorChange
    );
    if (colorChangeVisual) {
        colorAlertTriggerExpression = colorChangeVisual.color.expression;
    }

    const [color, setColor] = useState('#FF0000');

    return (
        <>
            <TextField
                label={t('3dSceneBuilder.behaviorTriggerLabel')}
                multiline={colorAlertTriggerExpression.length > 50}
                onChange={(_e, newValue) => {
                    setBehaviorToEdit(
                        produce((draft) => {
                            // Assuming only 1 color change visual per behavior
                            const colorChangeVisual = draft.visuals.find(
                                (visual) =>
                                    visual.type === VisualType.ColorChange
                            );
                            colorChangeVisual.color.expression = newValue;
                        })
                    );
                }}
                value={colorAlertTriggerExpression}
                placeholder={t('3dSceneBuilder.behaviorTriggerPlaceholder')}
            />
            <ColorPicker
                alphaType={'none'}
                color={color}
                onChange={(_ev, color) => setColor(color.hex)}
            />
        </>
    );
};

const BehaviorFormWidgetsTab: React.FC<any> = () => {
    return <div>Widgets</div>;
};

export default SceneBehaviorsForm;
