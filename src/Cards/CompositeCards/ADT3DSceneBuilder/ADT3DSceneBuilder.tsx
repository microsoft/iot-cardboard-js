import {
    ActionButton,
    FontIcon,
    IconButton,
    IContextualMenuProps,
    Pivot,
    PivotItem,
    PrimaryButton,
    TextField
} from '@fluentui/react';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ADT3DSceneBuilderMode,
    ADT3DSceneTwinBindingsMode
} from '../../../Models/Constants/Enums';
import ADT3DBuilderCard from '../../ADT3DBuilderCard/ADT3DBuilderCard';
import BaseCompositeCard from '../BaseCompositeCard/Consume/BaseCompositeCard';
import {
    I3DSceneBuilderContext,
    IADT3DSceneBuilderCardProps,
    IADT3DSceneBuilderVIsualStateRulesWizardProps
} from './ADT3DSceneBuilder.types';
import './ADT3DSceneBuilder.scss';
import { ADT3DSceneElement } from '../../../Models/Constants/Types';
import BaseComponent from '../../../Components/BaseComponent/BaseComponent';

export const SceneBuilderContext = React.createContext<I3DSceneBuilderContext>(
    null
);

const ADT3DSceneBuilder: React.FC<IADT3DSceneBuilderCardProps> = ({
    adapter,
    theme,
    locale,
    localeStrings,
    adapterAdditionalParameters
}) => {
    const [builderMode, setBuilderMode] = useState(ADT3DSceneBuilderMode.Idle);
    const [selectedObjects, setSelectedObjects] = useState([]);

    const onMeshSelected = (selectedMeshes) => {
        setSelectedObjects(selectedMeshes);
    };

    return (
        <SceneBuilderContext.Provider
            value={{
                builderMode,
                setBuilderMode,
                selectedObjects,
                setSelectedObjects
            }}
        >
            <div className="cb-scene-builder-card-wrapper">
                <BaseCompositeCard
                    theme={theme}
                    locale={locale}
                    localeStrings={localeStrings}
                    adapterAdditionalParameters={adapterAdditionalParameters}
                >
                    <div className="cb-scene-builder-twin-bindings">
                        <VisualStateRulesWizard
                            adapter={adapter}
                            theme={theme}
                            locale={locale}
                            localeStrings={localeStrings}
                        />
                    </div>
                    <div className="cb-scene-builder-canvas">
                        <ADT3DBuilderCard
                            adapter={adapter as any}
                            modelUrl={
                                'https://cardboardresources.blob.core.windows.net/3dv-workspace-2/TruckBoxesEnginesPastmachine.gltf'
                            }
                            onMeshSelected={(selectedMeshes) =>
                                onMeshSelected(selectedMeshes)
                            }
                            preselectedMeshes={selectedObjects}
                        />
                    </div>
                </BaseCompositeCard>
            </div>
        </SceneBuilderContext.Provider>
    );
};

const VisualStateRulesWizard: React.FC<IADT3DSceneBuilderVIsualStateRulesWizardProps> = ({
    adapter,
    theme,
    locale,
    localeStrings
}) => {
    const { t } = useTranslation();

    const {
        builderMode,
        setBuilderMode,
        selectedObjects,
        setSelectedObjects
    } = useContext(SceneBuilderContext);

    const [elements, setElements] = useState<Array<ADT3DSceneElement>>([]);
    const [_behaviors, _setBehaviors] = useState([]); //TODO: implement logic for this
    const [elementToEdit, setElementToEdit] = useState<ADT3DSceneElement>(null);
    const [selectedElement, setSelectedElement] = useState<ADT3DSceneElement>(
        null
    );
    const [isObjectsExpanded, setIsObjectsExpanded] = useState<boolean>(true);

    const handleCreateElementClick = () => {
        setBuilderMode(ADT3DSceneBuilderMode.CreateElement);
        setElementToEdit(null);
        setIsObjectsExpanded(true);
        setSelectedObjects([]);
        setSelectedElement(null);
    };

    const handleSaveClick = () => {
        if (builderMode === ADT3DSceneBuilderMode.CreateElement) {
            const newElement: ADT3DSceneElement = {
                name: elementToEdit.name,
                linkedTwinId: elementToEdit.linkedTwinId,
                objects: elementToEdit.objects
            };
            setElements(elements.concat(newElement));
        } else {
            const updatedElement: ADT3DSceneElement = {
                name: elementToEdit.name,
                linkedTwinId: elementToEdit.linkedTwinId,
                objects: elementToEdit.objects
            };
            const updatedElements = [...elements];
            updatedElements[
                elements.findIndex((e) => e.name === selectedElement.name)
            ] = updatedElement;
            setElements(updatedElements);
        }

        setBuilderMode(ADT3DSceneBuilderMode.Idle);
        setSelectedObjects([]);
    };

    const handleElementClick = (element: ADT3DSceneElement) => {
        setSelectedElement({ ...element });
        setSelectedObjects(element.objects);
        setElementToEdit(element);
        setIsObjectsExpanded(false);
        setBuilderMode(ADT3DSceneBuilderMode.EditElement);
    };

    useEffect(() => {
        if (
            builderMode === ADT3DSceneBuilderMode.CreateElement ||
            builderMode === ADT3DSceneBuilderMode.EditElement
        ) {
            setElementToEdit({
                ...elementToEdit,
                objects: selectedObjects
            });
        }
    }, [selectedObjects]);

    const objectMenuProps = (objectName: string): IContextualMenuProps => {
        return {
            items: [
                {
                    key: 'remove',
                    text: 'Remove',
                    iconProps: { iconName: 'Delete' },
                    onClick: () => {
                        const currentObjects = [...elementToEdit.objects];
                        currentObjects.splice(
                            currentObjects.indexOf(objectName),
                            1
                        );
                        setSelectedObjects(currentObjects);
                    }
                }
            ],
            styles: { root: { minWidth: 'unset' } }
        };
    };

    return (
        <BaseComponent
            isLoading={false}
            theme={theme}
            locale={locale}
            localeStrings={localeStrings}
        >
            {builderMode === ADT3DSceneBuilderMode.Idle ? (
                <Pivot
                    aria-label={t('buildMode')}
                    defaultSelectedKey={ADT3DSceneTwinBindingsMode.Elements}
                    className="cb-scene-builder-twin-bindings-pivot"
                >
                    <PivotItem
                        headerText={t('3dSceneBuilder.elements')}
                        itemKey={ADT3DSceneTwinBindingsMode.Elements}
                    >
                        <ActionButton
                            iconProps={{ iconName: 'Add' }}
                            onClick={handleCreateElementClick}
                        >
                            {t('3dSceneBuilder.createElement')}
                        </ActionButton>
                        {elements.length === 0 ? (
                            <p className="cb-scene-builder-twin-bindings-text">
                                There is no elements.
                            </p>
                        ) : (
                            elements.map((e: ADT3DSceneElement) => (
                                <div
                                    className="cb-scene-builder-twin-bindings-element"
                                    key={e.name}
                                    onClick={() => handleElementClick(e)}
                                >
                                    <FontIcon
                                        iconName={'Shapes'}
                                        className="cb-element"
                                    />
                                    <span className="cb-scene-builder-element-name">
                                        {e.name}
                                    </span>
                                </div>
                            ))
                        )}
                    </PivotItem>
                    <PivotItem
                        headerText={t('3dSceneBuilder.behaviors')}
                        itemKey={ADT3DSceneTwinBindingsMode.Behaviors}
                    >
                        <div>
                            <p className="cb-scene-builder-twin-bindings-text">
                                There is no behaviors.
                            </p>
                        </div>
                    </PivotItem>
                </Pivot>
            ) : (
                <div className="cb-scene-builder-twin-bindings-create-element-wrapper">
                    <div className="cb-scene-builder-twin-bindings-create-element-form">
                        <div
                            className="cb-scene-builder-twin-bindings-create-element-header"
                            tabIndex={0}
                            onClick={(e) => {
                                e.stopPropagation();
                                setBuilderMode(ADT3DSceneBuilderMode.Idle);
                                setElementToEdit(null);
                                setIsObjectsExpanded(true);
                                setSelectedObjects([]);
                            }}
                        >
                            <FontIcon
                                iconName={'ChevronRight'}
                                className="cb-chevron cb-breadcrumb"
                            />
                            <span>
                                {builderMode ===
                                ADT3DSceneBuilderMode.EditElement
                                    ? selectedElement.name
                                    : 'New element'}
                            </span>
                        </div>

                        <div className="cb-scene-builder-twin-bindings-create-element-inner-form">
                            <TextField
                                label="Name"
                                value={elementToEdit?.name}
                                onChange={(e) =>
                                    setElementToEdit({
                                        ...elementToEdit,
                                        name: e.currentTarget.value
                                    })
                                }
                            />
                            <TextField
                                label="Twin link"
                                value={elementToEdit?.linkedTwinId}
                                onChange={(e) =>
                                    setElementToEdit({
                                        ...elementToEdit,
                                        linkedTwinId: e.currentTarget.value
                                    })
                                }
                            />
                        </div>
                        <div className="cb-scene-builder-twin-bindings-element-objects">
                            <div
                                className="cb-scene-builder-twin-bindings-element-objects-header"
                                tabIndex={0}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsObjectsExpanded(!isObjectsExpanded);
                                }}
                            >
                                <FontIcon
                                    iconName={'ChevronRight'}
                                    className={`cb-chevron ${
                                        isObjectsExpanded
                                            ? 'cb-expanded'
                                            : 'cb-collapsed'
                                    }`}
                                />
                                <span>Objects</span>
                            </div>
                            {isObjectsExpanded && (
                                <div className="cb-scene-builder-twin-bindings-element-objects-container">
                                    <ul className="cb-scene-builder-twin-bindings-element-object-list">
                                        {selectedObjects.map((meshName) => (
                                            <li
                                                key={meshName}
                                                className="cb-scene-builder-twin-bindings-element-object"
                                            >
                                                <div className="cb-mesh-name-wrapper">
                                                    <FontIcon
                                                        iconName={'CubeShape'}
                                                    />
                                                    <span className="cb-mesh-name">
                                                        {meshName}
                                                    </span>
                                                </div>
                                                <IconButton
                                                    menuProps={objectMenuProps(
                                                        meshName
                                                    )}
                                                    iconProps={{
                                                        iconName: 'MoreVertical'
                                                    }}
                                                    title="Remove"
                                                    ariaLabel="Remove"
                                                    onRenderMenuIcon={() =>
                                                        null
                                                    }
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="cb-scene-builder-twin-bindings-create-element-actions">
                        <PrimaryButton
                            onClick={handleSaveClick}
                            text={
                                builderMode ===
                                ADT3DSceneBuilderMode.CreateElement
                                    ? 'Create element'
                                    : 'Update element'
                            }
                            disabled={
                                !(
                                    elementToEdit?.name &&
                                    elementToEdit?.linkedTwinId &&
                                    elementToEdit?.objects?.length > 0
                                )
                            }
                        />
                    </div>
                </div>
            )}
        </BaseComponent>
    );
};

export default React.memo(ADT3DSceneBuilder);
