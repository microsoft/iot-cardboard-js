import { DTwin } from '../../Constants';
import {
    IBehavior,
    ICustomProperty,
    IExpressionRangeVisual,
    IPopoverVisual,
    ITwinToObjectMapping
} from '../../Types/Generated/3DScenesConfiguration-v1.0.0';

// #region ***** ELEMENTS *****

/** simple element, nothing special */
export const MOCK_ELEMENT_1: ITwinToObjectMapping = {
    id: 'MockElementId1',
    primaryTwinID: 'mockElementTwinId1',
    displayName: 'MockElement1',
    objectIDs: ['elementObject1', 'elementObject2'],
    type: 'TwinToObjectMapping'
};
/** simple element, nothing special */
export const MOCK_ELEMENT_2: ITwinToObjectMapping = {
    id: 'MockElementId2',
    primaryTwinID: 'mockElementTwinId2',
    displayName: 'MockElement2',
    objectIDs: ['elementObject2', 'elementObject3'],
    type: 'TwinToObjectMapping'
};
/** simple element, nothing special */
export const ALIASED_TWIN_ID_1 = 'aliasedTwinId1';
export const ALIASED_TWIN_ID_2 = 'aliasedTwinId2';
export const MOCK_ELEMENT_3_WITH_ALIASES: ITwinToObjectMapping = {
    id: 'MockElementId3',
    primaryTwinID: 'mockElementTwinId3',
    displayName: 'MockElement3',
    objectIDs: ['elementObject2', 'elementObject3'],
    twinAliases: {
        TestAlias1: ALIASED_TWIN_ID_1,
        TestAlias2: ALIASED_TWIN_ID_2
    },
    type: 'TwinToObjectMapping'
};
/** simple element, won't be included in the scene */
export const MOCK_ELEMENT_NOT_IN_SCENE: ITwinToObjectMapping = {
    id: 'MockElementId3',
    primaryTwinID: 'mockElementTwinId3',
    displayName: 'MockElement3',
    objectIDs: ['elementObject9'],
    type: 'TwinToObjectMapping'
};
/** custom element from a consumer */
export const CUSTOM_ELEMENT: ICustomProperty = {
    id: 'CustomElement1',
    primaryTwinID: 'customElementTwinId1',
    displayName: 'CustomElement1',
    objectIDs: ['object1', 'object2'],
    type: 'CustomProperty'
};

// #endregion

// #region ***** VISUALS *****

/** simple popover visual with a value range widget */
export const POPOVER_VISUAL_1: IPopoverVisual = {
    type: 'Popover',
    objectIDs: { expression: 'N/A' },
    title: 'Pop over visual 1',
    widgets: [
        {
            id: 'widgetId1',
            type: 'Gauge',
            valueExpression: 'PrimaryTwin.testProperty',
            widgetConfiguration: {
                label: 'My widget 1',
                valueRanges: [
                    {
                        id: 'valuerange1',
                        values: [0, 100],
                        visual: {
                            color: 'blue'
                        }
                    }
                ]
            }
        }
    ]
};
/** simple expression range visual with a single categorical range */
export const EXPRESSION_RANGE_CATEGORICAL_VISUAL_1: IExpressionRangeVisual = {
    type: 'ExpressionRangeVisual',
    expressionType: 'CategoricalValues',
    objectIDs: { expression: 'N/A' },
    valueExpression: 'PrimaryTwin.Temperature',
    valueRanges: [
        {
            id: 'valuerange1',
            values: [true],
            visual: {
                iconName: 'Frigid',
                color: '#d6940f',
                labelExpression: 'Temp too hot'
            }
        }
    ]
};
/** simple expression range visual with a single numeric range */
export const EXPRESSION_RANGE_NUMERIC_VISUAL_1: IExpressionRangeVisual = {
    type: 'ExpressionRangeVisual',
    expressionType: 'NumericRange',
    objectIDs: { expression: 'N/A' },
    valueExpression: 'PrimaryTwin.Temperature',
    valueRanges: [
        {
            id: 'valuerange1',
            values: [0, 100],
            visual: {
                color: 'blue'
            }
        }
    ]
};

// #endregion

// #region ***** BEHAVIORS *****

/**
 * behavior with element 1 as the only element
 * has visuals for popover and expression range categorical
 */
export const MOCK_BEHAVIOR_1: IBehavior = {
    id: 'mockBehavior1',
    displayName: 'Mock behavior 1',
    datasources: [
        {
            elementIDs: [MOCK_ELEMENT_1.id],
            type: 'ElementTwinToObjectMappingDataSource'
        }
    ],
    visuals: [POPOVER_VISUAL_1, EXPRESSION_RANGE_CATEGORICAL_VISUAL_1]
};
/**
 * behavior with multiple elements (1,2,not in scene), one is not in the default scene
 * has expression range visuals (categorical & numerical)
 */
export const MOCK_BEHAVIOR_2: IBehavior = {
    id: 'mockBehavior2',
    displayName: 'Mock behavior 2',
    datasources: [
        {
            elementIDs: [
                MOCK_ELEMENT_1.id,
                MOCK_ELEMENT_2.id,
                MOCK_ELEMENT_NOT_IN_SCENE.id
            ],
            type: 'ElementTwinToObjectMappingDataSource'
        }
    ],
    visuals: [
        EXPRESSION_RANGE_CATEGORICAL_VISUAL_1,
        EXPRESSION_RANGE_NUMERIC_VISUAL_1
    ]
};
/** behavior with elements, one is not in the default scene */
export const MOCK_BEHAVIOR_3: IBehavior = {
    id: 'mockBehavior3',
    displayName: 'Mock behavior 3',
    datasources: [
        {
            elementIDs: [MOCK_ELEMENT_2.id],
            type: 'ElementTwinToObjectMappingDataSource'
        }
    ],
    visuals: []
};

// #endregion

// #region ***** TWINS *****

/** twin data for a model that has InFlow & Outflow properties */
export const getTwinWithInFlowOutFlow = (twinId: string): DTwin => ({
    $dtId: twinId,
    $metadata: {
        $model: ''
    },
    InFlow: 60,
    OutFlow: 35
});
/** twin data for a model that has InFlow & PercentFull properties */
export const getTwinWithInFlowPercentFull = (twinId: string): DTwin => ({
    $dtId: twinId,
    $metadata: {
        $model: ''
    },
    InFlow: 60,
    PercentFull: 87
});
/** twin data for a model that has InFlow & Temperature properties */
export const getTwinWithTemperature = (twinId: string): DTwin => ({
    $dtId: twinId,
    $metadata: {
        $model: ''
    },
    Temperature: 99
});

// #endregion
