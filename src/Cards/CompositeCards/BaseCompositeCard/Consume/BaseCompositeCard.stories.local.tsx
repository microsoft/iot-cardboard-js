import React from 'react';
import { useTranslation } from 'react-i18next';
import useAuthParams from '../../../../../.storybook/useAuthParams';
import ADTAdapter from '../../../../Adapters/ADTAdapter';
import MsalAuthService from '../../../../Models/Services/MsalAuthService';
import ADTHierarchyCard from '../../../ADTHierarchyCard/Consume/ADTHierarchyCard';
import RelationshipsTable from '../../../RelationshipsTable/Consume/RelationshipsTable';
import BaseCompositeCard from './BaseCompositeCard';

export default {
    title: 'CompositeCards/BaseCompositeCard/Consume'
};

export const ErrorBoundaryCompositeCard = (
    _args,
    { globals: { theme, locale } }
) => {
    const { t } = useTranslation();
    const authenticationParameters = useAuthParams();

    return !authenticationParameters ? (
        <div></div>
    ) : (
        <div
            style={{
                height: '400px',
                position: 'relative'
            }}
        >
            <BaseCompositeCard
                title={t('compositeCardWithErrors')}
                theme={theme}
                locale={locale}
            >
                {/* <KeyValuePairCard
                    theme={theme}
                    id="notRelevant"
                    properties={null}
                    adapter={new MockAdapter()}
                /> */}

                <ADTHierarchyCard
                    title={'ADT Hierarchy'}
                    theme={theme}
                    locale={locale}
                    adapter={
                        new ADTAdapter(
                            'smartcitiesexplorerdemo.api.aue.digitaltwins.azure.net',
                            new MsalAuthService(
                                authenticationParameters.adt.aadParameters
                            )
                        )
                    }
                />

                <RelationshipsTable
                    theme={theme}
                    id={null}
                    title={'Relationships'}
                    adapter={
                        new ADTAdapter(
                            'smartcitiesexplorerdemo.api.aue.digitaltwins.azure.net',
                            new MsalAuthService(
                                authenticationParameters.adt.aadParameters
                            )
                        )
                    }
                />
            </BaseCompositeCard>
        </div>
    );
};
