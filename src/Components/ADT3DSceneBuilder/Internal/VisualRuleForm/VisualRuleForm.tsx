import {
    classNamesFunction,
    DefaultButton,
    Dropdown,
    FontSizes,
    IDropdownOption,
    Label,
    mergeStyleSets,
    PrimaryButton,
    Separator,
    Stack,
    styled,
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
import TooltipCallout from '../../../TooltipCallout/TooltipCallout';
import { SceneBuilderContext } from '../../ADT3DSceneBuilder';
import { IValidityState, TabNames } from '../Behaviors/BehaviorForm.types';
import PanelFooter from '../Shared/PanelFooter';
import { getPanelFormStyles } from '../Shared/PanelForms.styles';
import {
    onRenderTypeOption,
    onRenderTypeTitle
} from '../Shared/SharedFormUtils';
import ConditionsList from './Internal/ConditionsList';
import { getStyles } from './VisualRuleForm.styles';
import {
    IVisualRuleFormProps,
    IVisualRuleFormStyles,
    IVisualRuleFormStylesProps
} from './VisualRuleForm.types';

const getClassNames = classNamesFunction<
    IVisualRuleFormStylesProps,
    IVisualRuleFormStyles
>();

const VisualRuleForm: React.FC<IVisualRuleFormProps> = (props) => {
    // Props
    const {
        isPropertyTypeDropdownEnabled,
        rootHeight,
        setPropertyTypeDropdownEnabled,
        styles
    } = props;

    // General constants
    const { t } = useTranslation();
    const theme = useTheme();
    const classNames = getClassNames(styles, {
        theme: theme
    });
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
                            {t('3dSceneBuilder.visualRuleForm.formDescription')}
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
                            styles={classNames.subComponentStyles.textField}
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
                                    '3dSceneBuilder.visualRuleForm.typePlaceholder'
                                )}
                                label={t('type')}
                                selectedKey={`value-type-${formData.propertyType}`}
                                onChange={onTypeChange}
                                options={typeOptions}
                                onRenderOption={onRenderTypeOption}
                                onRenderTitle={onRenderTypeTitle}
                                styles={classNames.subComponentStyles.dropdown}
                            />
                        )}
                    </Stack>
                </div>
                <Separator />
                <div className={commonFormStyles.expandingSection}>
                    <Stack horizontal verticalAlign={'center'}>
                        <Label styles={classNames.subComponentStyles.label}>
                            {t('3dSceneBuilder.conditions')}
                        </Label>
                        <TooltipCallout
                            content={{
                                buttonAriaLabel: t(
                                    '3dSceneBuilder.visualRuleForm.conditionsInfoContent'
                                ),
                                calloutContent: t(
                                    '3dSceneBuilder.visualRuleForm.conditionsInfoContent'
                                )
                            }}
                            styles={
                                classNames.subComponentStyles.tooltipCallout
                            }
                        />
                    </Stack>
                    <ConditionsList
                        styles={classNames.subComponentStyles.conditionsList}
                    />
                </div>
            </div>
            <PanelFooter>
                <PrimaryButton
                    text={t('save')}
                    onClick={() => setVisualRuleFormMode(null)}
                    styles={
                        classNames.subComponentStyles.saveButton
                            ? classNames.subComponentStyles.saveButton()
                            : undefined
                    }
                />
                <DefaultButton
                    text={t('cancel')}
                    onClick={() => setVisualRuleFormMode(null)}
                    styles={
                        classNames.subComponentStyles.cancelButton
                            ? classNames.subComponentStyles.cancelButton()
                            : undefined
                    }
                />
            </PanelFooter>
        </>
    );
};

export default styled<
    IVisualRuleFormProps,
    IVisualRuleFormStylesProps,
    IVisualRuleFormStyles
>(VisualRuleForm, getStyles);
