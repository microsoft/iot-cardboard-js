import { Dropdown } from '@fluentui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IADTEnvironments } from '../../Models/Constants';
import useAdapter from '../../Models/Hooks/useAdapter';
import './ADTEnvironments.scss';

const ADTEnvironments: React.FC<IADTEnvironments> = ({ adapter }) => {
    const { t } = useTranslation();

    const environmentsState = useAdapter({
        adapterMethod: () => adapter.getADTInstances(''),
        refetchDependencies: [adapter]
    });

    const dropdownOptions = ['a'].map((pn) => {
        return {
            key: pn,
            text: pn
        };
    });

    return (
        <Dropdown
            placeholder={t('selectProperties')}
            label={t('selectProperties')}
            multiSelect
            options={dropdownOptions}
        />
    );
};

export default React.memo(ADTEnvironments);
