import React, { useMemo } from 'react';
import Svg from 'react-inlinesvg';
import {
    IPropertyIconProps,
    IPropertyIconStyleProps,
    IPropertyIconStyles
} from './PropertyIcon.types';
import { getStyles } from './PropertyIcon.styles';
import { classNamesFunction, FontIcon, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../../../../../../../Models/Hooks/useExtendedTheme';
import { useTranslation } from 'react-i18next';
import { PROPERTY_ICON_DATA } from '../../../../../../../../Models/Constants/OatConstants';
import { getSchemaType } from '../../../../../../../../Models/Services/OatUtils';

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

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    // data
    const { iconSource, iconTitle, iconType } = useMemo(() => {
        const iconData = PROPERTY_ICON_DATA.get(getSchemaType(schema));
        return {
            iconSource:
                iconData?.source === 'Custom'
                    ? iconData?.icon
                    : iconData?.iconName,
            iconTitle: iconData?.title ? t(iconData.title) : '',
            iconType: iconData?.source
        };
    }, [schema, t]);

    return (
        <div className={classNames.root}>
            {iconSource && iconType === 'Custom' && (
                <Svg
                    className={classNames.customIcon}
                    src={iconSource}
                    title={iconTitle}
                ></Svg>
            )}
            {iconSource && iconType === 'Fluent' && (
                <FontIcon
                    className={classNames.fluentIcon}
                    iconName={iconSource}
                    title={iconTitle}
                />
            )}
        </div>
    );
};

export default styled<
    IPropertyIconProps,
    IPropertyIconStyleProps,
    IPropertyIconStyles
>(PropertyIcon, getStyles);
