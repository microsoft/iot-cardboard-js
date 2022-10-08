import ViewerConfigUtility from '../Models/Classes/ViewerConfigUtility';
import {
    TelemetryEvents,
    TelemetryTrigger
} from '../Models/Constants/TelemetryConstants';
import { TelemetryEvent } from '../Models/Services/TelemetryService/Telemetry';
import TelemetryService from '../Models/Services/TelemetryService/TelemetryService';
import {
    createGUID,
    getDebugLogger,
    isDefined
} from '../Models/Services/Utils';
import {
    I3DScenesConfig,
    IBehavior,
    IElement,
    IScene,
    IVisual
} from '../Models/Types/Generated/3DScenesConfiguration-v1.0.0';

const debugLogging = false;
const logDebugConsole = getDebugLogger('BlobAdapterUtility', debugLogging);

export const LogConfigFileTelemetry = async (
    config: I3DScenesConfig
): Promise<void> => {
    const startTime = Date.now();

    const data = config?.configuration;
    if (!data) {
        logDebugConsole('warn', 'No config found to process telemetry for');
        return;
    }

    logDebugConsole(
        'info',
        '[START] Processing config telemetry. {config}',
        data
    );
    // capture the config level metrics
    sendConfigTelemetry(config);

    // loop all the scenes
    data.scenes.forEach((scene) => {
        const sceneHash = scene.id; // TODO: hash this value
        logDebugConsole(
            'debug',
            `[START] Processing scene ${scene.id} (hash: ${sceneHash})`
        );

        sendSceneTelemetry(scene, sceneHash);

        // emit events for each element
        scene.elements?.forEach((element) => {
            logDebugConsole(
                'debug',
                `[START] Processing element ${element.displayName} (id: ${element.id})`
            );
            sendElementTelemetry(element, sceneHash);
            logDebugConsole('debug', `[END] Processing element`);
        });

        const behaviors = ViewerConfigUtility.getBehaviorsInScene(
            config,
            scene.id
        );
        behaviors.forEach((behavior) => {
            logDebugConsole(
                'debug',
                `[START] Processing behavior ${behavior.displayName} (id: ${behavior.id})`
            );
            sendBehaviorTelemetry(behavior, sceneHash);
            logDebugConsole('debug', `[END] Processing behavior`);
        });

        logDebugConsole('debug', `[END] Processing scene`);
    });

    logDebugConsole(
        'info',
        `[END] Processing config telemetry. Elapsed time: ${
            (Date.now() - startTime) / 1000
        } seconds`
    );
};

/** send the KPI telemetry related to individual Behaviors */
function sendBehaviorTelemetry(behavior: IBehavior, sceneHash: string) {
    // handle the primitive properties
    const aliasCount = behavior.twinAliases?.length;
    const dataSourceCount = behavior.datasources?.length || 0;
    const elementDataSource = behavior.datasources.filter(
        ViewerConfigUtility.isElementTwinToObjectMappingDataSource
    )[0];
    const elementCount = elementDataSource
        ? elementDataSource.elementIDs?.length
        : 0;

    // loop the visuals
    const visuals = behavior.visuals || [];
    const visualStats = {
        totalCount: visuals.length,
        badgeCount: 0,
        colorCount: 0,
        widgets: {
            totalCount: 0,
            gaugeCount: 0,
            linkCount: 0,
            propertyCount: 0
        }
    };
    visuals.forEach((visual) => {
        if (ViewerConfigUtility.isPopoverVisual(visual)) {
            visualStats.widgets.totalCount = visual.widgets?.length;
            // loop through all the widgets in the popover
            visual.widgets?.forEach((widget) => {
                switch (widget.type) {
                    case 'Gauge':
                        visualStats.widgets.gaugeCount += 1;
                        break;
                    case 'Link':
                        visualStats.widgets.linkCount += 1;
                        break;
                    case 'Value':
                        visualStats.widgets.propertyCount += 1;
                        break;
                }
            });
        } else if (ViewerConfigUtility.isStatusColorVisual(visual)) {
            visualStats.colorCount += 1;
        } else if (ViewerConfigUtility.isAlertVisual(visual)) {
            visualStats.badgeCount += 1;
        }
    });

    // capture the Behavior level metrics
    const event = TelemetryEvents.Adapter.SceneLoad.SystemAction.ParseBehavior;
    TelemetryService.sendEvent(
        new TelemetryEvent({
            name: event.eventName,
            customProperties: {
                [event.properties.countAliases]: aliasCount,
                [event.properties.countDataSources]: dataSourceCount,
                [event.properties.countElements]: elementCount,
                [event.properties.countVisualBadgeType]: visualStats.badgeCount,
                [event.properties.countVisualColorType]: visualStats.colorCount,
                [event.properties.countVisuals]: visualStats.totalCount,
                [event.properties.countWidgetGaugeType]:
                    visualStats.widgets.gaugeCount,
                [event.properties.countWidgetLinkType]:
                    visualStats.widgets.linkCount,
                [event.properties.countWidgetPropertyType]:
                    visualStats.widgets.propertyCount,
                [event.properties.countWidgets]: visualStats.widgets.totalCount,
                [event.properties.parentSceneHash]: sceneHash
            },
            triggerType: TelemetryTrigger.SystemAction
        })
    );
}

/** send the KPI telemetry related to individual Elements */
function sendElementTelemetry(element: IElement, sceneHash: string) {
    const type = element.type;
    let meshCount = 0;
    let aliasCount = 0;
    // only capture the count when it's actually an 'element'
    if (ViewerConfigUtility.isTwinToObjectMappingElement(element)) {
        meshCount = element.objectIDs?.length;
        if (element.twinAliases) {
            aliasCount = Object.keys(element.twinAliases).length;
        }
    }

    // capture the Element level metrics
    const event = TelemetryEvents.Adapter.SceneLoad.SystemAction.ParseElement;
    TelemetryService.sendEvent(
        new TelemetryEvent({
            name: event.eventName,
            customProperties: {
                [event.properties.countAliases]: aliasCount,
                [event.properties.countMeshes]: meshCount,
                [event.properties.parentSceneHash]: sceneHash,
                [event.properties.elementType]: type
            },
            triggerType: TelemetryTrigger.SystemAction
        })
    );
}

/** send the KPI telemetry related to individual Scenes */
function sendSceneTelemetry(scene: IScene, sceneHash: string) {
    const assetCount = scene.assets?.length || 0;
    const behaviorsCount = scene.behaviorIDs?.length || 0;
    const elementCount = scene.elements?.length || 0;
    const hasCoordinates =
        isDefined(scene.latitude) || isDefined(scene.longitude) || false;
    const hasDescription = scene.description?.trim()?.length > 0;
    const scenePollingDelay =
        scene.pollingConfiguration?.minimumPollingFrequency;

    // capture the Scene level metrics
    const event = TelemetryEvents.Adapter.SceneLoad.SystemAction.ParseScene;
    TelemetryService.sendEvent(
        new TelemetryEvent({
            name: event.eventName,
            customProperties: {
                [event.properties.countAssets]: assetCount,
                [event.properties.countBehaviors]: behaviorsCount,
                [event.properties.countElements]: elementCount,
                [event.properties.hasCoordinates]: hasCoordinates,
                [event.properties.hasDescription]: hasDescription,
                [event.properties.pollingDelay]: scenePollingDelay,
                [event.properties.sceneHash]: sceneHash
            },
            triggerType: TelemetryTrigger.SystemAction
        })
    );
}

/** send the KPI telemetry related to the Config file as a whole */
function sendConfigTelemetry(data: I3DScenesConfig) {
    const event =
        TelemetryEvents.Adapter.SceneLoad.SystemAction.ParseConfiguration;
    TelemetryService.sendEvent(
        new TelemetryEvent({
            name: event.eventName,
            triggerType: TelemetryTrigger.SystemAction,
            customProperties: {
                [event.properties.countBehaviors]:
                    data.configuration.behaviors?.length || 0,
                [event.properties.countLayers]:
                    data.configuration.layers?.length || 0,
                [event.properties.countScenes]:
                    data.configuration.scenes?.length || 0
            }
        })
    );
}

/** Helper function to handle all schema migration transformations */
export function handleMigrations(data: I3DScenesConfig) {
    addVisualRuleIds(data?.configuration?.behaviors);
}

/** Helper function that adds temporary ids to visual rules in behaviors */
function addVisualRuleIds(data: IBehavior[]) {
    if (data) {
        data.forEach((behavior: IBehavior) => {
            if (behavior.visuals) {
                behavior.visuals.forEach((visual: IVisual) => {
                    if (visual.type === 'ExpressionRangeVisual' && !visual.id) {
                        visual.id = createGUID();
                    }
                });
            }
        });
    }
}
