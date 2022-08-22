/** Highest level sections of the app */
export enum AppRegion {
    Builder = 'Builder',
    SceneLobby = 'SceneLobby',
    Viewer = 'Viewer'
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
 *  - App section (Builder/Viewer)
 *    - High level component (SceneList, ElementForm, etc)
 *      - User action/System action
 *        - Event/action
 *           - variant (ex: initiate, confirm, cancel)
 *           - eventName: the name of the beacon to emit
 *           - properties: names of the custom properties that the event will have attached to it
 */
export const TelemetryEvents = {
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
                }
            }
        }
    }
};
