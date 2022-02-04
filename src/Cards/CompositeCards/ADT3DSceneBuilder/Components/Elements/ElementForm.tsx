import React, {
    createRef,
    useContext,
    useEffect,
    useRef,
    useState
} from 'react';
import { useTranslation } from 'react-i18next';
import {
    DefaultButton,
    FontIcon,
    IconButton,
    Label,
    PrimaryButton,
    Text,
    TextField
} from '@fluentui/react';
import Select from 'react-select';
import { IADT3DSceneBuilderElementFormProps } from '../../ADT3DSceneBuilder.types';
import {
    IScene,
    ITwinToObjectMapping
} from '../../../../../Models/Classes/3DVConfig';
import { SceneBuilderContext } from '../../ADT3DSceneBuilder';
import { ADT3DSceneBuilderMode } from '../../../../../Models/Constants/Enums';
import { createGUID } from '../../../../../Models/Services/Utils';
import useAdapter from '../../../../../Models/Hooks/useAdapter';
import { ColoredMeshItem } from '../../../../../Models/Classes/SceneView.types';
import SceneBuilderFormBreadcrumb from '../SceneBuilderFormBreadcrumb';
import { AdapterMethodParamsForSearchADTTwins } from '../../../../../Models/Constants/Types';
import { Utils } from '../../../../../Models/Services';

const SceneElementForm: React.FC<IADT3DSceneBuilderElementFormProps> = ({
    builderMode,
    selectedElement,
    onElementSave,
    onElementBackClick
}) => {
    const { t } = useTranslation();
    const [isObjectsExpanded, setIsObjectsExpanded] = useState(
        selectedElement ? false : true
    );
    const [elementToEdit, setElementToEdit] = useState<ITwinToObjectMapping>(
        selectedElement ?? {
            id: '',
            displayName: '',
            primaryTwinID: '',
            meshIDs: []
        }
    );
    const [twinIdSearchTerm, setTwinIdSearchTerm] = useState(
        selectedElement?.primaryTwinID ?? ''
    );
    const [twinSuggestions, setTwinSuggestions] = useState(
        selectedElement?.primaryTwinID
            ? [
                  {
                      value: selectedElement?.primaryTwinID,
                      label: selectedElement?.primaryTwinID
                  }
              ]
            : []
    );
    const [selectedTwinId, setSelectedTwinId] = useState(
        selectedElement?.primaryTwinID
    );
    const {
        adapter,
        config,
        sceneId,
        getConfig,
        selectedMeshIds,
        setSelectedMeshIds,
        setColoredMeshItems
    } = useContext(SceneBuilderContext);
    const shouldAppendTwinSuggestions = useRef(false);
    const twinSearchContinuationToken = useRef(null);
    const lastScrollTopRef = useRef(0);
    const twinSuggestionListRef = createRef();

    const updateTwinToObjectMappings = useAdapter({
        adapterMethod: (params: { elements: Array<ITwinToObjectMapping> }) => {
            const sceneToUpdate: IScene = {
                ...config.viewerConfiguration.scenes[
                    config.viewerConfiguration.scenes.findIndex(
                        (s) => s.id === sceneId
                    )
                ]
            };
            sceneToUpdate.twinToObjectMappings = params.elements;
            return adapter.editScene(config, sceneId, sceneToUpdate);
        },
        refetchDependencies: [adapter],
        isAdapterCalledOnMount: false
    });

    const searchTwinAdapterData = useAdapter({
        adapterMethod: (params: AdapterMethodParamsForSearchADTTwins) =>
            adapter.searchADTTwins(params),
        refetchDependencies: [],
        isAdapterCalledOnMount: false
    });

    const handleSaveElement = () => {
        const existingElements = config.viewerConfiguration?.scenes?.find(
            (s) => s.id === sceneId
        ).twinToObjectMappings;
        const newElements = existingElements ? [...existingElements] : [];
        if (builderMode === ADT3DSceneBuilderMode.CreateElement) {
            let newId = createGUID(false);
            const existingIds = existingElements?.map((e) => e.id);
            while (existingIds?.includes(newId)) {
                newId = createGUID(false);
            }
            const newElement = { ...elementToEdit, id: newId };
            newElements.push(newElement);
        } else {
            newElements[
                existingElements.findIndex((e) => e.id === selectedElement.id)
            ] = elementToEdit;
        }

        updateTwinToObjectMappings.callAdapter({
            elements: newElements
        });

        onElementSave(newElements);
    };

    const updateColoredMeshItems = (meshName?: string) => {
        const coloredMeshes: ColoredMeshItem[] = [];
        for (const meshId of elementToEdit.meshIDs) {
            if (meshName && meshId === meshName) {
                coloredMeshes.push({ meshId: meshId, color: '#00EDD9' });
            } else {
                coloredMeshes.push({ meshId: meshId, color: '#00A8F0' });
            }
        }

        setColoredMeshItems(coloredMeshes);
    };

    useEffect(() => {
        setElementToEdit({
            ...elementToEdit,
            meshIDs: selectedMeshIds
        });
    }, [selectedMeshIds]);

    useEffect(() => {
        if (updateTwinToObjectMappings.adapterResult.result) {
            getConfig();
        }
    }, [updateTwinToObjectMappings?.adapterResult]);

    useEffect(() => {
        if (!searchTwinAdapterData.adapterResult.hasNoData()) {
            if (shouldAppendTwinSuggestions.current) {
                setTwinSuggestions(
                    twinSuggestions.concat(
                        searchTwinAdapterData.adapterResult.result?.data?.value.map(
                            (t) => ({
                                value: t.$dtId,
                                label: t.$dtId
                            })
                        )
                    )
                );
            } else {
                setTwinSuggestions(
                    searchTwinAdapterData.adapterResult.result?.data?.value.map(
                        (t) => ({
                            value: t.$dtId,
                            label: t.$dtId
                        })
                    )
                );
            }

            twinSearchContinuationToken.current =
                searchTwinAdapterData.adapterResult.result?.data?.continuationToken;
        }
    }, [searchTwinAdapterData.adapterResult.getData()]);

    useEffect(() => {
        if (!elementToEdit.displayName) {
            setElementToEdit({
                ...elementToEdit,
                primaryTwinID: selectedTwinId,
                displayName: selectedTwinId
            });
        } else {
            setElementToEdit({
                ...elementToEdit,
                primaryTwinID: selectedTwinId
            });
        }
    }, [selectedTwinId]);

    useEffect(() => {
        if (lastScrollTopRef.current && !searchTwinAdapterData.isLoading) {
            debugger;
            (twinSuggestionListRef.current as HTMLDivElement).scrollTop =
                lastScrollTopRef.current;
            lastScrollTopRef.current = 0;
        }
    }, [twinSuggestionListRef]);

    const handleOnScroll = (event: Event) => {
        const divElement = event.currentTarget as HTMLDivElement;
        if (
            divElement.scrollHeight - divElement.scrollTop <=
            divElement.clientHeight + 40
        ) {
            if (twinSearchContinuationToken.current) {
                lastScrollTopRef.current = divElement.scrollTop;
                shouldAppendTwinSuggestions.current = true;
                searchTwinAdapterData.callAdapter({
                    searchTerm: twinIdSearchTerm,
                    shouldSearchByModel: false,
                    continuationToken: twinSearchContinuationToken.current
                } as AdapterMethodParamsForSearchADTTwins);
            }
        }
    };

    const CustomOption = (props) => {
        return (
            <div
                {...props.innerProps}
                className={`cb-search-autocomplete__option ${
                    props.isSelected ? 'cb-selected' : ''
                } ${props.isFocused ? 'cb-focused' : ''}`}
            >
                {Utils.getMarkedHtmlBySearch(
                    props.data.label,
                    twinIdSearchTerm,
                    true
                )}
            </div>
        );
    };

    const CustomMenuList = (props) => {
        return (
            <div
                ref={twinSuggestionListRef}
                {...props.innerProps}
                className={'cb-search-autocomplete__menu-list'}
                onScroll={handleOnScroll}
            >
                {props.children}
            </div>
        );
    };

    return (
        <div className="cb-scene-builder-left-panel-create-wrapper">
            <SceneBuilderFormBreadcrumb
                items={[
                    {
                        text: t('3dSceneBuilder.elements'),
                        key: 'elements',
                        onClick: () => onElementBackClick()
                    },
                    {
                        text:
                            builderMode === ADT3DSceneBuilderMode.EditElement
                                ? selectedElement.displayName
                                : t('3dSceneBuilder.newElement'),
                        key: 'elementForm'
                    }
                ]}
            />
            <div className="cb-scene-builder-left-panel-create-form">
                <div className="cb-scene-builder-left-panel-create-form-contents">
                    <div>
                        <Label className="cb-required-icon">
                            {t('3dSceneBuilder.linkedTwin')}
                        </Label>
                        <Select
                            isSearchable
                            isClearable
                            classNamePrefix="cb-search-autocomplete"
                            className="cb-search-autocomplete-container"
                            onInputChange={(inputValue, actionMeta) => {
                                if (actionMeta.action === 'input-change') {
                                    setTwinIdSearchTerm(inputValue);
                                    searchTwinAdapterData.cancelAdapter();
                                    if (inputValue) {
                                        shouldAppendTwinSuggestions.current = false;
                                        twinSearchContinuationToken.current = null;
                                        searchTwinAdapterData.callAdapter({
                                            searchTerm: inputValue,
                                            shouldSearchByModel: false,
                                            continuationToken:
                                                twinSearchContinuationToken.current
                                        } as AdapterMethodParamsForSearchADTTwins);
                                    } else {
                                        setSelectedTwinId(undefined);
                                        setTwinSuggestions([]);
                                    }
                                } else if (actionMeta.action === 'menu-close') {
                                    setTwinIdSearchTerm(selectedTwinId ?? '');
                                }
                            }}
                            defaultValue={twinSuggestions[0] ?? undefined}
                            options={twinSuggestions}
                            inputValue={twinIdSearchTerm}
                            components={{
                                Option: CustomOption,
                                MenuList: CustomMenuList
                            }}
                            onChange={(option) => {
                                if (!option) {
                                    setTwinSuggestions([]);
                                }
                                setTwinIdSearchTerm(option?.value ?? '');
                                setSelectedTwinId(option?.value ?? undefined);
                            }}
                            isLoading={searchTwinAdapterData.isLoading}
                            placeholder={t('3dSceneBuilder.searchTwinId')}
                        />
                        <Text
                            className="cb-search-autocomplete-desc"
                            variant={'xSmall'}
                        >
                            {t('3dSceneBuilder.linkedTwinInputInfo')}
                        </Text>
                    </div>
                    <TextField
                        label={t('name')}
                        value={elementToEdit?.displayName}
                        required
                        onChange={(e) => {
                            setElementToEdit({
                                ...elementToEdit,
                                displayName: e.currentTarget.value
                            });
                        }}
                    />
                </div>
                <div className="cb-scene-builder-left-panel-element-objects">
                    <div
                        className="cb-scene-builder-left-panel-element-objects-header"
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
                        <span>
                            {t('3dSceneBuilder.meshes')} (
                            {elementToEdit.meshIDs.length})
                        </span>
                    </div>
                    {isObjectsExpanded && (
                        <div className="cb-scene-builder-left-panel-element-objects-container">
                            {elementToEdit.meshIDs.length === 0 ? (
                                <div className="cb-scene-builder-left-panel-text">
                                    {t('3dSceneBuilder.noMeshAddedText')}
                                </div>
                            ) : (
                                <ul className="cb-scene-builder-left-panel-element-object-list">
                                    {elementToEdit.meshIDs.map((meshName) => (
                                        <li
                                            key={meshName}
                                            className="cb-scene-builder-left-panel-element-object"
                                            onMouseEnter={() =>
                                                updateColoredMeshItems(meshName)
                                            }
                                            onMouseLeave={() =>
                                                updateColoredMeshItems()
                                            }
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
                                                className="cb-remove-object-button"
                                                iconProps={{
                                                    iconName: 'Delete'
                                                }}
                                                title={t('remove')}
                                                ariaLabel={t('remove')}
                                                onClick={() => {
                                                    const currentObjects = [
                                                        ...elementToEdit.meshIDs
                                                    ];
                                                    currentObjects.splice(
                                                        currentObjects.indexOf(
                                                            meshName
                                                        ),
                                                        1
                                                    );
                                                    setSelectedMeshIds(
                                                        currentObjects
                                                    );
                                                }}
                                            />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="cb-scene-builder-left-panel-create-form-actions">
                <PrimaryButton
                    onClick={handleSaveElement}
                    text={
                        builderMode === ADT3DSceneBuilderMode.CreateElement
                            ? t('3dSceneBuilder.createElement')
                            : t('3dSceneBuilder.updateElement')
                    }
                    disabled={
                        !(
                            elementToEdit?.displayName &&
                            elementToEdit?.primaryTwinID &&
                            elementToEdit?.meshIDs?.length > 0
                        )
                    }
                />
                <DefaultButton
                    text={t('cancel')}
                    styles={{ root: { marginLeft: 8 } }}
                    onClick={() => {
                        onElementBackClick();
                    }}
                />
            </div>
        </div>
    );
};

export default SceneElementForm;
