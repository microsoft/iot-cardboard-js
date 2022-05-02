import React from 'react';
import { IImageProps, Image, Text } from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import {
    getStyles,
    noLayersDescriptionStyles,
    sectionHeaderStyles
} from './NoDataMessage.styles';

export interface NoDataMessageProps {
    headerTextTag: string;
    imageProps?: IImageProps;
    descriptionTextTag?: string;
}

export const NoDataMessage: React.FunctionComponent<NoDataMessageProps> = (
    props: NoDataMessageProps
) => {
    const { t } = useTranslation();
    const styles = getStyles();

    return (
        <div className={styles.container}>
            {props.imageProps ? (
                <Image
                    styles={{ root: { marginBottom: 8 } }}
                    {...props.imageProps}
                />
            ) : null}
            <Text variant="medium" as="div" styles={sectionHeaderStyles}>
                {t(props.headerTextTag)}
            </Text>
            {props.descriptionTextTag ? (
                <Text
                    variant="small"
                    as="div"
                    styles={noLayersDescriptionStyles}
                >
                    {t(props.descriptionTextTag)}
                </Text>
            ) : null}
        </div>
    );
};
