const boardInfo = {
    "schema": "1.0",
    "layout": { "columns": 3 },
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
            "title": "Pasteurization Machine A03 Relationships",
            "size": { "rows": 4, "columns": 2 },
            "entities": [
                {
                    "id": "PasteurizationMachine_A03"
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
                    "id": "truck1",
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
        },
    ]
};

export default boardInfo;