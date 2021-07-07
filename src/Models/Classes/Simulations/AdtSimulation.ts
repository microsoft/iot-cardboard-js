import { SimulationType } from '../../Constants/Enums';
import { DTwinUpdateEvent, SimulationParams } from '../../Constants/Interfaces';
import AssetSimulation from './AssetSimulation';

export default class AdtSimulation {
    private packetNumber: number;
    private interval: any;
    private client: ADTRequests; // TODO update to use adapter
    private infoBoxHTMLDiv: HTMLDivElement;

    constructor() {
        this.interval = null;
        this.packetNumber = 0;
        this.client = null;
        this.infoBoxHTMLDiv = null;
    }

    stopSimulation = () => {
        clearInterval(this.interval);
    };

    simulate(
        simType: SimulationType,
        clientString: string,
        params: SimulationParams,
        infoBoxHTMLDiv: any
    ) {
        const {
            daysToSimulate,
            dataSpacing,
            liveStreamFrequency,
            quickStreamFrequency,
            isLiveDataSimulated
        } = params;
        this.infoBoxHTMLDiv = infoBoxHTMLDiv;

        // Clear any prior interval
        clearInterval(this.interval);

        if (
            isNaN(daysToSimulate) ||
            isNaN(dataSpacing) ||
            isNaN(liveStreamFrequency) ||
            isNaN(quickStreamFrequency)
        ) {
            throw new Error('Input controls cannot be empty');
        }

        const Simulation = AssetSimulation;

        const startDateMillis =
            new Date().valueOf() - daysToSimulate * 86400000; // get starting date

        const startLiveSimulation = () => {
            const simulation = new Simulation(
                new Date().valueOf(),
                liveStreamFrequency
            );

            this.interval = setInterval(() => {
                this.pushEvents(simulation.tick());
            }, liveStreamFrequency);
        };

        const simulation = new Simulation(startDateMillis, dataSpacing);

        this.client = new ADTRequests(clientString);

        console.log('Beginning simulation @ ', new Date(startDateMillis));
        this.interval = setInterval(() => {
            // Clear interval if past now
            if (
                simulation.seedTimeMillis > new Date().valueOf() &&
                isLiveDataSimulated
            ) {
                console.log('Reached "now", beginning live simulation');
                clearInterval(this.interval);
                startLiveSimulation();
            }
            this.pushEvents(simulation.tick());
        }, quickStreamFrequency);
    }

    async pushEvents(events: Array<DTwinUpdateEvent>) {
        this.packetNumber++;
        try {
            const results: any = await this.client.updateTwins(events);

            (this.infoBoxHTMLDiv as HTMLDivElement).innerText = '';
            results.forEach((result: any) => {
                if (result.error) {
                    (this
                        .infoBoxHTMLDiv as HTMLDivElement).innerText += `-- Failed: ${result.error.code} - ${result.error.message} \n`;
                }
            });

            (this.infoBoxHTMLDiv as HTMLDivElement).innerText =
                '\n Message ' +
                this.packetNumber +
                '\n Payload example \n' +
                JSON.stringify(events);
        } catch (responses) {
            responses.forEach((response: any) => {
                (this
                    .infoBoxHTMLDiv as HTMLDivElement).innerText += `-- Failed: ${response.error.code} - ${response.error.message} \n`;
            });
        }
    }

    async createDTModels(clientString: string, isImagesIncluded: boolean) {
        this.client = new ADTRequests(clientString);
        let resultText: string;
        try {
            const assetSimulation = new AssetSimulation(0, 0); // constructor params are not used for this method
            const models = assetSimulation.generateDTModels(isImagesIncluded);
            const result: any = await (this.client as ADTRequests).createModels(
                models
            );
            if (result.error) {
                resultText = result.error.message;
            } else {
                resultText = models
                    .map((m) => `${m['@id']} created successfully`)
                    .join('\n');
            }
        } catch (error) {
            resultText =
                'Error \n' +
                (error.code
                    ? error.code + ': ' + error.message
                    : error.statusCode
                    ? error.statusCode + ': ' + error.message
                    : error);
        }
        return resultText;
    }

    async createDTwins(clientString: string, isImagesIncluded: boolean) {
        this.client = new ADTRequests(clientString);
        let resultText = '';
        try {
            const assetSimulation = new AssetSimulation(0, 0); // constructor params are not used for this method
            const twins = assetSimulation.generateDTwins(isImagesIncluded);
            const results: any = await (this.client as ADTRequests).createTwins(
                twins
            );
            results.forEach((result: any) => {
                if (result.error) {
                    resultText += `-- Failed: ${result.error.code} - ${result.error.message} \n`;
                } else {
                    resultText += `${result['$dtId']} created successfuly! \n`;
                }
            });
        } catch (responses) {
            responses.forEach((response: any) => {
                resultText += `-- Failed: ${response.error.code} - ${response.error.message} \n`;
            });
        }
        return resultText;
    }

    async createDTRelationships(clientString: string) {
        this.client = new ADTRequests(clientString);
        let resultText = '';
        try {
            const assetSimulation = new AssetSimulation(0, 0); // constructor params are not used for this method
            const relationships = assetSimulation.generateTwinRelationships();
            const results: any = await (this
                .client as ADTRequests).createRelationships(relationships);
            results.forEach((result: any) => {
                if (result.error) {
                    resultText += `-- Failed: ${result.error.code} - ${result.error.message} \n`;
                } else {
                    resultText += `${result['$relationshipId']} created successfuly! \n`;
                }
            });
        } catch (responses) {
            responses.forEach((response: any) => {
                resultText += `-- Failed: ${response.error.code} - ${response.error.message} \n`;
            });
        }
        return resultText;
    }
}
