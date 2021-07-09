import React, { useState } from 'react';
import I18nProviderWrapper from '../../Models/Classes/I18NProviderWrapper';
import i18n from '../../i18n';
import { useTranslation } from 'react-i18next';
import { Locale } from '../../Models/Constants';
import { Text } from '@fluentui/react/lib/Text';
import { Panel, PanelType } from '@fluentui/react/lib/Panel';
import { TextField } from '@fluentui/react/lib/TextField';
import { Breadcrumb, IBreadcrumbItem } from '@fluentui/react/lib/Breadcrumb';
import CreateRelationshipForm from './Forms/CreateRelationshipForm';
import CreateComponentForm from './Forms/CreateComponentForm';
import CreatePropertyForm from './Forms/CreatePropertyForm';
import ElementsList from './ElementsList';
import {
    DTDLComponent,
    DTDLModel,
    DTDLProperty,
    DTDLRelationship
} from '../../Models/Classes/DTDL';
import { AuthoringMode } from '../../Models/Constants/Enums';
import FormSection from '../FormSection/FormSection';
import BaseForm from '../ModelCreate/Forms/BaseForm';
import './ModelCreate.scss';

enum ModelCreateMode {
    ModelForm,
    PropertyForm,
    RelationshipForm,
    ComponentForm,
    EnumForm
}

interface ModelCreateProps {
    locale: Locale;
    existingModelIds: string[];
    modelToEdit?: DTDLModel;
    onPrimaryAction: (model: DTDLModel) => void;
    onCancel: () => void;
}

class ElementToEditInfo {
    element: DTDLProperty | DTDLRelationship | DTDLComponent;
    index: number;

    constructor() {
        this.element = null;
        this.index = -1;
    }
}

const ModelCreate: React.FC<ModelCreateProps> = ({
    locale,
    existingModelIds,
    modelToEdit = null,
    onPrimaryAction,
    onCancel
}) => {
    const { t } = useTranslation();

    const [mode, setMode] = useState(ModelCreateMode.ModelForm);
    const [authoringMode, setAuthoringMode] = useState(AuthoringMode.Add);
    const [breadcrumbs, setBreadcrumbs] = useState<IBreadcrumbItem[]>([]);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const initialModel = modelToEdit ?? DTDLModel.getBlank();
    const [modelId, setModelId] = useState(initialModel['@id']);
    const [displayName, setDisplayName] = useState(initialModel.displayName);
    const [description, setDescription] = useState(initialModel.description);
    const [comment, setComment] = useState(initialModel.comment);
    const [properties, setProperties] = useState(initialModel.properties);
    const [relationships, setRelationships] = useState(
        initialModel.relationships
    );
    const [components, setComponents] = useState(initialModel.components);
    const [elementToEdit, setElementToEdit] = useState(new ElementToEditInfo());
    // Currently extends and schemas are not supported.

    const handleCreateModel = () => {
        const model = new DTDLModel(
            modelId,
            displayName,
            description,
            comment,
            properties,
            relationships,
            components
        );
        onPrimaryAction(model);
    };

    const pushBreadcrumb = (breadcrumbKey: string) => {
        setBreadcrumbs((currentBreadcrumbs) => {
            const key = `${t('modelCreate.breadcrumb')}${
                currentBreadcrumbs.length + 1
            }`;
            return [...currentBreadcrumbs, { text: t(breadcrumbKey), key }];
        });
    };

    const popBreadcrumb = () => {
        setBreadcrumbs((currentBreadcrumbs) => {
            return currentBreadcrumbs.slice(0, -1);
        });
    };

    const handleClickAddProperty = () => {
        setAuthoringMode(AuthoringMode.Add);
        setElementToEdit(new ElementToEditInfo());
        addStep(ModelCreateMode.PropertyForm, 'modelCreate.addProperty');
    };

    const handleClickAddRelationship = () => {
        setAuthoringMode(AuthoringMode.Add);
        setElementToEdit(new ElementToEditInfo());
        addStep(
            ModelCreateMode.RelationshipForm,
            'modelCreate.addRelationship'
        );
    };

    const handleClickAddComponent = () => {
        setAuthoringMode(AuthoringMode.Add);
        setElementToEdit(new ElementToEditInfo());
        addStep(ModelCreateMode.ComponentForm, 'modelCreate.addComponent');
    };

    const addStep = (mode: ModelCreateMode, breadcrumbKey: string) => {
        setMode(mode);
        pushBreadcrumb(breadcrumbKey);
        setIsPanelOpen(true);
    };

    const backToModelForm = () => {
        setMode(ModelCreateMode.ModelForm);
        setIsPanelOpen(false);
        setBreadcrumbs([]);
    };

    const handleListFormAction = (element, setter) => {
        if (authoringMode === AuthoringMode.Add) {
            setter((currentElements) => {
                return [...currentElements, element];
            });
        } else {
            setter((currentElements) => {
                const updatedList = [...currentElements];
                updatedList[elementToEdit.index] = element;
                return updatedList;
            });
        }
        backToModelForm();
    };

    const handleSelectProperty = (property, index: number) => {
        setAuthoringMode(AuthoringMode.Edit);
        setElementToEdit({ element: property, index });
        addStep(ModelCreateMode.PropertyForm, 'modelCreate.editProperty');
    };

    const handleSelectRelationship = (relationship, index: number) => {
        setAuthoringMode(AuthoringMode.Edit);
        setElementToEdit({ element: relationship, index });
        addStep(
            ModelCreateMode.RelationshipForm,
            'modelCreate.editRelationship'
        );
    };

    const handleSelectComponent = (component, index: number) => {
        setAuthoringMode(AuthoringMode.Edit);
        setElementToEdit({ element: component, index });
        addStep(ModelCreateMode.ComponentForm, 'modelCreate.editComponent');
    };

    const deleteEntity = (index: number, setter) => {
        setter((currentEntities) => {
            const copy = [...currentEntities];
            copy.splice(index, 1);
            return copy;
        });
    };

    const handleDeleteProperty = (index: number) => {
        deleteEntity(index, setProperties);
    };

    const handleDeleteRelationship = (index: number) => {
        deleteEntity(index, setRelationships);
    };

    const handleDeleteComponent = (index: number) => {
        deleteEntity(index, setComponents);
    };

    return (
        <div className="cb-modelcreate-container">
            <I18nProviderWrapper locale={locale} i18n={i18n}>
                <>
                    <Text variant="large" className="cb-modelcreate-title">
                        {t('modelCreate.newModel')}
                    </Text>
                    <BaseForm
                        primaryActionLabel={t('modelCreate.create')}
                        cancelLabel={t('modelCreate.cancel')}
                        onPrimaryAction={handleCreateModel}
                        onCancel={onCancel}
                    >
                        <FormSection title={t('modelCreate.summary')}>
                            <TextField
                                label={t('modelCreate.modelId')}
                                prefix="dtmi;"
                                suffix=";1"
                                placeholder="com:example:model1"
                                value={modelId}
                                onChange={(e) =>
                                    setModelId(e.currentTarget.value)
                                }
                                required
                            />
                            <TextField
                                label={t('modelCreate.displayName')}
                                value={displayName}
                                onChange={(e) =>
                                    setDisplayName(e.currentTarget.value)
                                }
                            />
                            <TextField
                                label={t('modelCreate.description')}
                                multiline
                                rows={3}
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.currentTarget.value)
                                }
                            />
                            <TextField
                                label={t('modelCreate.comment')}
                                multiline
                                rows={3}
                                value={comment}
                                onChange={(e) =>
                                    setComment(e.currentTarget.value)
                                }
                            />
                        </FormSection>
                        <FormSection title={t('modelCreate.properties')}>
                            <ElementsList
                                t={t}
                                noElementLabelKey="modelCreate.noProperties"
                                addElementLabelKey="modelCreate.addProperty"
                                elements={properties}
                                handleEditElement={handleSelectProperty}
                                handleNewElement={handleClickAddProperty}
                                handleDeleteElement={handleDeleteProperty}
                            />
                        </FormSection>
                        <FormSection title={t('modelCreate.relationships')}>
                            <ElementsList
                                t={t}
                                noElementLabelKey="modelCreate.noRelationships"
                                addElementLabelKey="modelCreate.addRelationship"
                                elements={relationships}
                                handleEditElement={handleSelectRelationship}
                                handleNewElement={handleClickAddRelationship}
                                handleDeleteElement={handleDeleteRelationship}
                            />
                        </FormSection>
                        <FormSection title={t('modelCreate.components')}>
                            <ElementsList
                                t={t}
                                noElementLabelKey="modelCreate.noComponents"
                                addElementLabelKey="modelCreate.addComponent"
                                elements={components}
                                handleEditElement={handleSelectComponent}
                                handleNewElement={handleClickAddComponent}
                                handleDeleteElement={handleDeleteComponent}
                            />
                        </FormSection>
                    </BaseForm>
                </>

                <Panel
                    isOpen={isPanelOpen}
                    onDismiss={backToModelForm}
                    type={PanelType.medium}
                    isLightDismiss
                    styles={{
                        scrollableContent: {
                            display: 'flex',
                            flexGrow: 1
                        },
                        content: {
                            display: 'flex',
                            flexGrow: 1,
                            paddingBottom: 0
                        },
                        contentInner: {
                            display: 'flex'
                        }
                    }}
                    closeButtonAriaLabel={t('modelCreate.cancel')}
                >
                    <div className="cb-form-breadcrumbs">
                        <Breadcrumb
                            items={breadcrumbs}
                            maxDisplayedItems={3}
                            ariaLabel={t('modelCreate.breadcrumbs')}
                            overflowAriaLabel={t('modelCreate.moreSteps')}
                            className="cb-modelcreate-breadcrumb"
                            styles={{ item: { paddingLeft: 0 } }}
                        />
                    </div>
                    {mode === ModelCreateMode.PropertyForm && (
                        <CreatePropertyForm
                            t={t}
                            pushBreadcrumb={pushBreadcrumb}
                            popBreadcrumb={popBreadcrumb}
                            onCancel={backToModelForm}
                            onPrimaryAction={(property) =>
                                handleListFormAction(property, setProperties)
                            }
                            propertyToEdit={
                                elementToEdit.element as DTDLProperty
                            }
                        />
                    )}

                    {mode === ModelCreateMode.RelationshipForm && (
                        <CreateRelationshipForm
                            t={t}
                            pushBreadcrumb={pushBreadcrumb}
                            popBreadcrumb={popBreadcrumb}
                            existingModelIds={existingModelIds}
                            onCancel={backToModelForm}
                            onPrimaryAction={(relationship) =>
                                handleListFormAction(
                                    relationship,
                                    setRelationships
                                )
                            }
                            relationshipToEdit={
                                elementToEdit.element as DTDLRelationship
                            }
                        />
                    )}

                    {mode === ModelCreateMode.ComponentForm && (
                        <CreateComponentForm
                            t={t}
                            existingModelIds={existingModelIds}
                            onCancel={backToModelForm}
                            onPrimaryAction={(component) =>
                                handleListFormAction(component, setComponents)
                            }
                            componentToEdit={
                                elementToEdit.element as DTDLComponent
                            }
                        />
                    )}
                </Panel>
            </I18nProviderWrapper>
        </div>
    );
};

export default ModelCreate;
