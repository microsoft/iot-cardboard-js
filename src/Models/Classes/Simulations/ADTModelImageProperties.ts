import {
    ADTModel_ImgPropertyPositions_PropertyName,
    ADTModel_ImgSrc_PropertyName,
    IADTModelImages
} from '../../Constants';

//TODO: Update below image src URLs with the links to the images under assets/images when codebase goes to public
const ADTModelImages: IADTModelImages = {
    'dtmi:assetGen:Car;1': {
        [ADTModel_ImgSrc_PropertyName]:
            'https://cardboardresources.blob.core.windows.net/cardboard-images/Car.png',
        [ADTModel_ImgPropertyPositions_PropertyName]: {
            OutdoorTemperature: { left: '70%', top: '5%' },
            Speed: { left: '80%', top: '40%' },
            OilPressure: { left: '30%', top: '70%' }
        }
    },
    'dtmi:assetGen:Windmill;1': {
        [ADTModel_ImgSrc_PropertyName]:
            'https://cardboardresources.blob.core.windows.net/cardboard-images/Windmill.png',
        [ADTModel_ImgPropertyPositions_PropertyName]: {
            OutdoorTemperature: { left: '80%', top: '5%' },
            AtmosphericPressure: { left: '0%', top: '5%' },
            WindVelocity: { left: '0%', top: '40%' },
            OilViscosity: { left: '50%', top: '40%' },
            BearingTemperature: { left: '45%', top: '70%' }
        }
    },
    'dtmi:assetGen:PasteurizationMachine;1': {
        [ADTModel_ImgSrc_PropertyName]:
            'https://cardboardresources.blob.core.windows.net/cardboard-images/Pasteurization.png',
        [ADTModel_ImgPropertyPositions_PropertyName]: {
            InFlow: { left: '20%', top: '40%' },
            OutFlow: { left: '50%', top: '40%' },
            Temperature: { left: '30%', top: '70%' },
            PercentFull: { left: '60%', top: '5%' }
        }
    },
    'dtmi:assetGen:HVACSystem;1': {
        [ADTModel_ImgSrc_PropertyName]:
            'https://cardboardresources.blob.core.windows.net/cardboard-images/HVAC.png',
        [ADTModel_ImgPropertyPositions_PropertyName]: {
            FanSpeed: { left: '80%', top: '5%' },
            CoolerTemperature: { left: '80%', top: '40%' },
            HeaterTemperature: { left: '30%', top: '70%' }
        }
    },
    'dtmi:assetGen:SaltMachine;1': {
        [ADTModel_ImgSrc_PropertyName]:
            'https://cardboardresources.blob.core.windows.net/cardboard-images/SaltMachine.png',
        [ADTModel_ImgPropertyPositions_PropertyName]: {
            InFlow: { left: '20%', top: '40%' },
            OutFlow: { left: '50%', top: '40%' }
        }
    },
    'dtmi:assetGen:MaintenancePersonnel;1': {
        [ADTModel_ImgSrc_PropertyName]:
            'https://cardboardresources.blob.core.windows.net/cardboard-images/MaintenancePersonnel.png',
        [ADTModel_ImgPropertyPositions_PropertyName]: {}
    },
    'dtmi:assetGen:Factory;1': {
        [ADTModel_ImgSrc_PropertyName]:
            'https://cardboardresources.blob.core.windows.net/cardboard-images/Factory.png',
        [ADTModel_ImgPropertyPositions_PropertyName]: {}
    },
    'dtmi:assetGen:Country;1': {
        [ADTModel_ImgSrc_PropertyName]:
            'https://cardboardresources.blob.core.windows.net/cardboard-images/Country.png',
        [ADTModel_ImgPropertyPositions_PropertyName]: {}
    }
};

export default ADTModelImages;
