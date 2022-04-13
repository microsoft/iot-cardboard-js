import React, { useState, useRef } from 'react';
import {
    FontIcon,
    Stack,
    Pivot,
    PivotItem,
    Label,
    Text,
    ActionButton
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import BaseComponent from '../BaseComponent/BaseComponent';
import PropertyList from './PropertyList';
import JSONEditor from './JSONEditor';
import TemplateColumn from './TemplateColumn';
import PropertiesModelSummary from './PropertiesModelSummary';
import Modal from './Modal';
import { Theme } from '../../Models/Constants/Enums';

type IOATPropertyEditor = {
    model?: any;
    setModel?: any;
    setModalOpen?: any;
    currentPropertyIndex?: number;
    setCurrentPropertyIndex?: any;
    theme?: Theme;
    templates?: any;
    setTemplates?: any;
};

const OATPropertyEditor = ({
    model,
    setModel,
    theme,
    templates,
    setTemplates
}: IOATPropertyEditor) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();

    const [modalOpen, setModalOpen] = useState(false);
    const [currentPropertyIndex, setCurrentPropertyIndex] = useState(null);
    const [
        currentNestedPropertyIndex,
        setCurrentNestedPropertyIndex
    ] = useState(null);
    const [propertySelectorVisible, setPropertySelectorVisible] = useState(
        false
    );
    const [templatesActive, setTemplatesActive] = useState(false);
    const [draggingTemplate, setDraggingTemplate] = useState(false);
    const [draggingProperty, setDraggingProperty] = useState(false);
    const draggedTemplateItemRef = useRef(null);
    const draggedPropertyItemRef = useRef(null);
    const enteredTemplateRef = useRef(null);
    const enteredPropertyRef = useRef(null);

    const handlePropertyNameChange = (value) => {
        model.contents[currentPropertyIndex].name = value;
    };

    const getErrorMessage = (value) => {
        const find = model.contents.find((item) => item.name === value);

        if (!find && value !== '') {
            handlePropertyNameChange(value);
        }

        return find
            ? `${t('OATPropertyEditor.errorRepeatedPropertyName')}`
            : '';
    };

    return (
        <BaseComponent theme={theme}>
            <Modal
                modalOpen={modalOpen}
                setModalOpen={setModalOpen}
                model={model}
                setModel={setModel}
                currentPropertyIndex={currentPropertyIndex}
                currentNestedPropertyIndex={currentNestedPropertyIndex}
                setCurrentNestedPropertyIndex={setCurrentNestedPropertyIndex}
            />
            <Stack className={propertyInspectorStyles.container}>
                <Pivot
                    className={propertyInspectorStyles.pivot}
                    aria-label={t('OATPropertyEditor.pivotLink')}
                    linkSize="large"
                >
                    <PivotItem
                        headerText={t('OATPropertyEditor.properties')}
                        className={propertyInspectorStyles.pivotItem}
                    >
                        <PropertiesModelSummary
                            model={model}
                            setModel={setModel}
                        />
                        <Stack>
                            <Stack
                                className={propertyInspectorStyles.paddingWrap}
                            >
                                <Stack
                                    className={
                                        propertyInspectorStyles.rowSpaceBetween
                                    }
                                >
                                    <Label>
                                        {t('OATPropertyEditor.properties')}
                                    </Label>
                                    <ActionButton
                                        onClick={() => setTemplatesActive(true)}
                                        className={
                                            propertyInspectorStyles.viewTemplatesCta
                                        }
                                    >
                                        <FontIcon
                                            className={
                                                propertyInspectorStyles.propertyHeadingIcon
                                            }
                                            iconName={'Library'}
                                        />
                                        <Text>
                                            {t(
                                                'OATPropertyEditor.viewTemplates'
                                            )}
                                        </Text>
                                    </ActionButton>
                                </Stack>
                            </Stack>
                            <Stack
                                className={
                                    propertyInspectorStyles.gridRowPropertyHeading
                                }
                            >
                                <Stack className={propertyInspectorStyles.row}>
                                    <FontIcon
                                        className={
                                            propertyInspectorStyles.propertyHeadingIcon
                                        }
                                        iconName={'SwitcherStartEnd'}
                                    />
                                    <Text>{t('OATPropertyEditor.name')}</Text>
                                </Stack>
                                <Stack className={propertyInspectorStyles.row}>
                                    <FontIcon
                                        className={
                                            propertyInspectorStyles.propertyHeadingIcon
                                        }
                                        iconName={'SwitcherStartEnd'}
                                    />
                                    <Text>
                                        {t('OATPropertyEditor.schemaType')}
                                    </Text>
                                </Stack>
                            </Stack>
                        </Stack>

                        <PropertyList
                            propertySelectorVisible={propertySelectorVisible}
                            setPropertySelectorVisible={
                                setPropertySelectorVisible
                            }
                            model={model}
                            setModel={setModel}
                            setCurrentPropertyIndex={setCurrentPropertyIndex}
                            setModalOpen={setModalOpen}
                            getErrorMessage={getErrorMessage}
                            setTemplates={setTemplates}
                            enteredPropertyRef={enteredPropertyRef}
                            draggingTemplate={draggingTemplate}
                            enteredTemplateRef={enteredTemplateRef}
                            draggedPropertyItemRef={draggedPropertyItemRef}
                            draggingProperty={draggingProperty}
                            setDraggingProperty={setDraggingProperty}
                            setCurrentNestedPropertyIndex={
                                setCurrentNestedPropertyIndex
                            }
                        />
                    </PivotItem>
                    <PivotItem
                        headerText={t('OATPropertyEditor.json')}
                        className={propertyInspectorStyles.pivotItem}
                    >
                        <JSONEditor
                            theme={theme}
                            model={model}
                            setModel={setModel}
                        />
                    </PivotItem>
                </Pivot>
                {templatesActive && (
                    <TemplateColumn
                        setTemplatesActive={setTemplatesActive}
                        templates={templates}
                        setTemplates={setTemplates}
                        draggedTemplateItemRef={draggedTemplateItemRef}
                        enteredPropertyRef={enteredPropertyRef}
                        model={model}
                        setModel={setModel}
                        draggingTemplate={draggingTemplate}
                        setDraggingTemplate={setDraggingTemplate}
                        draggingProperty={draggingProperty}
                        enteredTemplateRef={enteredTemplateRef}
                    />
                )}
            </Stack>
        </BaseComponent>
    );
};

export default OATPropertyEditor;

OATPropertyEditor.defaultProps = {
    setModalOpen: () => {
        console.log('no modal');
    }
};
