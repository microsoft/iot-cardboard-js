import React from 'react';
import { BaseCardCreateProps } from './BaseCardCreate.types';
import './BaseCardCreate.scss';
import { ThemeProvider } from '../../../Theming/ThemeProvider';

const BaseCard: React.FC<BaseCardCreateProps> = ({
    children,
    title,
    theme
}) => {
    return (
        <ThemeProvider theme={theme}>
            <div className="cb-base-card-create">
                <h3 className="cb-base-card-create-title">{title}</h3>
                <div className="cb-base-card-create-content">{children}</div>
            </div>
        </ThemeProvider>
    );
};

export default BaseCard;
