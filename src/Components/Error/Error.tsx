import React from 'react';
import { IErrorComponentProps } from '../../Models/Constants';
import './Error.scss';

const Error: React.FC<IErrorComponentProps> = ({
    errorTitle,
    errorContent
}) => {
    return (
        <div className="cb-error-wrapper">
            <div className="cb-error-box">
                <div className="cb-error-title">{errorTitle}</div>
                {errorContent && (
                    <div className="cb-error-content">{errorContent}</div>
                )}
            </div>
        </div>
    );
};

export default React.memo(Error);
