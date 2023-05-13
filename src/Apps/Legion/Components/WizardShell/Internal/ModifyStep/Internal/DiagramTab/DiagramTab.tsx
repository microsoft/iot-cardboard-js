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
import { Dropdown, IDropdownOption } from '@fluentui/react';
import { useTranslation } from 'react-i18next';

const debugLogging = false;
const logDebugConsole = getDebugLogger('DiagramTab', debugLogging);

const DiagramTab: React.FC<IDiagramTabProps> = (_props) => {
    // state
    const [diagramOptions, setDiagramOptions] = useState<
        Array<IDropdownOption>
    >([]);
    const [selectedDiagramUrl, setSelectedDiagramUrl] = useState<string>(null);
    const [selectedAnnotations, setSelectedAnnotations] = useState<
        Array<TDiagramAnnotation>
    >([]);

    // hooks
    const { t } = useTranslation();
    const diagramWrapperRef = useRef(null);
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

    // callbacks
    const handleDiagramUrlChange = useCallback(
        (_event, option: IDropdownOption) => {
            setSelectedDiagramUrl(option.text);
        },
        []
    );
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
        setDiagramOptions(
            diagramUrls.map((url) => ({
                key: url,
                text: url
            }))
        );
        setSelectedDiagramUrl(
            diagramUrls.length ? diagramUrls[diagramUrls.length - 1] : null
        );
    }, [urlToEntitiesMapping]);

    useEffect(() => {
        setSelectedAnnotations(
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
                }, [])
        );
    }, [entities, selectedDiagramUrl]);

    // styles
    const classNames = useClassNames();

    logDebugConsole('debug', 'Render');

    return (
        <div className={classNames.root}>
            <Dropdown
                label={t('legionApp.Common.PIDSourcePlaceholder')}
                className={classNames.diagramSelector}
                options={diagramOptions}
                onChange={handleDiagramUrlChange}
                selectedKey={selectedDiagramUrl}
                placeholder={t('loading')}
            />
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
