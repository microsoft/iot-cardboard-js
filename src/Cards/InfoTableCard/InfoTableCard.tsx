import React from 'react';
import { InfoTableCardProps } from './InfoTableCard.types';
import './InfoTableCard.scss';
import { withErrorBoundary } from '../../Models/Context/ErrorBoundary';
import { DefaultButton } from '@fluentui/react';
import BaseComponent from '../../Components/BaseComponent/BaseComponent';

const InfoTableCard: React.FC<InfoTableCardProps> = ({
    theme,
    locale,
    localeStrings,
    headers,
    tableRows,
    infoTableActionButtonProps,
}) => {
    return (
        <BaseComponent
            locale={locale}
            localeStrings={localeStrings}
            theme={theme}
        >
            <div className={'cb-infotable-card'}>
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
                                        className={
                                            'cb-table-header cb-table-cell'
                                        }
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
                                            className={'cb-table-cell'}
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
                    <div className={'cb-property-inspector-button-container'}>
                        <DefaultButton
                            iconProps={{ iconName: 'Edit' }}
                            text={infoTableActionButtonProps.label}
                            onClick={infoTableActionButtonProps.onClick}
                        />
                    </div>
                )}
            </div>
        </BaseComponent>
    );
};

export default withErrorBoundary(InfoTableCard);
