import React from 'react';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { IConsumeShellProps } from './ConsumeShell.types';
import { gridBorderVar, useClassNames } from './ConsumeShell.styles';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { GlobeRegular } from '@fluentui/react-icons';
import { useAppDataContext } from '../../Contexts/AppDataContext/AppDataContext';

const debugLogging = false;
const logDebugConsole = getDebugLogger('ConsumeShell', debugLogging);

const ConsumeShell: React.FC<IConsumeShellProps> = (_props) => {
    // contexts

    // state

    // hooks
    const theme = useExtendedTheme();
    const { appDataState } = useAppDataContext();

    // callbacks

    // side effects

    // styles
    const classNames = useClassNames();

    logDebugConsole('debug', 'Render');

    return (
        <div className={classNames.root}>
            <div
                className={classNames.header}
                style={{ [`${gridBorderVar}`]: theme.palette.glassyBorder }}
            >
                <GlobeRegular fontSize={'18px'} />
                <h3 className={classNames.headerText}>
                    {appDataState?.targetDatabase?.databaseName}
                </h3>
            </div>
            <div
                className={classNames.leftNav}
                style={{ [`${gridBorderVar}`]: theme.palette.glassyBorder }}
            ></div>
            <div className={classNames.content}>
                <b>Consume shell content here.</b>
            </div>
        </div>
    );
};

export default ConsumeShell;
