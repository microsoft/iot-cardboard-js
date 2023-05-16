import { IPickerOption } from '../../../Components/Pickers/Internal/Picker.base.types';
import CoffeeRoasteryImgSrc from '../Components/Diagram/__mockData__/CoffeeRoastery.png';
import WasteWaterImgSrc from '../Components/Diagram/__mockData__/WasteWater.jpg';

// lets only keep constants that very high up level here, others can live in below their own component's types file
export const LOCAL_STORAGE_KEYS = {
    StoreList: {
        existingTargetDatabases: 'Legion.TargetDatabases'
    }
};

export const WIZARD_GRAPH_NODE_COLOR_OPTIONS: IPickerOption[] = [
    { id: 'blue', label: 'blue', item: '#33A1FD' },
    { id: 'green', label: 'green', item: '#26C485' },
    { id: 'yellow', label: 'yellow', item: '#FEE440' },
    { id: 'orange', label: 'orange', item: '#F79824' },
    { id: 'red', label: 'red', item: '#C32F27' },
    { id: 'pink', label: 'pink', item: '#EE92C2' }
];
export const WIZARD_GRAPH_NODE_ICON_OPTIONS: IPickerOption[] = [
    {
        id: 'FastForward',
        item: 'FastForward'
    },
    {
        id: 'Asterisk',
        item: 'Asterisk'
    },
    {
        id: 'Frigid',
        item: 'Frigid'
    },
    {
        id: 'RedEye',
        item: 'RedEye'
    },
    {
        id: 'Ringer',
        item: 'Ringer'
    },
    {
        id: 'Stopwatch',
        item: 'Stopwatch'
    },
    {
        id: 'SpeedHigh',
        item: 'SpeedHigh'
    },
    {
        id: 'Shield',
        item: 'Shield'
    },
    {
        id: 'Accept',
        item: 'Accept'
    },
    {
        id: 'Warning',
        item: 'Warning'
    },
    {
        id: 'Lightbulb',
        item: 'Lightbulb'
    }
];

export enum PID_EXTRACTED_PROPERTIES {
    PIDFilename = 'PID Filename',
    DetectedText = 'Detected Text',
    X = 'X',
    Y = 'Y',
    Width = 'Width',
    Height = 'Height',
    Confidence = 'Confidence'
}

export enum SourceType {
    Timeseries = 'Timeseries table',
    Diagram = 'P&ID diagram'
}

export enum PIDSources {
    CoffeeRoastery = 'Coffee Roastery',
    WasteWater = 'Waste Water'
}

export enum PIDSourceUrls {
    CoffeeRoastery = 'https://myPIDblob.com/CoffeeRoastery.jpg',
    WasteWater = 'https://myPIDblob.com/WasteWater.jpg'
}

export const PIDSourceUrlsToImgUrlMapping: Record<PIDSourceUrls, string> = {
    [PIDSourceUrls.CoffeeRoastery]: CoffeeRoasteryImgSrc,
    [PIDSourceUrls.WasteWater]: WasteWaterImgSrc
};
