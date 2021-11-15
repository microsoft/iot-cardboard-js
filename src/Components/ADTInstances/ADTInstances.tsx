import {
    Dropdown,
    IconButton,
    IDropdownProps,
    Label,
    Stack,
    TooltipHost
} from '@fluentui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    IADTInstancesProps,
    IADTInstance,
    Theme
} from '../../Models/Constants';
import useAdapter from '../../Models/Hooks/useAdapter';
import I18nProviderWrapper from '../../Models/Classes/I18NProviderWrapper';
import { ThemeProvider } from '../../Theming/ThemeProvider';
import './ADTInstances.scss';

const ADTInstances: React.FC<IADTInstancesProps> = ({
    adapter,
    hasLabel = true,
    selectedInstance,
    onInstanceChange,
    theme,
    locale,
    localeStrings
}) => {
    const { t, i18n } = useTranslation();
    const [instances, setInstances] = useState<Array<IADTInstance>>([]);
    const [selectedOption, setSelectedOption] = useState(selectedInstance);

    const environmentsState = useAdapter({
        adapterMethod: () => adapter.getADTInstances(),
        refetchDependencies: [adapter]
    });

    useEffect(() => {
        if (!environmentsState.adapterResult.hasNoData()) {
            setInstances(environmentsState.adapterResult.result?.data);
        }
    }, [environmentsState.adapterResult.result]);

    const dropdownOptions: any = useMemo(
        () =>
            instances
                .sort((a, b) =>
                    a.hostName.localeCompare(b.hostName, undefined, {
                        sensitivity: 'base'
                    })
                )
                .map((e) => {
                    return {
                        key: e.hostName,
                        text: e.hostName
                    };
                }),
        [instances]
    );

    const onRenderLabel = (props: IDropdownProps): JSX.Element => {
        return (
            hasLabel && (
                <Stack horizontal verticalAlign="center">
                    <Label>{props.label}</Label>
                    <TooltipHost content={t('ADTInstancesInfo')}>
                        <IconButton
                            iconProps={{ iconName: 'Info' }}
                            title="Info"
                            ariaLabel="Info"
                            styles={{ root: { marginBottom: -3 } }}
                        />
                    </TooltipHost>
                </Stack>
            )
        );
    };

    return (
        <I18nProviderWrapper
            locale={locale}
            localeStrings={localeStrings}
            i18n={i18n}
        >
            <ThemeProvider theme={theme ?? Theme.Light}>
                <div className="cb-adt-instances-dropdown-list-container">
                    <Dropdown
                        placeholder={
                            environmentsState.isLoading
                                ? t('loadingInstances')
                                : t('selectInstance')
                        }
                        label={t('ADTInstances')}
                        options={dropdownOptions}
                        disabled={environmentsState.isLoading}
                        onRenderLabel={onRenderLabel}
                        selectedKey={selectedOption}
                        onChange={(_e, option) => {
                            setSelectedOption(option.text);
                            if (onInstanceChange) {
                                onInstanceChange(option.text);
                            }
                        }}
                    />
                </div>
            </ThemeProvider>
        </I18nProviderWrapper>
    );
};

export default React.memo(ADTInstances);
