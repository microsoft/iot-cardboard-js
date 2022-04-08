import React, { useState } from 'react';
import {
    FontIcon,
    TextField,
    ActionButton,
    Stack,
    Pivot,
    PivotItem,
    Label,
    Text
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { getPropertyInspectorStyles } from './OATPropertyEditor.styles';
import BaseComponent from '../BaseComponent/BaseComponent';
import PropertySelector from './PropertySelector';
import JSONEditor from './JSONEditor';

const data = {
    propertyTags: {
        primitive: [
            'boolean',
            'data',
            'dataTime',
            'double',
            'duration',
            'float',
            'integer',
            'long',
            'string',
            'time'
        ]
    }
};

const OATPropertyEditor = ({
    model,
    setModel,
    setModalOpen,
    currentPropertyIndex,
    setCurrentPropertyIndex,
    theme
}) => {
    const { t } = useTranslation();
    const propertyInspectorStyles = getPropertyInspectorStyles();
    const [propertySelectorVisible, setPropertySelectorVisible] = useState(
        false
    );

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
                    aria-label="Large Link Size Pivot Example"
                    linkSize="large"
                >
                    <PivotItem headerText="Properties">
                        <Stack
                            className={
                                propertyInspectorStyles.gridGeneralPropertiesWrap
                            }
                        >
                            <Label>{`${t(
                                'OATPropertyEditor.displayName'
                            )} (3)`}</Label>
                            <Stack className={propertyInspectorStyles.gridRow}>
                                <Text>{t('OATPropertyEditor.general')}</Text>
                                <TextField
                                    className={
                                        propertyInspectorStyles.propertyItemTextField
                                    }
                                    borderless
                                    placeholder={model.displayName}
                                    onChange={(_ev, value) => {
                                        const modelCopy = {
                                            ...model,
                                            displayName: value
                                        };
                                        setModel(modelCopy);
                                    }}
                                />
                            </Stack>
                            <Stack className={propertyInspectorStyles.gridRow}>
                                <Text>{t('OATPropertyEditor.assetId')}</Text>
                                <TextField
                                    className={
                                        propertyInspectorStyles.propertyItemTextField
                                    }
                                    borderless
                                    placeholder={model['@id']}
                                    onChange={(_ev, value) => {
                                        const modelCopy = {
                                            ...model,
                                            '@id': value
                                        };
                                        setModel(modelCopy);
                                    }}
                                />
                            </Stack>
                            <Stack className={propertyInspectorStyles.gridRow}>
                                <Text>{t('OATPropertyEditor.type')}</Text>
                                <TextField
                                    className={
                                        propertyInspectorStyles.propertyItemTextField
                                    }
                                    borderless
                                    placeholder={model['@type']}
                                    onChange={(_ev, value) => {
                                        const modelCopy = {
                                            ...model,
                                            '@type': value
                                        };
                                        setModel(modelCopy);
                                    }}
                                />
                            </Stack>
                        </Stack>
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
                                    <Stack
                                        className={propertyInspectorStyles.row}
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
                                    </Stack>
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
                        <Stack
                            className={propertyInspectorStyles.propertiesWrap}
                        >
                            {propertySelectorVisible && (
                                <PropertySelector
                                    data={data}
                                    setPropertySelectorVisible={
                                        setPropertySelectorVisible
                                    }
                                    model={model}
                                    setModel={setModel}
                                />
                            )}
                            {!propertySelectorVisible &&
                                model.contents.length === 0 && (
                                    <ActionButton
                                        onClick={() =>
                                            setPropertySelectorVisible(true)
                                        }
                                    >
                                        <FontIcon
                                            iconName={'CirclePlus'}
                                            className={
                                                propertyInspectorStyles.iconAddProperty
                                            }
                                        />
                                        <Text>
                                            {t('OATPropertyEditor.addProperty')}
                                        </Text>
                                    </ActionButton>
                                )}
                            {model.contents.length > 0 &&
                                model.contents.map((item, i) => (
                                    <Stack
                                        key={i}
                                        className={
                                            propertyInspectorStyles.propertyItem
                                        }
                                    >
                                        <TextField
                                            className={
                                                propertyInspectorStyles.propertyItemTextField
                                            }
                                            borderless
                                            placeholder={item.name}
                                            validateOnFocusOut
                                            onChange={() => {
                                                setCurrentPropertyIndex(i);
                                            }}
                                            onGetErrorMessage={getErrorMessage}
                                        />
                                        <Text>{item.schema}</Text>
                                        <ActionButton
                                            className={
                                                propertyInspectorStyles.propertyItemIconWrap
                                            }
                                            onClick={() => {
                                                setCurrentPropertyIndex(i);
                                                setModalOpen(true);
                                            }}
                                        >
                                            <FontIcon
                                                iconName={'Info'}
                                                className={
                                                    propertyInspectorStyles.propertyItemIcon
                                                }
                                            />
                                        </ActionButton>
                                        <ActionButton
                                            className={
                                                propertyInspectorStyles.propertyItemIconWrap
                                            }
                                        >
                                            <FontIcon
                                                iconName={'More'}
                                                className={
                                                    propertyInspectorStyles.propertyItemIcon
                                                }
                                            />
                                        </ActionButton>
                                    </Stack>
                                ))}

                            {model.contents.length > 0 && (
                                <Stack
                                    className={
                                        propertyInspectorStyles.addPropertyBar
                                    }
                                >
                                    <ActionButton
                                        onClick={() =>
                                            setPropertySelectorVisible(true)
                                        }
                                    >
                                        <FontIcon
                                            iconName={'CirclePlus'}
                                            className={
                                                propertyInspectorStyles.addPropertyBarIcon
                                            }
                                        />
                                    </ActionButton>
                                </Stack>
                            )}
                        </Stack>
                    </PivotItem>
                    <PivotItem headerText="Json">
                        <JSONEditor
                            theme={theme}
                            model={model}
                            setModel={setModel}
                        />
                    </PivotItem>
                </Pivot>
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
