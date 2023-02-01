import React, { useMemo, useState } from 'react';
import {
    IDataHistoryExplorerModalControlProps,
    IDataHistoryExplorerModalControlStyleProps,
    IDataHistoryExplorerModalControlStyles
} from './DataHistoryExplorerModalControl.types';
import { getStyles } from './DataHistoryExplorerModalControl.styles';
import { classNamesFunction, IconButton, styled } from '@fluentui/react';
import { useExtendedTheme } from '../../../Models/Hooks/useExtendedTheme';
import { createGUID } from '../../../Models/Services/Utils';
import { getHighChartColor } from '../../../Models/SharedUtils/DataHistoryUtils';
import DataHistoryExplorerModal from '../DataHistoryExplorerModal';
import { IDataHistoryTimeSeriesTwin } from '../../../Models/Constants';
import { useTranslation } from 'react-i18next';

const getClassNames = classNamesFunction<
    IDataHistoryExplorerModalControlStyleProps,
    IDataHistoryExplorerModalControlStyles
>();

const DataHistoryExplorerModalControl: React.FC<IDataHistoryExplorerModalControlProps> = (
    props
) => {
    const { adapter, isEnabled, initialTwinId, styles } = props;

    // contexts

    // state
    const [isModalVisible, setIsModalVisible] = useState(false);

    // hooks
    const { t } = useTranslation();
    const isControlEnabled = useMemo(
        () =>
            isEnabled !== undefined
                ? isEnabled
                : adapter.getADXConnectionInformation(),
        [isEnabled, adapter]
    );

    // callbacks
    const defaultTimeSeriesTwinList: Array<IDataHistoryTimeSeriesTwin> = useMemo(
        () =>
            initialTwinId
                ? [
                      {
                          seriesId: createGUID(),
                          twinId: initialTwinId,
                          twinPropertyName: null,
                          twinPropertyType: null,
                          chartProps: {
                              color: getHighChartColor(),
                              isTwinPropertyTypeCastedToNumber: true
                          }
                      }
                  ]
                : undefined,
        [initialTwinId]
    );

    // side effects

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    const controlTitle = isControlEnabled
        ? t('dataHistoryExplorer.control.title')
        : t('dataHistoryExplorer.control.disabledTitle');

    return (
        <div className={classNames.root}>
            <IconButton
                styles={classNames.subComponentStyles.iconButton()}
                disabled={!isControlEnabled}
                iconProps={{ iconName: 'Chart' }}
                ariaLabel={controlTitle}
                title={controlTitle}
                onClick={() => setIsModalVisible(true)}
            />
            <DataHistoryExplorerModal
                adapter={adapter}
                isOpen={isModalVisible}
                onDismiss={() => setIsModalVisible(false)}
                timeSeriesTwins={defaultTimeSeriesTwinList}
            />
        </div>
    );
};

export default styled<
    IDataHistoryExplorerModalControlProps,
    IDataHistoryExplorerModalControlStyleProps,
    IDataHistoryExplorerModalControlStyles
>(DataHistoryExplorerModalControl, getStyles);
