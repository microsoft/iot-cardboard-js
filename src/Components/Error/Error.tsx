import React from 'react';
import { IErrorComponentProps } from '../../Models/Constants';
import Overlay from '../Modal/Overlay';
import './Error.scss';

const Error: React.FC<IErrorComponentProps> = ({
    errorTitle,
    errorContent
}) => {
    return (
        <Overlay>
            <div className="cb-error-title">{errorTitle}</div>
            {errorContent && <div>{errorContent}</div>}
        </Overlay>
    );
};

export default React.memo(Error);
