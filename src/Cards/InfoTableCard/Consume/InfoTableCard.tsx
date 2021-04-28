import React from 'react';
import { InfoTableCardProps } from './InfoTableCard.types';
import I18nProviderWrapper from '../../../Models/Classes/I18NProviderWrapper';
import i18n from '../../../i18n';
import { ThemeProvider } from '../../../Theming/ThemeProvider';
import './InfoTableCard.scss';

const InfoTableCard: React.FC<InfoTableCardProps> = ({
    theme,
    locale,
    localeStrings,
    headers,
    tableRows
}) => {
    return (
        <I18nProviderWrapper
            locale={locale}
            localeStrings={localeStrings}
            i18n={i18n}
        >
            <ThemeProvider theme={theme}>
                <div className="cb-infotable-card">
                    <table>
                        <thead>
                            <tr>
                                {headers.map((h, i) => <th key={i} className='table-header table-cell'>{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tableRows.map((row, i) => <tr key={i}>
                                    {row.map((cell, j) => <td key={`cell-${i}-${j}`} className='table-cell'>{cell}</td>)}
                                </tr>)
                            }
                        </tbody>
                    </table>
                </div>
            </ThemeProvider>
        </I18nProviderWrapper>
    );
};

export default InfoTableCard;
