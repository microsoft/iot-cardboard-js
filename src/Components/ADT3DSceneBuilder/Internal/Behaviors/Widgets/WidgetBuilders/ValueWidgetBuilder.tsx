import { Dropdown, Icon, IDropdownOption, TextField } from '@fluentui/react';
import produce from 'immer';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DTDLPropertyIconographyMap } from '../../../../../../Models/Constants/Constants';
import { IDTDLPropertyType } from '../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import { SceneBuilderContext } from '../../../../ADT3DSceneBuilder';

import { IValueWidgetBuilderProps } from '../../../../ADT3DSceneBuilder.types';
import TwinPropertyDropown from '../../Internal/TwinPropertyDropdown';

const ValueWidgetBuilder: React.FC<IValueWidgetBuilderProps> = ({
    formData,
    updateWidgetData,
    setIsWidgetConfigValid
}) => {
    const { t } = useTranslation();
    const { behaviorToEdit } = useContext(SceneBuilderContext);

    useEffect(() => {
        const {
            displayName,
            valueExpression,
            type
        } = formData.widgetConfiguration;
        if (displayName && valueExpression && type) {
            setIsWidgetConfigValid(true);
        } else {
            setIsWidgetConfigValid(false);
        }
    }, [formData]);

    const onDisplayNameChange = useCallback(
        (_event, value: string) => {
            updateWidgetData(
                produce(formData, (draft) => {
                    draft.widgetConfiguration.displayName = value;
                })
            );
        },
        [updateWidgetData, formData]
    );

    const onPropertyChange = useCallback(
        (option: string) => {
            updateWidgetData(
                produce(formData, (draft) => {
                    draft.widgetConfiguration.valueExpression = option; // TODO: Also update the type as necessary after we get the modelled property
                })
            );
        },
        [updateWidgetData, formData]
    );

    const onTypeChange = useCallback(
        (_event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
            if (option) {
                updateWidgetData(
                    produce(formData, (draft) => {
                        draft.widgetConfiguration.type = option.text as IDTDLPropertyType;
                    })
                );
            }
        },
        [updateWidgetData, formData]
    );

    const iconStyles = { marginRight: '8px' };
    const optionWrapperStyle = { display: 'flex', alignItems: 'center' };
    const optionTextStyle = { marginTop: '-4px' };
    const onRenderTypeOption = (option: IDropdownOption): JSX.Element => {
        return (
            <div style={optionWrapperStyle}>
                {option.data && option.data.icon && (
                    <Icon
                        style={iconStyles}
                        iconName={option.data.icon}
                        aria-hidden="true"
                        title={option.data.icon}
                    />
                )}
                <span style={optionTextStyle}>{option.text}</span>
            </div>
        );
    };

    const onRenderTypeTitle = (options: IDropdownOption[]): JSX.Element => {
        const option = options[0];

        return (
            <div style={optionWrapperStyle}>
                {option.data && option.data.icon && (
                    <Icon
                        style={iconStyles}
                        iconName={option.data.icon}
                        aria-hidden="true"
                        title={option.data.icon}
                    />
                )}
                <span style={optionTextStyle}>{option.text}</span>
            </div>
        );
    };

    const typeOptions: Array<IDropdownOption> = useMemo(
        () =>
            Object.keys(DTDLPropertyIconographyMap).map((mappingKey) => ({
                key: `value-type-${DTDLPropertyIconographyMap[mappingKey].text}`,
                text: DTDLPropertyIconographyMap[mappingKey].text,
                data: { icon: DTDLPropertyIconographyMap[mappingKey].icon }
            })),
        []
    );

    return (
        <>
            <TextField
                required
                placeholder={t('widgets.value.displayNamePlaceholder')}
                label={t('displayName')}
                value={formData.widgetConfiguration.displayName}
                onChange={onDisplayNameChange}
            />
            <TwinPropertyDropown // TODO: for now using existing TwinPropertyDropdown, replace this with ModelledPropertyBuilder
                required
                behavior={behaviorToEdit}
                defaultSelectedKey={
                    formData.widgetConfiguration.valueExpression
                }
                dataTestId={'behavior-form-state-property-dropdown'}
                onChange={onPropertyChange}
            />
            <Dropdown
                required
                placeholder={t('widgets.value.typePlaceholder')}
                label={t('type')}
                selectedKey={`value-type-${formData.widgetConfiguration.type}`}
                onChange={onTypeChange}
                options={typeOptions}
                onRenderOption={onRenderTypeOption}
                onRenderTitle={onRenderTypeTitle}
            />
        </>
    );
};

export default ValueWidgetBuilder;
