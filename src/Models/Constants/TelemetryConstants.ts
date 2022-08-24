/** The property names for custom properties in the payload */
export const CUSTOM_PROPERTY_NAMES = {
    /** region of the app (builder/viewer/etc.) */
    AppRegion: 'AppRegion',
    /** name of the emitting component */
    ComponentName: 'ComponentName',
    /** type of action (user, system, etc.) */
    TriggerType: 'TriggerType',
    /** hashed id of the scene */
    SceneHash: 'SceneHash'
};

/** Highest level sections of the app */
export enum AppRegion {
    Builder = 'Builder',
    SceneLobby = 'SceneLobby',
    Viewer = 'Viewer'
}

/** The type of gesture the user used, (click, hover, etc.) */
export enum Gesture {
    Click = 'Click',
    Hover = 'Hover'
}

/** the source of the event, was it from a user or an automated event based off of some condition */
export enum TelemetryTrigger {
    /** user initiated action */
    UserAction = 'UserAction',
    /** user initiated view */
    UserView = 'UserView',
    /** System initiated action */
    SystemAction = 'SystemAction'
}

/**
 * The high level component emitting the event
 * Keep it at the general level, no need to get overly specific.
 * Ex: SceneList, ElementForm, etc
 */
export enum ComponentName {
    BehaviorForm = 'BehaviorForm',
    BehaviorList = 'BehaviorList',
    ElementForm = 'ElementForm',
    ElementList = 'ElementList',
    SceneList = 'SceneList'
}

/**
 * The events the app can emit
 * Structure is like this:
 *  - App region (Builder/Viewer)
 *    - High level component (SceneList, ElementForm, etc)
 *      - User action/System action
 *        - Event/action
 *           - variant (ex: initiate, confirm, cancel)
 *           - eventName: the name of the beacon to emit
 *           - properties: names of the custom properties that the event will have attached to it
 */
export const TelemetryEvents = {
    Adapter: {
        /** scene load */
        SceneLoad: {
            SystemAction: {
                ParseConfiguration: {
                    eventName: 'ParseConfig.ConfigKpis',
                    properties: {
                        countScenes: 'countScenes',
                        countLayers: 'countLayers'
                    }
                },
                ParseScene: {
                    eventName: 'ParseConfig.SceneKpis',
                    properties: {
                        sceneHash: CUSTOM_PROPERTY_NAMES.SceneHash,
                        countBehaviors: 'countBehaviors',
                        countElements: 'countElements',
                        countAssets: 'countAssets',
                        hasCoordinates: 'hasCoordinates',
                        hasDescription: 'hasDescription',
                        pollingDelay: 'pollingDelay'
                    }
                },
                ParseElement: {
                    eventName: 'ParseConfig.ElementKpis',
                    properties: {
                        sceneHash: CUSTOM_PROPERTY_NAMES.SceneHash,
                        countMeshes: 'countMeshes',
                        countAliases: 'countAliases'
                    }
                },
                ParseBehavior: {
                    eventName: 'ParseConfig.BehaviorKpis',
                    properties: {
                        sceneHash: CUSTOM_PROPERTY_NAMES.SceneHash,
                        countElements: 'countElements',
                        countDataSources: 'countDataSources',
                        countWidgets: 'countWidgets',
                        countWidgetGaugeType: 'countWidgetGaugeType',
                        countWidgetLinkType: 'countWidgetLinkType',
                        countWidgetPropertyType: '',
                        countVisuals: 'countVisuals',
                        countVisualBadgeType: 'countVisualBadgeType',
                        countVisualColorType: 'countVisualColorType'
                    }
                }
            }
        }
    },
    /** builder section of the app */
    Builder: {
        /** scene list page */
        SceneList: {
            UserAction: {
                /** creating a new scene */
                CreateScene: {
                    Cancel: {
                        eventName: 'SceneList.CreateScene.Cancel'
                    },
                    Confirm: {
                        eventName: 'SceneList.CreateScene.Confirm',
                        properties: {
                            hasCoordinates: 'hasCoordinates',
                            hasDescription: 'hasDescription'
                        }
                    },
                    Initiate: {
                        eventName: 'SceneList.CreateScene.Initiate'
                    }
                },
                /** delete an existing scene */
                DeleteScene: {
                    Cancel: {
                        eventName: 'SceneList.DeleteScene.Cancel'
                    },
                    Confirm: {
                        eventName: 'SceneList.DeleteScene.Confirm'
                    },
                    Initiate: {
                        eventName: 'SceneList.DeleteScene.Initiate',
                        properties: {
                            itemIndex: 'itemIndex'
                        }
                    }
                },
                /** modify an existing scene */
                EditScene: {
                    Cancel: {
                        eventName: 'SceneList.EditScene.Confirm'
                    },
                    Confirm: {
                        eventName: 'SceneList.EditScene.Confirm'
                    },
                    Initiate: {
                        eventName: 'SceneList.EditScene.Initiate',
                        properties: {
                            itemIndex: 'itemIndex'
                        }
                    }
                },
                /** Select a scene from the list */
                SelectScene: {
                    eventName: 'SceneList.SelectScene'
                }
            }
        }
    },
    /** viewer section of the app */
    Viewer: {}
};

/**
 * The metrics the app can emit
 * Structure is like this:
 *  - App region (Builder/Viewer)
 *    - High level component (SceneList, ElementForm, etc)
 *      - User action/System metric
 *        - Event/action
 *           - eventName: the name of the beacon to emit
 *           - properties: names of the custom properties that the event will have attached to it
 */
export const TelemetryMetrics = { Adapter: {}, Builder: {}, Viewer: {} };
