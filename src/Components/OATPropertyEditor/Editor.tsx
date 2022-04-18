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
import PropertyList from './PropertyList';
import JSONEditor from './JSONEditor';
import TemplateColumn from './TemplateColumn';
import PropertiesModelSummary from './PropertiesModelSummary';

interface IEditor {
    model?: any;
    setModel?: any;
    templates?: any;
    setTemplates?: any;
    theme?: any;
    setModalBody?: any;
    setModalOpen?: any;
    setCurrentNestedPropertyIndex?: any;
    setCurrentPropertyIndex?: any;
    currentPropertyIndex?: number;
}

const Editor = ({
    model,
    setModel,
    templates,
    setTemplates,
    theme,
    setModalBody,
    setModalOpen,
    setCurrentNestedPropertyIndex,
    setCurrentPropertyIndex,
    currentPropertyIndex
}: IEditor) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();

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

    return (
        <Stack className={propertyInspectorStyles.container}>
            <Pivot className={propertyInspectorStyles.pivot}>
                <PivotItem
                    headerText={t('OATPropertyEditor.properties')}
                    className={propertyInspectorStyles.pivotItem}
                >
                    <PropertiesModelSummary model={model} setModel={setModel} />
                    <Stack>
                        <Stack className={propertyInspectorStyles.paddingWrap}>
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
                                        {t('OATPropertyEditor.viewTemplates')}
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
                                <Text>{t('OATPropertyEditor.schemaType')}</Text>
                            </Stack>
                        </Stack>
                    </Stack>

                    <PropertyList
                        propertySelectorVisible={propertySelectorVisible}
                        setPropertySelectorVisible={setPropertySelectorVisible}
                        model={model}
                        setModel={setModel}
                        setCurrentPropertyIndex={setCurrentPropertyIndex}
                        setModalOpen={setModalOpen}
                        currentPropertyIndex={currentPropertyIndex}
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
                        setModalBody={setModalBody}
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
    );
};

export default Editor;
