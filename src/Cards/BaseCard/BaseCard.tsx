import React from 'react';
import { BaseCardProps } from './BaseCard.types';
import './BaseCard.scss';
import BaseComponent from '../../Components/BaseComponent/BaseComponent';

const BaseCard: React.FC<BaseCardProps> = ({
    isLoading,
    adapterResult,
    children,
    title,
    theme,
    locale,
    localeStrings,
    cardError,
    hideInfoBox,
}) => {
    return (
        <BaseComponent
            adapterResults={[adapterResult]}
            componentError={cardError}
            isDataEmpty={!hideInfoBox && adapterResult?.hasNoData()}
            isLoading={!hideInfoBox && isLoading}
            locale={locale}
            localeStrings={localeStrings}
            theme={theme}
            containerClassName={'cb-base-card'}
        >
            {title && <h3 className={'cb-base-card-title'}>{title}</h3>}
            <div className={'cb-base-card-content'}>{children}</div>
        </BaseComponent>
    );
};

export default BaseCard;
