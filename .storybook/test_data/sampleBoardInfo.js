export const SampleBoardInfo = {
    "schema": "1.0",
    "layout": { "numColumns": 3 },
    "cards": [
        {
            "key": "infoTable",
            "type": "InfoTable",
            "size": { "columns": 3 },
            "cardProperties": {
                "headers": ["Twin Name", "Model ID"]
            },
            "entities": [
                {
                    "tableRows": [["truck1", "dtmi:assetGen:CarTwin;1"]]
                }
            ]
        },
        {
            "key": "relationships",
            "type": "RelationshipsTable",
            "title": "Pasteurization Machine A01 Relationships",
            "size": { "rows": 4, "columns": 2 },
            "entities": [
                {
                    "id": "PasteurizationMachine_A01"
                }
            ]
        },
        {
            "key": "capacity",
            "type": "LKVProcessGraphicCard",
            "title": "Capacity",
            "size": { "rows": 2 },
            "entities": [
                {
                    "id": "CarTwin",
                    "properties": ["Speed", "OilPressure", "OutdoorTemperature"],
                    "imageSrc": "https://cardboardresources.blob.core.windows.net/cardboard-images/Car.png",
                    "chartDataOptions": {
                        "labelPositions": {
                            "Speed": { "left": '80%', "top": '5%' },
                            "OilPressure": { "left": '10%', "top": '40%' },
                            "OutdoorTemperature": { "left": '30%', "top": '70%' }
                        }
                    }
                }
            ]
        }
    ]
};

export const InvalidBoardInfo = {
    "schema": "1.0",
    "layout": { "numColumns": 3 },
    "cards": [
        {
            "key": "infoTable",
            "type": "InfoTable",
            "size": { "columns": 3 },
            "cardProperties": {
                "headers": ["Twin Name", "Model ID"]
            },
            "entities": [
                {
                    "tableRows": [["truck1", "dtmi:assetGen:Truck;1"]]
                }
            ]
        },
        {
            "key": "relationships",
            "type": "RelationshipsTable",
            "title": "Pasteurization Machine A01 Relationships",
            "size": { "rows": 4, "columns": 2 },
            "entities": [
                {
                    "id": "PasteurizationMachine_A01"
                }
            ]
        },
        {
            "key": "relationships",
            "type": "FakeCardType",
            "title": "Dummy title",
            "size": { "rows": 2 },
            "entities": [
                {
                    "id": "PasteurizationMachine_A01"
                }
            ]
        }
    ]
};