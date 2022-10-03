import {
    DefaultButton,
    Dropdown,
    FontSizes,
    Icon,
    IDropdownOption,
    mergeStyleSets,
    PrimaryButton,
    Separator,
    Stack,
    TextField,
    useTheme
} from '@fluentui/react';
import React, { useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DTDLPropertyIconographyMap } from '../../../../Models/Constants/Constants';
import ModelledPropertyBuilder from '../../../ModelledPropertyBuilder/ModelledPropertyBuilder';
import {
    ModelledPropertyBuilderMode,
    PropertyExpression
} from '../../../ModelledPropertyBuilder/ModelledPropertyBuilder.types';
import { SceneBuilderContext } from '../../ADT3DSceneBuilder';
import { IValidityState, TabNames } from '../Behaviors/BehaviorForm.types';
import PanelFooter from '../Shared/PanelFooter';
import { getPanelFormStyles } from '../Shared/PanelForms.styles';
import { ConditionsList } from './Internal/ConditionsList';
import { VisualRuleFormProps } from './VisualRules.types';

export const VisualRuleForm: React.FC<VisualRuleFormProps> = (props) => {
    // Props
    const {
        isPropertyTypeDropdownEnabled,
        rootHeight,
        setPropertyTypeDropdownEnabled
    } = props;

    // General constants
    const { t } = useTranslation();
    const theme = useTheme();
    const commonFormStyles = getPanelFormStyles(theme, rootHeight);
    const typeOptions: Array<IDropdownOption> = useMemo(
        () =>
            Object.keys(DTDLPropertyIconographyMap).map((mappingKey) => ({
                key: `value-type-${DTDLPropertyIconographyMap[mappingKey].text}`,
                text: DTDLPropertyIconographyMap[mappingKey].text,
                data: { icon: DTDLPropertyIconographyMap[mappingKey].icon }
            })),
        []
    );
    // TODO: Wire this up to actual form data
    const formData = {
        propertyType: 'boolean'
    };

    // Contexts
    const {
        config,
        sceneId,
        adapter,
        setVisualRuleFormMode,
        state: { selectedElements, selectedBehavior }
    } = useContext(SceneBuilderContext);

    // TODO: Update form callbacks to wire them to form state
    const onTabValidityChange = useCallback(
        (_tabName: TabNames, _state: IValidityState) => {
            return;
        },
        []
    );

    const onPropertyChange = useCallback(
        (_newPropertyExpression: PropertyExpression) => {
            return;
        },
        []
    );

    const onTypeChange = useCallback(
        (
            _event: React.FormEvent<HTMLDivElement>,
            _option?: IDropdownOption<any>,
            _index?: number
        ) => {
            return;
        },
        []
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

    const customStyles = mergeStyleSets({
        description: {
            fontSize: FontSizes.size14,
            color: theme.palette.neutralSecondary
        }
    });

    const onInternalModeChanged = useCallback((internalMode) => {
        if (internalMode === 'INTELLISENSE') {
            setPropertyTypeDropdownEnabled(true);
        } else {
            setPropertyTypeDropdownEnabled(false);
        }
    }, []);

    return (
        <>
            <div className={commonFormStyles.content}>
                <div className={commonFormStyles.header}>
                    <Stack tokens={{ childrenGap: 12 }}>
                        <div className={customStyles.description}>
                            {t('3dSceneBuilder.visualRule.formDescription')}
                        </div>
                        <TextField
                            label={t('displayName')}
                            // value={FormState}
                            required={true}
                            onChange={(_e, newValue) => {
                                // Alerts change to visual rules
                                onTabValidityChange('Alerts', {
                                    isValid: !!newValue
                                });
                                // Add dispatch for state here
                            }}
                        />
                        <ModelledPropertyBuilder
                            adapter={adapter}
                            twinIdParams={{
                                behavior: selectedBehavior,
                                config,
                                sceneId,
                                selectedElements
                            }}
                            mode={ModelledPropertyBuilderMode.TOGGLE}
                            propertyExpression={{
                                expression: ''
                            }}
                            onChange={onPropertyChange}
                            onInternalModeChanged={onInternalModeChanged}
                            required
                        />
                        {isPropertyTypeDropdownEnabled && (
                            <Dropdown
                                required
                                placeholder={t(
                                    '3dSceneBuilder.visualRule.typePlaceholder'
                                )}
                                label={t('type')}
                                selectedKey={`value-type-${formData.propertyType}`}
                                onChange={onTypeChange}
                                options={typeOptions}
                                onRenderOption={onRenderTypeOption}
                                onRenderTitle={onRenderTypeTitle}
                            />
                        )}
                    </Stack>
                </div>
                <Separator />
                <div className={commonFormStyles.expandedSection}>
                    <ConditionsList />
                </div>
            </div>
            <PanelFooter>
                <PrimaryButton
                    text={t('save')}
                    onClick={() => setVisualRuleFormMode(null)}
                />
                <DefaultButton
                    text={t('cancel')}
                    onClick={() => setVisualRuleFormMode(null)}
                />
            </PanelFooter>
        </>
    );
};
