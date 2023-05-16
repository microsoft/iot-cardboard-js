import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { getDebugLogger } from '../../../../../../../../Models/Services/Utils';
import { IDiagramTabProps } from './DiagramTab.types';
import { useClassNames } from './DiagramTab.styles';
import { useEntities } from '../../../../../../Hooks/useEntities';
import { Kind } from '../../../../../../Models';
import Diagram from '../../../../../Diagram/Diagram';
import { TDiagramAnnotation } from '../../../../../Diagram/Diagram.types';
import {
    PIDSourceUrls,
    PIDSourceUrlsToImgUrlMapping,
    PID_EXTRACTED_PROPERTIES
} from '../../../../../../Models/Constants';
import { useTranslation } from 'react-i18next';
import { Dropdown, Label, Option, useId } from '@fluentui/react-components';

const debugLogging = false;
const logDebugConsole = getDebugLogger('DiagramTab', debugLogging);

const DiagramTab: React.FC<IDiagramTabProps> = (_props) => {
    // state
    const [diagramOptions, setDiagramOptions] = useState<Array<string>>([]);
    const [selectedDiagramUrl, setSelectedDiagramUrl] = useState<string>(null);

    // hooks
    const { t } = useTranslation();
    const diagramWrapperRef = useRef(null);
    const dropdownId = useId('diagram-selector');
    const { entities } = useEntities();
    const urlToEntitiesMapping = useMemo(
        () =>
            entities
                .filter((e) => e.type.kind === Kind.PID)
                .reduce((acc, e) => {
                    if (!acc[e.sourceConnectionString]) {
                        acc[e.sourceConnectionString] = [];
                    }
                    acc[e.sourceConnectionString].push(e);
                    return acc;
                }, {}),
        [entities]
    );
    const selectedAnnotations: Array<TDiagramAnnotation> = useMemo(
        () =>
            entities
                .filter((e) => e.sourceConnectionString === selectedDiagramUrl)
                .map((e) => ({
                    friendlyName: e.friendlyName,
                    type: e.type,
                    values: e.values,
                    isNew: e.isNew
                }))
                .reduce((acc: Array<TDiagramAnnotation>, e) => {
                    // filter out duplicate annotations
                    if (
                        acc.findIndex(
                            (a) =>
                                a.friendlyName === e.friendlyName &&
                                a.values[PID_EXTRACTED_PROPERTIES.X] ===
                                    e.values[PID_EXTRACTED_PROPERTIES.X] &&
                                a.values[PID_EXTRACTED_PROPERTIES.Y] ===
                                    e.values[PID_EXTRACTED_PROPERTIES.Y]
                        ) === -1
                    ) {
                        acc.push(e);
                    }
                    return acc;
                }, []),
        [entities, selectedDiagramUrl]
    );

    // callbacks
    const handleDiagramUrlChange = useCallback((_event, data) => {
        setSelectedDiagramUrl(data.optionText);
    }, []);
    const getImageUrl = useCallback((diagramUrl: string) => {
        if (
            Object.values(PIDSourceUrls).includes(diagramUrl as PIDSourceUrls)
        ) {
            return PIDSourceUrlsToImgUrlMapping[diagramUrl];
        } else {
            return diagramUrl;
        }
    }, []);

    // side effects
    useEffect(() => {
        const diagramUrls = Object.keys(urlToEntitiesMapping);
        setDiagramOptions(diagramUrls);
        setSelectedDiagramUrl(
            diagramUrls.length ? diagramUrls[diagramUrls.length - 1] : null
        );
    }, [urlToEntitiesMapping]);

    // styles
    const classNames = useClassNames();

    logDebugConsole('debug', 'Render');

    return (
        <div className={classNames.root}>
            <div className={classNames.diagramSelectorWrapper}>
                <Label id={dropdownId}>
                    {t('legionApp.Common.PIDSourcePlaceholder')}
                </Label>
                <Dropdown
                    className={classNames.diagramSelector}
                    aria-labelledby={dropdownId}
                    onOptionSelect={handleDiagramUrlChange}
                    value={selectedDiagramUrl}
                    defaultSelectedOptions={
                        selectedDiagramUrl ? [selectedDiagramUrl] : undefined
                    }
                    defaultValue={selectedDiagramUrl}
                    placeholder={t('loading')}
                >
                    {diagramOptions.map((option) => (
                        <Option key={option}>{option}</Option>
                    ))}
                </Dropdown>
            </div>
            <div ref={diagramWrapperRef} className={classNames.diagramWrapper}>
                <Diagram
                    key={selectedDiagramUrl}
                    parentRef={diagramWrapperRef}
                    imageUrl={getImageUrl(selectedDiagramUrl)}
                    annotations={selectedAnnotations}
                />
            </div>
        </div>
    );
};

export default DiagramTab;
