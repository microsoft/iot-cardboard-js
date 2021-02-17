import React, { useMemo, useReducer } from 'react';
import MockAdapter from '../../../Adapters/MockAdapter';
import {
    SET_CHART_PROPERTIES,
    SET_SELECTED_PROPERTIES
} from '../../../Models/Constants/ActionTypes';
import { SearchSpan } from '../../../Models/Classes/SearchSpan';
import LinechartCard from '../Consume/LinechartCard';
import './LinechartCardCreate.scss';
import {
    LinechartCardCreateProps,
    LinechartCardCreateFormProps
} from './LinechartCardCreate.types';
import {
    defaultLinechartCardCreateState,
    LinechartCardCreateReducer
} from './LinechartCardCreateState';
import { useTranslation } from 'react-i18next';
import { PrimaryButton, Dropdown, IDropdownOption } from '@fluentui/react';

const LinechartCardCreate: React.FC<LinechartCardCreateProps> = ({
    theme,
    propertyNames,
    defaultState
}) => {
    const { t } = useTranslation(); // we can also use props to pass the translate function but seems safer to rely on the usage of react i18next module in the component level
    const [state, dispatch] = useReducer(
        LinechartCardCreateReducer,
        defaultState ? defaultState : defaultLinechartCardCreateState
    );
    const id = 'exampleID';
    const searchSpan = new SearchSpan(
        new Date('2020-01-01'),
        new Date('2020-01-02')
    );

    const onDonezo = () => {
        dispatch({
            type: SET_CHART_PROPERTIES,
            payload: state.selectedPropertyNames
        });
    };

    const setSelectedProperties = (selectedProperties) => {
        dispatch({
            type: SET_SELECTED_PROPERTIES,
            payload: selectedProperties
        });
    };

    const adapter = useMemo(() => {
        return state.chartPropertyNames.length
            ? new MockAdapter()
            : new MockAdapter({ data: null });
    }, [state.chartPropertyNames]);

    return (
        <div className="cb-linechart-create-wrapper">
            <LinechartCreateForm
                onSubmit={onDonezo}
                propertyNames={propertyNames}
                setSelectedPropertyNames={setSelectedProperties}
                selectedPropertyNames={state.selectedPropertyNames}
            ></LinechartCreateForm>
            <div className="cb-right">
                <div>{t('preview')}</div>
                <div className="cb-preview-card">
                    <LinechartCard
                        theme={theme}
                        id={id}
                        searchSpan={searchSpan}
                        properties={state.chartPropertyNames}
                        adapter={adapter}
                    ></LinechartCard>
                </div>
            </div>
        </div>
    );
};

const LinechartCreateForm: React.FC<LinechartCardCreateFormProps> = ({
    onSubmit,
    propertyNames,
    setSelectedPropertyNames,
    selectedPropertyNames
}) => {
    const { t } = useTranslation();
    const parseAndSetSelectedProperties = (
        event: React.FormEvent<HTMLDivElement>,
        item: IDropdownOption
    ): void => {
        if (item) {
            setSelectedPropertyNames(
                item.selected
                    ? [...selectedPropertyNames, item.key as string]
                    : selectedPropertyNames.filter((key) => key !== item.key)
            );
        }
    };

    const dropdownOptions = propertyNames.map((pn) => {
        return {
            key: pn,
            text: pn
        };
    });

    return (
        <div className="cb-left">
            <Dropdown
                placeholder={t('selectProperties')}
                label={t('selectProperties')}
                selectedKeys={selectedPropertyNames}
                onChange={parseAndSetSelectedProperties}
                multiSelect
                options={dropdownOptions}
            />
            <PrimaryButton
                onClick={() => onSubmit()}
                className={'cb-submit-btn'}
            >
                {t('preview')}
            </PrimaryButton>
        </div>
    );
};

export default LinechartCardCreate;
