import { Dropdown, Icon, IDropdownOption, TextField } from '@fluentui/react';
import produce from 'immer';
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { IDTDLPrimitiveType } from '../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
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
                        draft.widgetConfiguration.type = option.text as IDTDLPrimitiveType;
                    })
                );
            }
        },
        [updateWidgetData, formData]
    );

    const iconStyles = { marginRight: '8px' };
    const optionWrapperStyle = { display: 'flex', alignItems: 'center' };
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
                <span>{option.text}</span>
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
                <span>{option.text}</span>
            </div>
        );
    };

    const typeOptions: Array<IDropdownOption> = useMemo(
        () => [
            {
                key: 'value-type-boolean',
                text: 'boolean',
                data: { icon: 'ToggleRight' }
            },
            {
                key: 'value-type-date',
                text: 'date',
                data: { icon: 'Calendar' }
            },
            {
                key: 'value-type-date-time',
                text: 'dateTime',
                data: { icon: 'DateTime' }
            },
            {
                key: 'value-type-double',
                text: 'double',
                data: { icon: 'NumberSymbol' }
            },
            {
                key: 'value-type-duration',
                text: 'duration',
                data: { icon: 'BufferTimeBefore' }
            },
            {
                key: 'value-type-enum',
                text: 'enum',
                data: { icon: 'BulletedList2' }
            },
            {
                key: 'value-type-float',
                text: 'float',
                data: { icon: 'NumberSymbol' }
            },
            {
                key: 'value-type-integer',
                text: 'integer',
                data: { icon: 'NumberSymbol' }
            },
            {
                key: 'value-type-long',
                text: 'long',
                data: { icon: 'NumberSymbol' }
            },
            {
                key: 'value-type-string',
                text: 'string',
                data: { icon: 'TextField' }
            },
            {
                key: 'value-type-time',
                text: 'time',
                data: { icon: 'Clock' }
            }
        ],
        []
    );

    return (
        <>
            <TextField
                label={t('displayName')}
                value={formData.widgetConfiguration.displayName}
                onChange={onDisplayNameChange}
            />
            <TwinPropertyDropown // TODO: for now using existing TwinPropertyDropdown, replace this with ModelledPropertyBuilder
                behavior={behaviorToEdit}
                defaultSelectedKey={
                    formData.widgetConfiguration.valueExpression
                }
                dataTestId={'behavior-form-state-property-dropdown'}
                onChange={onPropertyChange}
            />
            <Dropdown
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
