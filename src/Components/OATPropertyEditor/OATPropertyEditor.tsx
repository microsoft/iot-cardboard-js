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

const OATPropertyEditor = ({
    model,
    setModel,
    setModalOpen,
    currentPropertyIndex,
    setCurrentPropertyIndex,
    theme,
    templates,
    setTemplates
}) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const [propertySelectorVisible, setPropertySelectorVisible] = useState(
        false
    );
    const [templatesActive, setTemplatesActive] = useState(false);
    const [draggingTemplate, setDraggingTemplate] = useState(false);
    const [draggingProperty, setDraggingProperty] = useState(false);
    const draggedTemplateItem = useRef(null);
    const draggedPropertyItem = useRef(null);
    const enteredTemplate = useRef(null);
    const enteredProperty = useRef(null);

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
            <Stack className={propertyInspectorStyles.container}>
                <Pivot
                    className={propertyInspectorStyles.pivot}
                    aria-label="Large Link Size Pivot Example"
                    linkSize="large"
                >
                    <PivotItem headerText="Properties">
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
                            enteredProperty={enteredProperty}
                            draggingTemplate={draggingTemplate}
                            enteredTemplate={enteredTemplate}
                            draggedPropertyItem={draggedPropertyItem}
                            draggingProperty={draggingProperty}
                            setDraggingProperty={setDraggingProperty}
                        />
                    </PivotItem>
                    <PivotItem headerText="Json">
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
                        draggedTemplateItem={draggedTemplateItem}
                        enteredProperty={enteredProperty}
                        model={model}
                        setModel={setModel}
                        draggingTemplate={draggingTemplate}
                        setDraggingTemplate={setDraggingTemplate}
                        draggingProperty={draggingProperty}
                        enteredTemplate={enteredTemplate}
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
