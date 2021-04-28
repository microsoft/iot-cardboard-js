const windMillAst = {
    "version": "1.0",
    "schema": "1.0",
    "layout": { "rows": 7, "columns": 3 },
    "cards": [
        {
            "type": "InfoTable",
            "title": "Title Card",
            "size": { "rows": 1, "columns": 3 },
            "entities": [
                {
                    "properties": {
                        "headers": ['Twin Name', 'Model ID'],
                        "tableRows": [
                            ["sub_wind_gen", "dtmi:example:grid:transmission:generatorSubStation;1"]
                        ]
                    }
                }
            ]
        },
        {
            "type": "RelationshipsTable",
            "title": "Relationships Table",
            "size": { "rows": 6, "columns": 2 },
            "entities": [
                {
                    "id": "PasteurizationMachine_A03"
                }
            ]
        },
        {
            "type": "LKVProcessGraphicCard",
            "title": "Capacity",
            "size": { "rows": 4, "columns": 1 },
            "entities": [
                {
                    "id": "PasteurizationMachine_A03",
                    "properties": ["InFlow", "OutFlow", "Temperature"],
                    "chartDataOptions": {
                        "imageSrc": "https://cardboardresources.blob.core.windows.net/cardboard-images/Pasteurization.png",
                        "labelPositions": {
                            "InFlow": { "left": '80%', "top": '5%' },
                            "OutFlow": { "left": '10%', "top": '40%' },
                            "Temperature": { "left": '30%', "top": '70%' }
                        }
                    }
                }
            ]
        },
    ]
}

export default windMillAst;