import React, { useMemo } from 'react';
import Svg from 'react-inlinesvg';
import {
    IPropertyIconProps,
    IPropertyIconStyleProps,
    IPropertyIconStyles
} from './PropertyIcon.types';
import { getStyles } from './PropertyIcon.styles';
import { classNamesFunction, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../../../Models/Hooks/useExtendedTheme';
import { useTranslation } from 'react-i18next';
import { PROPERTY_ICON_DATA } from '../../../../Models/Constants/OatConstants';
import { getSchemaType } from '../../../../Models/Services/OatUtils';

const getClassNames = classNamesFunction<
    IPropertyIconStyleProps,
    IPropertyIconStyles
>();

const PropertyIcon: React.FC<IPropertyIconProps> = (props) => {
    const { schema, styles } = props;

    // contexts

    // state

    // hooks
    const { t } = useTranslation();

    // callbacks

    // side effects

    // data
    const { iconSource, iconTitle } = useMemo(() => {
        const iconData = PROPERTY_ICON_DATA.get(getSchemaType(schema));
        return {
            iconSource: iconData?.icon,
            iconTitle: iconData?.title ? t(iconData.title) : ''
        };
    }, [t, schema]);

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    return (
        <div className={classNames.root}>
            {iconSource && (
                <Svg
                    className={classNames.icon}
                    src={iconSource}
                    title={iconTitle}
                ></Svg>
            )}
        </div>
    );
};

export default styled<
    IPropertyIconProps,
    IPropertyIconStyleProps,
    IPropertyIconStyles
>(PropertyIcon, getStyles);
