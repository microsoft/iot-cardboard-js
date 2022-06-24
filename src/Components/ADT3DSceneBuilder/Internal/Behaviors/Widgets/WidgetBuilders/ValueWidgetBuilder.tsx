import {
    Dropdown,
    Icon,
    IDropdownOption,
    Stack,
    TextField,
    useTheme
} from '@fluentui/react';
import produce from 'immer';
import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { DTDLPropertyIconographyMap } from '../../../../../../Models/Constants/Constants';
import { useBehaviorFormContext } from '../../../../../../Models/Context/BehaviorFormContext/BehaviorFormContext';
import { IDTDLPropertyType } from '../../../../../../Models/Types/Generated/3DScenesConfiguration-v1.0.0';
import ModelledPropertyBuilder from '../../../../../ModelledPropertyBuilder/ModelledPropertyBuilder';
import {
    ModelledPropertyBuilderMode,
    PropertyExpression
} from '../../../../../ModelledPropertyBuilder/ModelledPropertyBuilder.types';
import { SceneBuilderContext } from '../../../../ADT3DSceneBuilder';

import { IValueWidgetBuilderProps } from '../../../../ADT3DSceneBuilder.types';
import { getWidgetFormStyles } from '../WidgetForm/WidgetForm.styles';

const ValueWidgetBuilder: React.FC<IValueWidgetBuilderProps> = ({
    formData,
    updateWidgetData,
    setIsWidgetConfigValid
}) => {
    const { t } = useTranslation();
    const {
        config,
        sceneId,
        adapter,
        state: { selectedElements }
    } = useContext(SceneBuilderContext);
    const { behaviorFormState } = useBehaviorFormContext();

    const [isManualTypeDropdownShown, setIsManualTypeDropdownShown] = useState(
        false
    );

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
        (newPropertyExpression: PropertyExpression) => {
            updateWidgetData(
                produce(formData, (draft) => {
                    draft.widgetConfiguration.valueExpression =
                        newPropertyExpression.expression;
                    // If type information included (non intellisense mode), update the value widget type
                    if (newPropertyExpression.property) {
                        draft.widgetConfiguration.type =
                            newPropertyExpression.property.propertyType;
                    }
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
        () =>
            Object.keys(DTDLPropertyIconographyMap).map((mappingKey) => ({
                key: `value-type-${DTDLPropertyIconographyMap[mappingKey].text}`,
                text: DTDLPropertyIconographyMap[mappingKey].text,
                data: { icon: DTDLPropertyIconographyMap[mappingKey].icon }
            })),
        []
    );

    const theme = useTheme();
    const customStyles = getWidgetFormStyles(theme);

    return (
        <div className={customStyles.widgetFormContents}>
            <Stack tokens={{ childrenGap: 8 }}>
                <TextField
                    required
                    placeholder={t('widgets.value.displayNamePlaceholder')}
                    label={t('displayName')}
                    value={formData.widgetConfiguration.displayName}
                    onChange={onDisplayNameChange}
                />
                <ModelledPropertyBuilder
                    adapter={adapter}
                    twinIdParams={{
                        behavior: behaviorFormState.behaviorToEdit,
                        config,
                        sceneId,
                        selectedElements
                    }}
                    mode={ModelledPropertyBuilderMode.TOGGLE}
                    propertyExpression={{
                        expression:
                            formData.widgetConfiguration.valueExpression || ''
                    }}
                    onChange={onPropertyChange}
                    onInternalModeChanged={(internalMode) => {
                        if (internalMode === 'INTELLISENSE') {
                            setIsManualTypeDropdownShown(true);
                        } else {
                            setIsManualTypeDropdownShown(false);
                        }
                    }}
                    required
                />
                {isManualTypeDropdownShown && (
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
                )}
            </Stack>
        </div>
    );
};

export default ValueWidgetBuilder;
