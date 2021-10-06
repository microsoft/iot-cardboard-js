import React from 'react';
import { InfoTableCardProps } from './InfoTableCard.types';
import I18nProviderWrapper from '../../../Models/Classes/I18NProviderWrapper';
import i18n from '../../../i18n';
import { ThemeProvider } from '../../../Theming/ThemeProvider';
import './InfoTableCard.scss';
import { withErrorBoundary } from '../../../Models/Context/ErrorBoundary';
import { DefaultButton } from '@fluentui/react';

const InfoTableCard: React.FC<InfoTableCardProps> = ({
    theme,
    locale,
    localeStrings,
    headers,
    tableRows,
    infoTableActionButtonProps
}) => {
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
                            infoTableActionButtonProps &&
                            'cb-info-table-container-constrained'
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
                    {infoTableActionButtonProps && (
                        <div className="cb-property-inspector-button-container">
                            <DefaultButton
                                iconProps={{ iconName: 'Edit' }}
                                text={infoTableActionButtonProps.label}
                                onClick={infoTableActionButtonProps.onClick}
                            />
                        </div>
                    )}
                </div>
            </ThemeProvider>
        </I18nProviderWrapper>
    );
};

export default withErrorBoundary(InfoTableCard);
