import React, { forwardRef, useImperativeHandle, useState } from 'react';
import I18nProviderWrapper from '../../Models/Classes/I18NProviderWrapper';
import i18n from '../../i18n';
import { useTranslation } from 'react-i18next';
import { DTMIRegex, Locale } from '../../Models/Constants';
import {
    Text,
    TextField,
    Panel,
    PanelType,
    Breadcrumb,
    IBreadcrumbItem
} from '@fluentui/react';
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
import { DefaultButton } from '@fluentui/react';
import JsonPreview from '../JsonPreview/JsonPreview';

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
    onPrimaryAction?: (model: DTDLModel) => void;
    onCancel: () => void;
    formControlMode?: FormMode;
    isPrimaryActionButtonsVisible?: boolean;
    isShowDTDLButtonVisible?: boolean;
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
        formControlMode,
        isPrimaryActionButtonsVisible = true,
        isShowDTDLButtonVisible = true
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
    const [isModelPreviewOpen, setIsModelPreviewOpen] = useState(false);
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
        if (onPrimaryAction && typeof onPrimaryAction === 'function') {
            onPrimaryAction(model);
        }
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
        if (elementToEdit?.element) {
            setter((currentElements) => {
                const updatedList = [...currentElements];
                updatedList[elementToEdit.index] = element;
                return updatedList;
            });
        } else {
            setter((currentElements) => {
                return [...currentElements, element];
            });
        }
        backToModelForm();
    };

    const handleSelectProperty = (
        property,
        index: number,
        formControlMode: FormMode = FormMode.Edit
    ) => {
        setFormMode(formControlMode);
        setElementToEdit({ element: property, index });
        addStep(
            ModelCreateMode.PropertyForm,
            formControlMode === FormMode.Readonly
                ? 'modelCreate.propertyDetails'
                : 'modelCreate.editProperty'
        );
    };

    const handleSelectRelationship = (
        relationship,
        index: number,
        formControlMode: FormMode = FormMode.Edit
    ) => {
        setFormMode(formControlMode);
        setElementToEdit({ element: relationship, index });
        addStep(
            ModelCreateMode.RelationshipForm,
            formControlMode === FormMode.Readonly
                ? 'modelCreate.relationshipDetails'
                : 'modelCreate.editRelationship'
        );
    };

    const handleSelectComponent = (
        component,
        index: number,
        formControlMode: FormMode = FormMode.Edit
    ) => {
        setFormMode(formControlMode);
        setElementToEdit({ element: component, index });
        addStep(
            ModelCreateMode.ComponentForm,
            formControlMode === FormMode.Readonly
                ? 'modelCreate.componentDetails'
                : 'modelCreate.editComponent'
        );
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
                    <div className="cb-modelcreate-header">
                        <Text variant="large" className="cb-modelcreate-title">
                            {formMode === FormMode.Readonly
                                ? t('modelCreate.modelDetails')
                                : formMode === FormMode.Edit
                                ? t('modelCreate.editModel')
                                : t('modelCreate.newModel')}
                        </Text>
                        {isShowDTDLButtonVisible && (
                            <DefaultButton
                                onClick={() => setIsModelPreviewOpen(true)}
                            >
                                {`${t('view')} DTDL`}
                            </DefaultButton>
                        )}
                    </div>

                    <BaseForm
                        primaryActionLabel={
                            formMode === FormMode.Edit
                                ? t('update')
                                : t('create')
                        }
                        cancelLabel={
                            formMode === FormMode.Readonly
                                ? t('close')
                                : t('cancel')
                        }
                        onPrimaryAction={handleCreateModel}
                        onCancel={onCancel}
                        formControlMode={formMode}
                        isActionButtonsVisible={isPrimaryActionButtonsVisible}
                    >
                        <FormSection title={t('modelCreate.summary')}>
                            <TextField
                                label={t('modelCreate.modelId')}
                                placeholder="<scheme>:<path>;<version>"
                                description={'e.g., dtmi:com:example:model1;1'}
                                value={modelId}
                                onChange={(e) =>
                                    setModelId(e.currentTarget.value)
                                }
                                required
                                className={
                                    formMode === FormMode.Readonly
                                        ? 'cb-modelcreate-readonly'
                                        : ''
                                }
                                disabled={formMode === FormMode.Readonly}
                                validateOnLoad={false}
                                validateOnFocusOut
                                onGetErrorMessage={(value) =>
                                    !DTMIRegex.test(value)
                                        ? t('modelCreate.invalidIdentifier', {
                                              dtmiLink:
                                                  'http://aka.ms/ADTv2Models'
                                          })
                                        : ''
                                }
                            />
                            <TextField
                                label={t('displayName')}
                                title={displayName}
                                value={
                                    formMode === FormMode.Readonly &&
                                    !displayName
                                        ? '(' + t('noInformation') + ')'
                                        : displayName
                                }
                                className={`${
                                    formMode === FormMode.Readonly
                                        ? 'cb-modelcreate-readonly'
                                        : ''
                                } ${
                                    formMode === FormMode.Readonly &&
                                    !displayName
                                        ? 'cb-noinformation-value'
                                        : ''
                                }`}
                                onChange={(e) =>
                                    setDisplayName(e.currentTarget.value)
                                }
                                disabled={formMode === FormMode.Readonly}
                            />
                            <TextField
                                label={t('modelCreate.description')}
                                multiline={formMode !== FormMode.Readonly}
                                rows={3}
                                title={description}
                                value={
                                    formMode === FormMode.Readonly &&
                                    !description
                                        ? '(' + t('noInformation') + ')'
                                        : description
                                }
                                className={`${
                                    formMode === FormMode.Readonly
                                        ? 'cb-modelcreate-readonly'
                                        : ''
                                } ${
                                    formMode === FormMode.Readonly &&
                                    !description
                                        ? 'cb-noinformation-value'
                                        : ''
                                }`}
                                onChange={(e) =>
                                    setDescription(e.currentTarget.value)
                                }
                                disabled={formMode === FormMode.Readonly}
                            />
                            <TextField
                                label={t('modelCreate.comment')}
                                multiline={formMode !== FormMode.Readonly}
                                rows={3}
                                title={comment}
                                value={
                                    formMode === FormMode.Readonly && !comment
                                        ? '(' + t('noInformation') + ')'
                                        : comment
                                }
                                className={`${
                                    formMode === FormMode.Readonly
                                        ? 'cb-modelcreate-readonly'
                                        : ''
                                } ${
                                    formMode === FormMode.Readonly && !comment
                                        ? 'cb-noinformation-value'
                                        : ''
                                }`}
                                onChange={(e) =>
                                    setComment(e.currentTarget.value)
                                }
                                disabled={formMode === FormMode.Readonly}
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
                            formControlMode={formMode}
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
                            formControlMode={formMode}
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
                            formControlMode={formMode}
                        />
                    )}
                </Panel>
                <JsonPreview
                    json={
                        new DTDLModel(
                            modelId,
                            displayName,
                            description,
                            comment,
                            properties,
                            relationships,
                            components
                        )
                    }
                    isOpen={isModelPreviewOpen}
                    onDismiss={() => setIsModelPreviewOpen(false)}
                    modalTitle={displayName || modelId}
                />
            </I18nProviderWrapper>
        </div>
    );
}

export default forwardRef(ModelCreate);
