import { IADTModelImages } from '../../Constants/Interfaces';

//TODO: Update below image src URLs with the links to the images under assets/images when codebase goes to public
const ADTModelImages: IADTModelImages = {
    'dtmi:assetGen:Car;1': {
        img_src:
            'https://cardboardresources.blob.core.windows.net/cardboard-images/Car.png',
        img_propertyPositions: {
            OutdoorTemperature: { left: '70%', top: '5%' },
            Speed: { left: '80%', top: '40%' },
            OilPressure: { left: '30%', top: '70%' }
        }
    },
    'dtmi:assetGen:Windmill;1': {
        img_src:
            'https://cardboardresources.blob.core.windows.net/cardboard-images/Windmill.png',
        img_propertyPositions: {
            OutdoorTemperature: { left: '80%', top: '5%' },
            AtmosphericPressure: { left: '0%', top: '5%' },
            WindVelocity: { left: '0%', top: '40%' },
            OilViscosity: { left: '50%', top: '40%' },
            BearingTemperature: { left: '45%', top: '70%' }
        }
    },
    'dtmi:assetGen:PasteurizationMachine;1': {
        img_src:
            'https://cardboardresources.blob.core.windows.net/cardboard-images/Pasteurization.png',
        img_propertyPositions: {
            InFlow: { left: '20%', top: '40%' },
            OutFlow: { left: '50%', top: '40%' },
            Temperature: { left: '30%', top: '70%' },
            PercentFull: { left: '60%', top: '5%' }
        }
    },
    'dtmi:assetGen:HVACSystem;1': {
        img_src:
            'https://cardboardresources.blob.core.windows.net/cardboard-images/HVAC.png',
        img_propertyPositions: {
            FanSpeed: { left: '80%', top: '5%' },
            CoolerTemperature: { left: '80%', top: '40%' },
            HeaterTemperature: { left: '30%', top: '70%' }
        }
    },
    'dtmi:assetGen:SaltMachine;1': {
        img_src:
            'https://cardboardresources.blob.core.windows.net/cardboard-images/SaltMachine.png',
        img_propertyPositions: {
            InFlow: { left: '20%', top: '40%' },
            OutFlow: { left: '50%', top: '40%' }
        }
    },
    'dtmi:assetGen:MaintenancePersonnel;1': {
        img_src:
            'https://cardboardresources.blob.core.windows.net/cardboard-images/MaintenancePersonnel.png',
        img_propertyPositions: {}
    },
    'dtmi:assetGen:Factory;1': {
        img_src:
            'https://cardboardresources.blob.core.windows.net/cardboard-images/Factory.png',
        img_propertyPositions: {}
    },
    'dtmi:assetGen:Country;1': {
        img_src:
            'https://cardboardresources.blob.core.windows.net/cardboard-images/Country.png',
        img_propertyPositions: {}
    }
};

export default ADTModelImages;
