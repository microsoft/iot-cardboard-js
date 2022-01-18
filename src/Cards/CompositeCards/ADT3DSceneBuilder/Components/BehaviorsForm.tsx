import { Dropdown } from '@fluentui/react/lib/components/Dropdown/Dropdown';
import { FontIcon } from '@fluentui/react/lib/components/Icon/FontIcon';
import { TextField } from '@fluentui/react/lib/components/TextField/TextField';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    DatasourceType,
    IBehavior,
    ITwinToObjectMapping,
    IWidget,
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
import {
    ActionButton,
    DefaultButton,
    Dialog,
    DialogFooter,
    DialogType,
    IconButton,
    IContextualMenuItem,
    IContextualMenuProps,
    IDialogContentProps,
    IModalProps,
    Label,
    List,
    SearchBox
} from '@fluentui/react';

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

const gaugeJson = {
    type: 'Gauge',
    controlConfiguration: {
        valueBreakPoints: [100, 200, 500],
        units: 'PSI',
        colors: ['#FDCD4D', '#00D700', '#ff0000'],
        expression: 'primaryTwin.OutFlow',
        label: 'Left'
    }
};

const availableWidgets = [
    {
        name: 'Trend',
        description: 'Show historical data in context of your 3D scene'
    },
    {
        name: 'Gauge',
        description: 'Represent numerical datapoints with visual context',
        data: gaugeJson
    },
    { name: 'Link', description: 'Reference external content by linking a URL' }
];

const widgetSmallIcons = [];
widgetSmallIcons['Trend'] = (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M5.12503 6.41964L1.50896 9.58929L7.40181 12.5357L16 7.16072V8.39286L7.45533 13.7321L1.14286 10.5804V14.8571H16V16H0V0H1.14286V8.50895L5.17857 4.97324L7.42857 7.25002L13.7143 0.964309L16 3.25002V4.73217L13.7143 2.44645L7.42857 8.73217L5.12503 6.41964Z"
            fill="#323130"
        />
    </svg>
);
widgetSmallIcons['Gauge'] = (
    <svg
        width="15"
        height="15"
        viewBox="0 0 15 15"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M7.5 0C8.1875 0 8.84896 0.0911458 9.48438 0.273438C10.125 0.450521 10.724 0.703125 11.2812 1.03125C11.8385 1.35417 12.3438 1.74479 12.7969 2.20312C13.2552 2.65625 13.6458 3.16146 13.9688 3.71875C14.2969 4.27604 14.5495 4.875 14.7266 5.51562C14.9089 6.15104 15 6.8125 15 7.5C15 8.1875 14.9089 8.85156 14.7266 9.49219C14.5495 10.1276 14.2969 10.724 13.9688 11.2812C13.6458 11.8385 13.2552 12.3464 12.7969 12.8047C12.3438 13.2578 11.8385 13.6484 11.2812 13.9766C10.724 14.2995 10.125 14.5521 9.48438 14.7344C8.84896 14.9115 8.1875 15 7.5 15C6.8125 15 6.14844 14.9115 5.50781 14.7344C4.8724 14.5521 4.27604 14.2995 3.71875 13.9766C3.16146 13.6484 2.65365 13.2578 2.19531 12.8047C1.74219 12.3464 1.35156 11.8385 1.02344 11.2812C0.700521 10.724 0.447917 10.1276 0.265625 9.49219C0.0885417 8.85156 0 8.1875 0 7.5C0 6.8125 0.0885417 6.15104 0.265625 5.51562C0.447917 4.875 0.700521 4.27604 1.02344 3.71875C1.35156 3.16146 1.74219 2.65625 2.19531 2.20312C2.65365 1.74479 3.16146 1.35417 3.71875 1.03125C4.27604 0.703125 4.8724 0.450521 5.50781 0.273438C6.14844 0.0911458 6.8125 0 7.5 0ZM7.5 14C8.09896 14 8.67448 13.9219 9.22656 13.7656C9.77865 13.6094 10.2943 13.3906 10.7734 13.1094C11.2578 12.8281 11.6979 12.4896 12.0938 12.0938C12.4896 11.6979 12.8281 11.2604 13.1094 10.7812C13.3906 10.2969 13.6094 9.77865 13.7656 9.22656C13.9219 8.67448 14 8.09896 14 7.5C14 6.90104 13.9219 6.32552 13.7656 5.77344C13.6094 5.22135 13.3906 4.70573 13.1094 4.22656C12.8281 3.74219 12.4896 3.30208 12.0938 2.90625C11.6979 2.51042 11.2578 2.17188 10.7734 1.89062C10.2943 1.60938 9.77865 1.39062 9.22656 1.23438C8.67448 1.07812 8.09896 1 7.5 1C6.90104 1 6.32552 1.07812 5.77344 1.23438C5.22135 1.39062 4.70312 1.60938 4.21875 1.89062C3.73958 2.17188 3.30208 2.51042 2.90625 2.90625C2.51042 3.30208 2.17188 3.74219 1.89062 4.22656C1.60938 4.70573 1.39062 5.22135 1.23438 5.77344C1.07812 6.32552 1 6.90104 1 7.5C1 8.09896 1.07812 8.67448 1.23438 9.22656C1.39062 9.77865 1.60938 10.2969 1.89062 10.7812C2.17188 11.2604 2.51042 11.6979 2.90625 12.0938C3.30208 12.4896 3.73958 12.8281 4.21875 13.1094C4.70312 13.3906 5.22135 13.6094 5.77344 13.7656C6.32552 13.9219 6.90104 14 7.5 14ZM7.5 6C7.70833 6 7.90365 6.03906 8.08594 6.11719C8.26823 6.19531 8.42708 6.30208 8.5625 6.4375C8.69792 6.57292 8.80469 6.73177 8.88281 6.91406C8.96094 7.09635 9 7.29167 9 7.5C9 7.70833 8.96094 7.90365 8.88281 8.08594C8.80469 8.26823 8.69792 8.42708 8.5625 8.5625C8.42708 8.69792 8.26823 8.80469 8.08594 8.88281C7.90365 8.96094 7.70833 9 7.5 9C7.27083 9 7.05208 8.94792 6.84375 8.84375L6.85156 8.85156L3.97656 11.7266L3.27344 11.0234L6.14844 8.14844L6.15625 8.15625C6.05208 7.94792 6 7.72917 6 7.5C6 7.29167 6.03906 7.09635 6.11719 6.91406C6.19531 6.73177 6.30208 6.57292 6.4375 6.4375C6.57292 6.30208 6.73177 6.19531 6.91406 6.11719C7.09635 6.03906 7.29167 6 7.5 6ZM7.5 8C7.63542 8 7.7526 7.95052 7.85156 7.85156C7.95052 7.7526 8 7.63542 8 7.5C8 7.36458 7.95052 7.2474 7.85156 7.14844C7.7526 7.04948 7.63542 7 7.5 7C7.36458 7 7.2474 7.04948 7.14844 7.14844C7.04948 7.2474 7 7.36458 7 7.5C7 7.63542 7.04948 7.7526 7.14844 7.85156C7.2474 7.95052 7.36458 8 7.5 8ZM7.5 2.00781C8.00521 2.00781 8.49219 2.07292 8.96094 2.20312C9.42969 2.33333 9.86719 2.51823 10.2734 2.75781C10.6849 2.99219 11.0573 3.27604 11.3906 3.60938C11.724 3.94271 12.0078 4.3151 12.2422 4.72656C12.4818 5.13281 12.6667 5.57031 12.7969 6.03906C12.9271 6.50781 12.9922 6.99479 12.9922 7.5C12.9922 8.23438 12.8542 8.9375 12.5781 9.60938C12.3073 10.276 11.9115 10.8698 11.3906 11.3906L10.6797 10.6797C11.1016 10.2578 11.4271 9.77344 11.6562 9.22656C11.8854 8.67448 12 8.09896 12 7.5C12 6.88021 11.8802 6.29688 11.6406 5.75C11.4062 5.20312 11.0859 4.72656 10.6797 4.32031C10.2734 3.91406 9.79688 3.59375 9.25 3.35938C8.70312 3.11979 8.11979 3 7.5 3C7.08854 3 6.69271 3.05469 6.3125 3.16406C5.93229 3.26823 5.57552 3.41667 5.24219 3.60938C4.90885 3.80208 4.60417 4.03646 4.32812 4.3125C4.05729 4.58333 3.82292 4.88542 3.625 5.21875C3.43229 5.54688 3.28125 5.90365 3.17188 6.28906C3.06771 6.66927 3.01562 7.0651 3.01562 7.47656C3.01562 7.82552 3.05469 8.16927 3.13281 8.50781C3.21615 8.84635 3.33333 9.17188 3.48438 9.48438L2.59375 9.92969C2.40625 9.54948 2.26302 9.15365 2.16406 8.74219C2.0651 8.32552 2.01562 7.90365 2.01562 7.47656C2.01562 6.71615 2.15885 6.00521 2.44531 5.34375C2.73177 4.67708 3.1224 4.09635 3.61719 3.60156C4.11719 3.10677 4.69792 2.71875 5.35938 2.4375C6.02604 2.15104 6.73958 2.00781 7.5 2.00781Z"
            fill="#323130"
        />
    </svg>
);
widgetSmallIcons['Link'] = (
    <svg
        width="16"
        height="16"
        viewBox="0 0 73 47"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M54.75 14.375V18.9375C56.556 18.9375 58.2788 19.1514 59.9185 19.5791C61.5819 19.9831 63.0433 20.6484 64.3027 21.5752C65.5622 22.4782 66.5602 23.6545 67.2969 25.104C68.0573 26.5298 68.4375 28.2764 68.4375 30.3438C68.4375 31.9121 68.1286 33.3854 67.5107 34.7637C66.9167 36.1419 66.0968 37.3538 65.0513 38.3994C64.0295 39.4212 62.8294 40.241 61.4512 40.8589C60.0729 41.453 58.5996 41.75 57.0312 41.75H38.7812C37.2129 41.75 35.7396 41.453 34.3613 40.8589C32.9831 40.241 31.7712 39.4212 30.7256 38.3994C29.7038 37.3538 28.884 36.1419 28.2661 34.7637C27.672 33.3854 27.375 31.9121 27.375 30.3438C27.375 28.2764 27.7433 26.5298 28.48 25.104C29.2404 23.6545 30.2503 22.4782 31.5098 21.5752C32.7692 20.6484 34.2188 19.9831 35.8584 19.5791C37.5218 19.1514 39.2565 18.9375 41.0625 18.9375V14.375H38.7812C36.5713 14.375 34.492 14.8027 32.5435 15.6582C30.6187 16.4899 28.9315 17.6305 27.4819 19.0801C26.0562 20.5059 24.9155 22.193 24.0601 24.1416C23.2284 26.0664 22.8125 28.1338 22.8125 30.3438C22.8125 32.5537 23.2284 34.633 24.0601 36.5815C24.9155 38.5063 26.0562 40.1935 27.4819 41.6431C28.9315 43.0688 30.6187 44.2095 32.5435 45.0649C34.492 45.8966 36.5713 46.3125 38.7812 46.3125H57.0312C59.2412 46.3125 61.3086 45.8966 63.2334 45.0649C65.182 44.2095 66.8691 43.0688 68.2949 41.6431C69.7445 40.1935 70.8851 38.5063 71.7168 36.5815C72.5723 34.633 73 32.5537 73 30.3438C73 28.1338 72.5723 26.0664 71.7168 24.1416C70.8851 22.193 69.7445 20.5059 68.2949 19.0801C66.8691 17.6305 65.182 16.4899 63.2334 15.6582C61.3086 14.8027 59.2412 14.375 57.0312 14.375H54.75ZM31.9375 32.625V28.0625C33.7435 28.0625 35.4663 27.8605 37.106 27.4565C38.7694 27.0288 40.2308 26.3634 41.4902 25.4604C42.7497 24.5337 43.7477 23.3574 44.4844 21.9316C45.2448 20.4821 45.625 18.7236 45.625 16.6562C45.625 15.0879 45.3161 13.6146 44.6982 12.2363C44.1042 10.8581 43.2843 9.65804 42.2388 8.63623C41.217 7.59066 40.0169 6.77083 38.6387 6.17676C37.2604 5.55892 35.7871 5.25 34.2188 5.25H15.9688C14.4004 5.25 12.9271 5.55892 11.5488 6.17676C10.1706 6.77083 8.95866 7.59066 7.91309 8.63623C6.89128 9.65804 6.07145 10.8581 5.45361 12.2363C4.85954 13.6146 4.5625 15.0879 4.5625 16.6562C4.5625 18.7236 4.93083 20.4821 5.66748 21.9316C6.4279 23.3574 7.43783 24.5337 8.69727 25.4604C9.95671 26.3634 11.4062 27.0288 13.0459 27.4565C14.7093 27.8605 16.444 28.0625 18.25 28.0625V32.625H15.9688C13.7588 32.625 11.6795 32.2091 9.73096 31.3774C7.80615 30.522 6.11898 29.3813 4.66943 27.9556C3.24365 26.506 2.10303 24.8188 1.24756 22.894C0.415853 20.9455 0 18.8662 0 16.6562C0 14.4463 0.415853 12.3789 1.24756 10.4541C2.10303 8.50553 3.24365 6.81836 4.66943 5.39258C6.11898 3.94303 7.80615 2.80241 9.73096 1.9707C11.6795 1.11523 13.7588 0.6875 15.9688 0.6875H34.2188C36.4287 0.6875 38.4961 1.11523 40.4209 1.9707C42.3695 2.80241 44.0566 3.94303 45.4824 5.39258C46.932 6.81836 48.0726 8.50553 48.9043 10.4541C49.7598 12.3789 50.1875 14.4463 50.1875 16.6562C50.1875 18.8662 49.7598 20.9455 48.9043 22.894C48.0726 24.8188 46.932 26.506 45.4824 27.9556C44.0566 29.3813 42.3695 30.522 40.4209 31.3774C38.4961 32.2091 36.4287 32.625 34.2188 32.625H31.9375Z"
            fill="#323130"
        />
    </svg>
);
widgetSmallIcons['Panel'] = (
    <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M15 1V15H1V1H15ZM14.125 1.875H9.75V5.375H14.125V1.875ZM9.75 9.75H14.125V6.25H9.75V9.75ZM1.875 1.875V9.75H8.875V1.875H1.875ZM1.875 14.125H6.25V10.625H1.875V14.125ZM14.125 14.125V10.625H7.125V14.125H14.125Z"
            fill="#323130"
        />
    </svg>
);

const widgetLargeIcons = [];
widgetLargeIcons['Trend'] = (
    <svg
        width="46"
        height="46"
        viewBox="0 0 46 46"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect width="46" height="46" rx="10" fill="#136BFB" />
        <path
            transform="translate(9 8)"
            d="M19.625 6.5H27.125V14H25.25V9.70801L16.8125 18.1309L13.0625 14.3809L2.75 24.708V25.25H27.125V27.125H0.875V0.875H2.75V22.042L13.0625 11.7441L16.8125 15.4941L23.917 8.375H19.625V6.5Z"
            fill="white"
        />
    </svg>
);
widgetLargeIcons['Gauge'] = (
    <svg
        width="46"
        height="46"
        viewBox="0 0 46 46"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect width="46" height="46" rx="10" fill="#136BFB" />
        <path
            transform="translate(9 8)"
            d="M14.0625 0C15.3516 0 16.5918 0.170898 17.7832 0.512695C18.9844 0.844727 20.1074 1.31836 21.1523 1.93359C22.1973 2.53906 23.1445 3.27148 23.9941 4.13086C24.8535 4.98047 25.5859 5.92773 26.1914 6.97266C26.8066 8.01758 27.2803 9.14062 27.6123 10.3418C27.9541 11.5332 28.125 12.7734 28.125 14.0625C28.125 15.3516 27.9541 16.5967 27.6123 17.7979C27.2803 18.9893 26.8066 20.1074 26.1914 21.1523C25.5859 22.1973 24.8535 23.1494 23.9941 24.0088C23.1445 24.8584 22.1973 25.5908 21.1523 26.2061C20.1074 26.8115 18.9844 27.2852 17.7832 27.627C16.5918 27.959 15.3516 28.125 14.0625 28.125C12.7734 28.125 11.5283 27.959 10.3271 27.627C9.13574 27.2852 8.01758 26.8115 6.97266 26.2061C5.92773 25.5908 4.97559 24.8584 4.11621 24.0088C3.2666 23.1494 2.53418 22.1973 1.91895 21.1523C1.31348 20.1074 0.839844 18.9893 0.498047 17.7979C0.166016 16.5967 0 15.3516 0 14.0625C0 12.7734 0.166016 11.5332 0.498047 10.3418C0.839844 9.14062 1.31348 8.01758 1.91895 6.97266C2.53418 5.92773 3.2666 4.98047 4.11621 4.13086C4.97559 3.27148 5.92773 2.53906 6.97266 1.93359C8.01758 1.31836 9.13574 0.844727 10.3271 0.512695C11.5283 0.170898 12.7734 0 14.0625 0ZM14.0625 26.25C15.1855 26.25 16.2646 26.1035 17.2998 25.8105C18.335 25.5176 19.3018 25.1074 20.2002 24.5801C21.1084 24.0527 21.9336 23.418 22.6758 22.6758C23.418 21.9336 24.0527 21.1133 24.5801 20.2148C25.1074 19.3066 25.5176 18.335 25.8105 17.2998C26.1035 16.2646 26.25 15.1855 26.25 14.0625C26.25 12.9395 26.1035 11.8604 25.8105 10.8252C25.5176 9.79004 25.1074 8.82324 24.5801 7.9248C24.0527 7.0166 23.418 6.19141 22.6758 5.44922C21.9336 4.70703 21.1084 4.07227 20.2002 3.54492C19.3018 3.01758 18.335 2.60742 17.2998 2.31445C16.2646 2.02148 15.1855 1.875 14.0625 1.875C12.9395 1.875 11.8604 2.02148 10.8252 2.31445C9.79004 2.60742 8.81836 3.01758 7.91016 3.54492C7.01172 4.07227 6.19141 4.70703 5.44922 5.44922C4.70703 6.19141 4.07227 7.0166 3.54492 7.9248C3.01758 8.82324 2.60742 9.79004 2.31445 10.8252C2.02148 11.8604 1.875 12.9395 1.875 14.0625C1.875 15.1855 2.02148 16.2646 2.31445 17.2998C2.60742 18.335 3.01758 19.3066 3.54492 20.2148C4.07227 21.1133 4.70703 21.9336 5.44922 22.6758C6.19141 23.418 7.01172 24.0527 7.91016 24.5801C8.81836 25.1074 9.79004 25.5176 10.8252 25.8105C11.8604 26.1035 12.9395 26.25 14.0625 26.25ZM14.0625 11.25C14.4531 11.25 14.8193 11.3232 15.1611 11.4697C15.5029 11.6162 15.8008 11.8164 16.0547 12.0703C16.3086 12.3242 16.5088 12.6221 16.6553 12.9639C16.8018 13.3057 16.875 13.6719 16.875 14.0625C16.875 14.4531 16.8018 14.8193 16.6553 15.1611C16.5088 15.5029 16.3086 15.8008 16.0547 16.0547C15.8008 16.3086 15.5029 16.5088 15.1611 16.6553C14.8193 16.8018 14.4531 16.875 14.0625 16.875C13.6328 16.875 13.2227 16.7773 12.832 16.582L12.8467 16.5967L7.45605 21.9873L6.1377 20.6689L11.5283 15.2783L11.543 15.293C11.3477 14.9023 11.25 14.4922 11.25 14.0625C11.25 13.6719 11.3232 13.3057 11.4697 12.9639C11.6162 12.6221 11.8164 12.3242 12.0703 12.0703C12.3242 11.8164 12.6221 11.6162 12.9639 11.4697C13.3057 11.3232 13.6719 11.25 14.0625 11.25ZM14.0625 15C14.3164 15 14.5361 14.9072 14.7217 14.7217C14.9072 14.5361 15 14.3164 15 14.0625C15 13.8086 14.9072 13.5889 14.7217 13.4033C14.5361 13.2178 14.3164 13.125 14.0625 13.125C13.8086 13.125 13.5889 13.2178 13.4033 13.4033C13.2178 13.5889 13.125 13.8086 13.125 14.0625C13.125 14.3164 13.2178 14.5361 13.4033 14.7217C13.5889 14.9072 13.8086 15 14.0625 15ZM14.0625 3.76465C15.0098 3.76465 15.9229 3.88672 16.8018 4.13086C17.6807 4.375 18.501 4.72168 19.2627 5.1709C20.0342 5.61035 20.7324 6.14258 21.3574 6.76758C21.9824 7.39258 22.5146 8.09082 22.9541 8.8623C23.4033 9.62402 23.75 10.4443 23.9941 11.3232C24.2383 12.2021 24.3604 13.1152 24.3604 14.0625C24.3604 15.4395 24.1016 16.7578 23.584 18.0176C23.0762 19.2676 22.334 20.3809 21.3574 21.3574L20.0244 20.0244C20.8154 19.2334 21.4258 18.3252 21.8555 17.2998C22.2852 16.2646 22.5 15.1855 22.5 14.0625C22.5 12.9004 22.2754 11.8066 21.8262 10.7812C21.3867 9.75586 20.7861 8.8623 20.0244 8.10059C19.2627 7.33887 18.3691 6.73828 17.3438 6.29883C16.3184 5.84961 15.2246 5.625 14.0625 5.625C13.291 5.625 12.5488 5.72754 11.8359 5.93262C11.123 6.12793 10.4541 6.40625 9.8291 6.76758C9.2041 7.12891 8.63281 7.56836 8.11523 8.08594C7.60742 8.59375 7.16797 9.16016 6.79688 9.78516C6.43555 10.4004 6.15234 11.0693 5.94727 11.792C5.75195 12.5049 5.6543 13.2471 5.6543 14.0186C5.6543 14.6729 5.72754 15.3174 5.87402 15.9521C6.03027 16.5869 6.25 17.1973 6.5332 17.7832L4.86328 18.6182C4.51172 17.9053 4.24316 17.1631 4.05762 16.3916C3.87207 15.6104 3.7793 14.8193 3.7793 14.0186C3.7793 12.5928 4.04785 11.2598 4.58496 10.0195C5.12207 8.76953 5.85449 7.68066 6.78223 6.75293C7.71973 5.8252 8.80859 5.09766 10.0488 4.57031C11.2988 4.0332 12.6367 3.76465 14.0625 3.76465Z"
            fill="white"
        />
    </svg>
);
widgetLargeIcons['Link'] = (
    <svg
        width="46"
        height="46"
        viewBox="0 0 46 46"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <rect width="46" height="46" rx="10" fill="#136BFB" />
        <path
            transform="translate(8 13)"
            d="M22.5 6.25V8.125C23.2422 8.125 23.9502 8.21289 24.624 8.38867C25.3076 8.55469 25.9082 8.82812 26.4258 9.20898C26.9434 9.58008 27.3535 10.0635 27.6562 10.6592C27.9688 11.2451 28.125 11.9629 28.125 12.8125C28.125 13.457 27.998 14.0625 27.7441 14.6289C27.5 15.1953 27.1631 15.6934 26.7334 16.123C26.3135 16.543 25.8203 16.8799 25.2539 17.1338C24.6875 17.3779 24.082 17.5 23.4375 17.5H15.9375C15.293 17.5 14.6875 17.3779 14.1211 17.1338C13.5547 16.8799 13.0566 16.543 12.627 16.123C12.207 15.6934 11.8701 15.1953 11.6162 14.6289C11.3721 14.0625 11.25 13.457 11.25 12.8125C11.25 11.9629 11.4014 11.2451 11.7041 10.6592C12.0166 10.0635 12.4316 9.58008 12.9492 9.20898C13.4668 8.82812 14.0625 8.55469 14.7363 8.38867C15.4199 8.21289 16.1328 8.125 16.875 8.125V6.25H15.9375C15.0293 6.25 14.1748 6.42578 13.374 6.77734C12.583 7.11914 11.8896 7.58789 11.2939 8.18359C10.708 8.76953 10.2393 9.46289 9.8877 10.2637C9.5459 11.0547 9.375 11.9043 9.375 12.8125C9.375 13.7207 9.5459 14.5752 9.8877 15.376C10.2393 16.167 10.708 16.8604 11.2939 17.4561C11.8896 18.042 12.583 18.5107 13.374 18.8623C14.1748 19.2041 15.0293 19.375 15.9375 19.375H23.4375C24.3457 19.375 25.1953 19.2041 25.9863 18.8623C26.7871 18.5107 27.4805 18.042 28.0664 17.4561C28.6621 16.8604 29.1309 16.167 29.4727 15.376C29.8242 14.5752 30 13.7207 30 12.8125C30 11.9043 29.8242 11.0547 29.4727 10.2637C29.1309 9.46289 28.6621 8.76953 28.0664 8.18359C27.4805 7.58789 26.7871 7.11914 25.9863 6.77734C25.1953 6.42578 24.3457 6.25 23.4375 6.25H22.5ZM13.125 13.75V11.875C13.8672 11.875 14.5752 11.792 15.249 11.626C15.9326 11.4502 16.5332 11.1768 17.0508 10.8057C17.5684 10.4248 17.9785 9.94141 18.2812 9.35547C18.5938 8.75977 18.75 8.03711 18.75 7.1875C18.75 6.54297 18.623 5.9375 18.3691 5.37109C18.125 4.80469 17.7881 4.31152 17.3584 3.8916C16.9385 3.46191 16.4453 3.125 15.8789 2.88086C15.3125 2.62695 14.707 2.5 14.0625 2.5H6.5625C5.91797 2.5 5.3125 2.62695 4.74609 2.88086C4.17969 3.125 3.68164 3.46191 3.25195 3.8916C2.83203 4.31152 2.49512 4.80469 2.24121 5.37109C1.99707 5.9375 1.875 6.54297 1.875 7.1875C1.875 8.03711 2.02637 8.75977 2.3291 9.35547C2.6416 9.94141 3.05664 10.4248 3.57422 10.8057C4.0918 11.1768 4.6875 11.4502 5.36133 11.626C6.04492 11.792 6.75781 11.875 7.5 11.875V13.75H6.5625C5.6543 13.75 4.7998 13.5791 3.99902 13.2373C3.20801 12.8857 2.51465 12.417 1.91895 11.8311C1.33301 11.2354 0.864258 10.542 0.512695 9.75098C0.170898 8.9502 0 8.0957 0 7.1875C0 6.2793 0.170898 5.42969 0.512695 4.63867C0.864258 3.83789 1.33301 3.14453 1.91895 2.55859C2.51465 1.96289 3.20801 1.49414 3.99902 1.15234C4.7998 0.800781 5.6543 0.625 6.5625 0.625H14.0625C14.9707 0.625 15.8203 0.800781 16.6113 1.15234C17.4121 1.49414 18.1055 1.96289 18.6914 2.55859C19.2871 3.14453 19.7559 3.83789 20.0977 4.63867C20.4492 5.42969 20.625 6.2793 20.625 7.1875C20.625 8.0957 20.4492 8.9502 20.0977 9.75098C19.7559 10.542 19.2871 11.2354 18.6914 11.8311C18.1055 12.417 17.4121 12.8857 16.6113 13.2373C15.8203 13.5791 14.9707 13.75 14.0625 13.75H13.125Z"
            fill="white"
        />
    </svg>
);

const BehaviorFormWidgetsTab: React.FC<{
    behaviorToEdit: IBehavior;
    setBehaviorToEdit: React.Dispatch<React.SetStateAction<IBehavior>>;
}> = ({ behaviorToEdit, setBehaviorToEdit }) => {
    const popOver = behaviorToEdit?.visuals?.find(
        (visual) => visual.type === VisualType.OnClickPopover
    );
    const [widgets, setWidgets] = useState<IWidget[]>(popOver?.widgets);
    const [libraryDialogOpen, setLibraryDialogOpen] = useState(false);
    const { t } = useTranslation();

    function getMenuProps(index: number): IContextualMenuProps {
        return {
            items: [
                {
                    key: 'edit',
                    text: t('3dSceneBuilder.editWidget'),
                    iconProps: { iconName: 'Edit' },
                    onClick: (ev, item) => onMenuClick(index, item)
                },
                {
                    key: 'remove',
                    text: t('3dSceneBuilder.removeWidget'),
                    iconProps: { iconName: 'Delete' },
                    onClick: (ev, item) => onMenuClick(index, item)
                }
            ]
        };
    }

    function onMenuClick(index: number, item: IContextualMenuItem) {
        if (item.key === 'remove') {
            const wids = [...widgets];
            wids.splice(index, 1);
            setBehaviorToEdit(
                produce((draft) => {
                    const popOver = draft?.visuals?.find(
                        (visual) => visual.type === VisualType.OnClickPopover
                    );
                    popOver.widgets = wids;
                    setWidgets(wids);
                })
            );
        }
    }

    function onWidgetAdd(data: any) {
        const wids = widgets ? [...widgets] : [];
        wids.push(data);
        setBehaviorToEdit(
            produce((draft) => {
                const popOver = draft?.visuals?.find(
                    (visual) => visual.type === VisualType.OnClickPopover
                );
                if (popOver) {
                    popOver.widgets = wids; // TODO: Add popOver if not there
                    setWidgets(wids);
                }
            })
        );
    }

    return (
        <div className="cb-widget-panel-container">
            {!widgets?.length && (
                <Label className="cb-widget-panel-label">
                    No widgets configured yet
                </Label>
            )}
            {widgets?.length > 0 &&
                widgets.map((widget, index) => (
                    <div key={index} className="cb-widget-panel-list-container">
                        {widgetSmallIcons[widget.type]}
                        <Label className="cb-widget-panel-list-label">
                            {widget.type}
                        </Label>
                        <div className="cb-widget-panel-flex1" />
                        <IconButton
                            menuIconProps={{
                                iconName: 'MoreVertical',
                                style: {
                                    fontWeight: 'bold',
                                    fontSize: 18,
                                    color: 'black'
                                }
                            }}
                            menuProps={getMenuProps(index)}
                        />
                    </div>
                ))}
            <ActionButton
                className="cb-widget-panel-action-button"
                text={t('3dSceneBuilder.addWidget')}
                onClick={() => {
                    setLibraryDialogOpen(true);
                }}
            />
            {libraryDialogOpen && (
                <WidgetLibraryDialog
                    setLibraryDialogOpen={setLibraryDialogOpen}
                    addAction={(data) => onWidgetAdd(data)}
                />
            )}
        </div>
    );
};

export default SceneBehaviorsForm;

const WidgetLibraryDialog: React.FC<{
    setLibraryDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    addAction: any;
}> = ({ setLibraryDialogOpen, addAction }) => {
    const [selectedWidget, setSelectedWidget] = useState<number>(null);
    const [filteredAvailableWidgets, setFilteredAvailableWidgets] = useState(
        availableWidgets
    );
    const { t } = useTranslation();

    const dialogContentProps: IDialogContentProps = {
        type: DialogType.close,
        title: t('3dSceneBuilder.widgetLibrary')
    };

    const modalProps: IModalProps = {
        isBlocking: false,
        containerClassName: 'cb-widget-dialog-modal',
        isDarkOverlay: false
    };

    return (
        <Dialog
            dialogContentProps={dialogContentProps}
            modalProps={modalProps}
            hidden={false}
            onDismiss={() => setLibraryDialogOpen(false)}
        >
            <Label className="cb-widget-panel-item-label">
                {t('3dSceneBuilder.exploreWidgets')}
            </Label>
            <SearchBox
                className="cb-widget-dialog-search-box"
                placeholder={t('3dSceneBuilder.searchWidgets')}
            />
            <Pivot>
                <PivotItem headerText={t('3dSceneBuilder.allWidgets')}>
                    <div>
                        <List
                            items={filteredAvailableWidgets}
                            onRenderCell={(widget, index) => (
                                <div
                                    key={index}
                                    className={`cb-widget-dialog-list-item ${
                                        index === selectedWidget
                                            ? 'cb-widget-dialog-list-item-selected'
                                            : ''
                                    }`}
                                    onClick={() => {
                                        setSelectedWidget(index);
                                        setFilteredAvailableWidgets([
                                            ...availableWidgets
                                        ]);
                                    }}
                                >
                                    <div className="cb-widget-dialog-list-item-content">
                                        <div className="cb-widget-dialog-icon">
                                            {widgetLargeIcons[widget.name]}
                                        </div>
                                        <div>
                                            <Label>{widget.name}</Label>
                                            <Label className="cb-widget-panel-item-label ">
                                                {widget.description}
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            )}
                        ></List>
                        <div className="cb-widget-panel-clear-float" />
                    </div>
                </PivotItem>
                <PivotItem headerText={t('3dSceneBuilder.myWidgets')}>
                    <Label className="cb-widget-panel-no-widgets">
                        {t('3dSceneBuilder.noWidgets')}
                    </Label>
                </PivotItem>
            </Pivot>
            <DialogFooter>
                <PrimaryButton
                    disabled={!selectedWidget}
                    onClick={() => {
                        setLibraryDialogOpen(false);
                        if (
                            selectedWidget &&
                            availableWidgets[selectedWidget].data
                        ) {
                            addAction(availableWidgets[selectedWidget].data);
                        }
                    }}
                    text={t('3dSceneBuilder.addWidget')}
                />
                <DefaultButton
                    onClick={() => setLibraryDialogOpen(false)}
                    text={t('cancel')}
                />
            </DialogFooter>
        </Dialog>
    );
};
