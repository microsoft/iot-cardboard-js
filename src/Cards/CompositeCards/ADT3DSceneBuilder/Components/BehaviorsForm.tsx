import { Dropdown } from '@fluentui/react/lib/components/Dropdown/Dropdown';
import { FontIcon } from '@fluentui/react/lib/components/Icon/FontIcon';
import { TextField } from '@fluentui/react/lib/components/TextField/TextField';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    DatasourceType,
    IBehavior,
    VisualType
} from '../../../../Models/Classes/3DVConfig';
import { ADT3DSceneBuilderMode } from '../../../../Models/Constants/Enums';
import { IADT3DSceneBuilderBehaviorFormProps } from '../ADT3DSceneBuilder.types';
import produce from 'immer';
import { PrimaryButton } from '@fluentui/react/lib/components/Button/PrimaryButton/PrimaryButton';

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
            title: '',
            widgets: []
        }
    ],
    twinAliases: []
};

const SceneBehaviorsForm: React.FC<IADT3DSceneBuilderBehaviorFormProps> = ({
    elements,
    builderMode,
    selectedBehavior,
    onBehaviorBackClick,
    onBehaviorSave
}) => {
    const { t } = useTranslation();

    const [behaviorToEdit, setBehaviorToEdit] = useState<IBehavior>(
        selectedBehavior ?? defaultBehavior
    );

    let colorAlertTriggerExpression = '';
    const colorChangeVisual = behaviorToEdit.visuals.find(
        (visual) => visual.type === VisualType.ColorChange
    );
    if (colorChangeVisual) {
        colorAlertTriggerExpression = colorChangeVisual.color.expression;
    }

    return (
        <div className="cb-scene-builder-left-panel-create-wrapper">
            <div className="cb-scene-builder-left-panel-create-form">
                <div
                    className="cb-scene-builder-left-panel-create-form-header"
                    tabIndex={0}
                    onClick={onBehaviorBackClick}
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
                        label={t('id')}
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

                    <Dropdown
                        label={t(
                            '3dSceneBuilder.behaviorElementsDropdownLabel'
                        )}
                        selectedKey={
                            behaviorToEdit?.datasources?.[0]?.mappingIDs?.[0] ??
                            undefined
                        }
                        onChange={(_ev, option) => {
                            setBehaviorToEdit(
                                produce((draft) => {
                                    // v1 datasources set to single TwinToObjectMappingDatasource
                                    draft.datasources = [
                                        {
                                            type:
                                                DatasourceType.TwinToObjectMapping,
                                            mappingIDs: [option.id], // v1 mappingIDs set to single element
                                            messageFilter: '',
                                            twinFilterQuery: '',
                                            twinFilterSelector: ''
                                        }
                                    ];
                                })
                            );
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
                    <TextField
                        label={t('3dSceneBuilder.behaviorTriggerLabel')}
                        multiline={colorAlertTriggerExpression.length > 50}
                        onChange={(_e, newValue) => {
                            setBehaviorToEdit(
                                produce((draft) => {
                                    // Assuming only 1 color change visual per behavior
                                    const colorChangeVisual = draft.visuals.find(
                                        (visual) =>
                                            visual.type ===
                                            VisualType.ColorChange
                                    );
                                    colorChangeVisual.color.expression = newValue;
                                })
                            );
                        }}
                        value={colorAlertTriggerExpression}
                        placeholder={t(
                            '3dSceneBuilder.behaviorTriggerPlaceholder'
                        )}
                    />
                </div>
            </div>
            <div className="cb-scene-builder-left-panel-create-form-actions">
                <PrimaryButton
                    onClick={() => {
                        onBehaviorSave(behaviorToEdit);
                        onBehaviorBackClick();
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
