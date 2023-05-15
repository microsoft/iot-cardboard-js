import React from 'react';
import { getDebugLogger } from '../../../../Models/Services/Utils';
import { INewIndicatorProps } from './NewIndicator.types';
import { useClassNames } from './NewIndicator.styles';
import NewIcon from '../../../../Resources/Static/new.svg';
import { Image } from '@fluentui/react';

const debugLogging = false;
const logDebugConsole = getDebugLogger('NewIndicator', debugLogging);

const NewIndicator: React.FC<INewIndicatorProps> = (_props) => {
    // styles
    const classNames = useClassNames();

    logDebugConsole('debug', 'Render');

    return <Image className={classNames.root} src={NewIcon} />;
};

export default NewIndicator;
