import React, { forwardRef, useImperativeHandle, useState } from 'react';
import I18nProviderWrapper from '../../Models/Classes/I18NProviderWrapper';
import i18n from '../../i18n';
import { useTranslation } from 'react-i18next';
import { DTMIRegex, Locale } from '../../Models/Constants';
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
import { FormMode } from '../../Models/Constants/Enums';
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
    formControlMode?: FormMode;
}

class ElementToEditInfo {
    element: DTDLProperty | DTDLRelationship | DTDLComponent;
    index: number;

    constructor() {
        this.element = null;
        this.index = -1;
    }
}

function ModelCreate(props: ModelCreateProps, ref) {
    const {
        locale,
        existingModelIds,
        modelToEdit = null,
        onPrimaryAction,
        onCancel,
        formControlMode
    } = props;

    const { t } = useTranslation();

    const [mode, setMode] = useState(ModelCreateMode.ModelForm);
    const [formMode, setFormMode] = useState(
        formControlMode
            ? formControlMode
            : modelToEdit
            ? FormMode.Edit
            : FormMode.New
    );
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

    useImperativeHandle(ref, () => ({
        getModel: () => {
            return new DTDLModel(
                modelId,
                displayName,
                description,
                comment,
                properties,
                relationships,
                components
            );
        }
    }));

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
        setFormMode(FormMode.New);
        setElementToEdit(new ElementToEditInfo());
        addStep(ModelCreateMode.PropertyForm, 'modelCreate.addProperty');
    };

    const handleClickAddRelationship = () => {
        setFormMode(FormMode.New);
        setElementToEdit(new ElementToEditInfo());
        addStep(
            ModelCreateMode.RelationshipForm,
            'modelCreate.addRelationship'
        );
    };

    const handleClickAddComponent = () => {
        setFormMode(FormMode.New);
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
        if (formMode === FormMode.New) {
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
        setFormMode(FormMode.Edit);
        setElementToEdit({ element: property, index });
        addStep(ModelCreateMode.PropertyForm, 'modelCreate.editProperty');
    };

    const handleSelectRelationship = (relationship, index: number) => {
        setFormMode(FormMode.Edit);
        setElementToEdit({ element: relationship, index });
        addStep(
            ModelCreateMode.RelationshipForm,
            'modelCreate.editRelationship'
        );
    };

    const handleSelectComponent = (component, index: number) => {
        setFormMode(FormMode.Edit);
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
                        {formMode === FormMode.Readonly
                            ? t('modelCreate.modelDetails')
                            : formMode === FormMode.Edit
                            ? t('modelCreate.editModel')
                            : t('modelCreate.newModel')}
                    </Text>
                    <BaseForm
                        primaryActionLabel={
                            formMode === FormMode.Edit
                                ? t('update')
                                : t('create')
                        }
                        cancelLabel={t('cancel')}
                        onPrimaryAction={handleCreateModel}
                        onCancel={onCancel}
                        formControlMode={formMode}
                    >
                        <FormSection title={t('modelCreate.summary')}>
                            <TextField
                                label={t('modelCreate.modelId')}
                                placeholder="<scheme>:<path>;<version>"
                                description={
                                    formMode !== FormMode.Readonly
                                        ? 'e.g., dtmi:com:example:model1;1'
                                        : ''
                                }
                                value={modelId}
                                onChange={(e) =>
                                    setModelId(e.currentTarget.value)
                                }
                                required
                                readOnly={formMode === FormMode.Readonly}
                                errorMessage={
                                    modelId && !DTMIRegex.test(modelId)
                                        ? t('modelCreate.invalidIdentifier', {
                                              dtmiLink:
                                                  'http://aka.ms/ADTv2Models'
                                          })
                                        : ''
                                }
                            />
                            <TextField
                                label={t('modelCreate.displayName')}
                                value={displayName}
                                onChange={(e) =>
                                    setDisplayName(e.currentTarget.value)
                                }
                                readOnly={formMode === FormMode.Readonly}
                            />
                            <TextField
                                label={t('modelCreate.description')}
                                multiline
                                rows={3}
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.currentTarget.value)
                                }
                                readOnly={formMode === FormMode.Readonly}
                            />
                            <TextField
                                label={t('modelCreate.comment')}
                                multiline
                                rows={3}
                                value={comment}
                                onChange={(e) =>
                                    setComment(e.currentTarget.value)
                                }
                                readOnly={formMode === FormMode.Readonly}
                            />
                        </FormSection>
                        <FormSection title={t('modelCreate.properties')}>
                            <ElementsList
                                noElementLabelKey="modelCreate.noProperties"
                                addElementLabelKey="modelCreate.addProperty"
                                elements={properties}
                                handleEditElement={handleSelectProperty}
                                handleNewElement={handleClickAddProperty}
                                handleDeleteElement={handleDeleteProperty}
                                formControlMode={formMode}
                            />
                        </FormSection>
                        <FormSection title={t('modelCreate.relationships')}>
                            <ElementsList
                                noElementLabelKey="modelCreate.noRelationships"
                                addElementLabelKey="modelCreate.addRelationship"
                                elements={relationships}
                                handleEditElement={handleSelectRelationship}
                                handleNewElement={handleClickAddRelationship}
                                handleDeleteElement={handleDeleteRelationship}
                                formControlMode={formMode}
                            />
                        </FormSection>
                        <FormSection title={t('modelCreate.components')}>
                            <ElementsList
                                noElementLabelKey="modelCreate.noComponents"
                                addElementLabelKey="modelCreate.addComponent"
                                elements={components}
                                handleEditElement={handleSelectComponent}
                                handleNewElement={handleClickAddComponent}
                                handleDeleteElement={handleDeleteComponent}
                                formControlMode={formMode}
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
                    closeButtonAriaLabel={t('cancel')}
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
}

export default forwardRef(ModelCreate);
