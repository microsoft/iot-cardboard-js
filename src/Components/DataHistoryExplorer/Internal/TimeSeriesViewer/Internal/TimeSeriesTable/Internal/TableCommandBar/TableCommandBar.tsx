import React, { useCallback } from 'react';
import {
    ITableCommandBarProps,
    ITableCommandBarStyleProps,
    ITableCommandBarStyles
} from './TableCommandBar.types';
import { getStyles } from './TableCommandBar.styles';
import {
    classNamesFunction,
    useTheme,
    styled,
    CommandBar,
    ICommandBarItemProps
} from '@fluentui/react';
import { useTranslation } from 'react-i18next';
import { downloadText } from '../../../../../../../../Models/Services/Utils';
import { ADXTimeSeriesTableRow } from '../../../../../../../../Models/Constants';

const DOWNLOAD_FILE_NAME = 'ADX Table (UTC)';

const getClassNames = classNamesFunction<
    ITableCommandBarStyleProps,
    ITableCommandBarStyles
>();

const TableCommandBar: React.FC<ITableCommandBarProps> = (props) => {
    const { data, styles } = props;

    // hooks
    const { t } = useTranslation();

    // callbacks
    const onDownloadClick = useCallback(() => {
        downloadText(
            JSON.stringify(
                data.map((d) => {
                    const { property, ...rest } = d;
                    delete rest.seriesId;
                    return {
                        ...rest,
                        key: property // move the key field back to property name
                    } as ADXTimeSeriesTableRow;
                }),
                null,
                2
            ),
            `${DOWNLOAD_FILE_NAME}.json`
        );
    }, [data]);

    // styles
    const classNames = getClassNames(styles, {
        theme: useTheme()
    });

    const items: ICommandBarItemProps[] = [
        {
            key: 'download',
            text: t('download'),
            iconProps: { iconName: 'Download' },
            onClick: onDownloadClick
        }
    ];

    return (
        <div className={classNames.root}>
            <CommandBar
                items={items}
                styles={classNames.subComponentStyles.commandBar}
            />
        </div>
    );
};

export default styled<
    ITableCommandBarProps,
    ITableCommandBarStyleProps,
    ITableCommandBarStyles
>(TableCommandBar, getStyles);
