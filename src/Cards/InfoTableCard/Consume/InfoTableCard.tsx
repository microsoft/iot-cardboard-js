import React from 'react';
import { InfoTableCardProps } from './InfoTableCard.types';
import I18nProviderWrapper from '../../../Models/Classes/I18NProviderWrapper';
import i18n from '../../../i18n';
import { ThemeProvider } from '../../../Theming/ThemeProvider';
import './InfoTableCard.scss';
import { withErrorBoundary } from '../../../Models/Context/ErrorBoundary';
import { DefaultButton } from '@fluentui/react/lib/components/Button/DefaultButton/DefaultButton';
import { useTranslation } from 'react-i18next';

const InfoTableCard: React.FC<InfoTableCardProps> = ({
    theme,
    locale,
    localeStrings,
    headers,
    tableRows,
    editTwinId,
    onPropertyInspectorActionClicked
}) => {
    const { t } = useTranslation();

    return (
        <I18nProviderWrapper
            locale={locale}
            localeStrings={localeStrings}
            i18n={i18n}
        >
            <ThemeProvider theme={theme}>
                <div className="cb-infotable-card">
                    <div
                        className={`cb-infotable-table-container ${
                            editTwinId && 'cb-info-table-container-constrained'
                        }`}
                    >
                        <table>
                            <thead>
                                <tr>
                                    {headers.map((h, i) => (
                                        <th
                                            key={i}
                                            className="cb-table-header cb-table-cell"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tableRows.map((row, i) => (
                                    <tr key={i}>
                                        {row.map((cell, j) => (
                                            <td
                                                key={`cell-${i}-${j}`}
                                                className="cb-table-cell"
                                            >
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {editTwinId && (
                        <div className="cb-property-inspector-button-container">
                            <DefaultButton
                                iconProps={{ iconName: 'Edit' }}
                                text={t('editTwin')}
                                onClick={onPropertyInspectorActionClicked}
                            />
                        </div>
                    )}
                </div>
            </ThemeProvider>
        </I18nProviderWrapper>
    );
};

export default withErrorBoundary(InfoTableCard);
