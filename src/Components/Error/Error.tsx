import React from 'react';
import { IErrorComponentProps } from '../../Models/Constants';
import Modal from '../Modal/Modal';
import './Error.scss';

const Error: React.FC<IErrorComponentProps> = ({
    errorTitle,
    errorContent
}) => {
    return (
        <Modal>
            <div className="cb-error-title">{errorTitle}</div>
            {errorContent && <div>{errorContent}</div>}
        </Modal>
    );
};

export default React.memo(Error);
