import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    IDataHistoryExplorerModalControlProps,
    IDataHistoryExplorerModalControlStyleProps,
    IDataHistoryExplorerModalControlStyles
} from './DataHistoryExplorerModalControl.types';
import { getStyles } from './DataHistoryExplorerModalControl.styles';
import {
    classNamesFunction,
    IconButton,
    Spinner,
    SpinnerSize,
    styled
} from '@fluentui/react';
import { useExtendedTheme } from '../../../Models/Hooks/useExtendedTheme';
import { createGUID, isDefined } from '../../../Models/Services/Utils';
import {
    getHighChartColor,
    sendDataHistoryExplorerUserTelemetry
} from '../../../Models/SharedUtils/DataHistoryUtils';
import DataHistoryExplorerModal from '../DataHistoryExplorerModal';
import {
    IADXConnection,
    IDataHistoryTimeSeriesTwin
} from '../../../Models/Constants';
import { useTranslation } from 'react-i18next';
import useAdapter from '../../../Models/Hooks/useAdapter';
import { TelemetryEvents } from '../../../Models/Constants/TelemetryConstants';
import { useGuid } from '../../../Models/Hooks';

const getClassNames = classNamesFunction<
    IDataHistoryExplorerModalControlStyleProps,
    IDataHistoryExplorerModalControlStyles
>();

const DataHistoryExplorerModalControl: React.FC<IDataHistoryExplorerModalControlProps> = (
    props
) => {
    const { adapter, isEnabled, initialTwinId, styles } = props;

    // state
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [
        connectionInformation,
        setConnectionInformation
    ] = useState<IADXConnection>(adapter.getADXConnectionInformation());
    const [isControlEnabled, setIsControlEnabled] = useState(
        isDefined(isEnabled) ? isEnabled : !!connectionInformation
    );

    // hooks
    const { t } = useTranslation();
    const connectionState = useAdapter({
        adapterMethod: () => adapter.updateADXConnectionInformation(),
        isAdapterCalledOnMount:
            !isDefined(isEnabled) && !isDefined(connectionInformation),
        refetchDependencies: [adapter]
    });
    const hasForcedControl = useMemo(() => isDefined(isEnabled), [isEnabled]);
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
    const modalId = useGuid();

    //callbacks
    const handleOnOpenClick = useCallback(() => {
        setIsModalVisible(true);
        const telemetry =
            TelemetryEvents.Tools.DataHistoryExplorer.UserAction.OpenModal;
        sendDataHistoryExplorerUserTelemetry(telemetry.eventName, [
            {
                [telemetry.properties.modalId]: modalId
            }
        ]);
    }, [sendDataHistoryExplorerUserTelemetry]);
    const handleOnDismiss = useCallback(() => {
        setIsModalVisible(false);
        const telemetry =
            TelemetryEvents.Tools.DataHistoryExplorer.UserAction.CloseModal;
        sendDataHistoryExplorerUserTelemetry(telemetry.eventName, [
            {
                [telemetry.properties.modalId]: modalId
            }
        ]);
    }, [sendDataHistoryExplorerUserTelemetry]);

    // side-effects
    useEffect(() => {
        if (connectionState?.adapterResult?.result) {
            if (!connectionState?.adapterResult.hasNoData()) {
                const connectionData = connectionState.adapterResult.getData();
                setConnectionInformation(connectionData);
                if (connectionData && !hasForcedControl) {
                    setIsControlEnabled(true);
                }
            } else {
                setConnectionInformation(null);
                if (!hasForcedControl) {
                    setIsControlEnabled(false);
                }
            }
        }
    }, [connectionState?.adapterResult.result]);

    // styles
    const classNames = getClassNames(styles, {
        theme: useExtendedTheme()
    });

    const controlTitle = isControlEnabled
        ? t('dataHistoryExplorer.control.title')
        : t('dataHistoryExplorer.control.disabledTitle');

    return (
        <div className={classNames.root}>
            {connectionState.isLoading ? (
                <Spinner
                    size={SpinnerSize.small}
                    title={t('dataHistoryExplorer.loadingConnectionLabel')}
                    styles={classNames.subComponentStyles.spinner}
                />
            ) : (
                <IconButton
                    styles={classNames.subComponentStyles.iconButton()}
                    disabled={!isControlEnabled}
                    iconProps={{ iconName: 'Chart' }}
                    ariaLabel={controlTitle}
                    title={controlTitle}
                    onClick={handleOnOpenClick}
                />
            )}
            <DataHistoryExplorerModal
                adapter={adapter}
                isOpen={isModalVisible}
                onDismiss={handleOnDismiss}
                timeSeriesTwins={defaultTimeSeriesTwinList}
                modalId={modalId}
            />
        </div>
    );
};

export default styled<
    IDataHistoryExplorerModalControlProps,
    IDataHistoryExplorerModalControlStyleProps,
    IDataHistoryExplorerModalControlStyles
>(DataHistoryExplorerModalControl, getStyles);
