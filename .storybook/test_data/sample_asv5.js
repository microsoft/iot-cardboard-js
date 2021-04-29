const windMillAst = {
    "schema": "1.0",
    "layout": { "rows": 7, "columns": 3 },
    "cards": [
        {
            "key": "infoTable",
            "type": "InfoTable",
            "size": { "rows": 1, "columns": 3 },
            "cardProperties": {
                "headers": ['Twin Name', 'Model ID']
            }
        },
        {
            "key": "relationships",
            "type": "RelationshipsTable",
            "title": "Relationships Table",
            "size": { "rows": 6, "columns": 2 }
        },
        {
            "key": "capacity",
            "type": "LKVProcessGraphicCard",
            "title": "Capacity",
            "size": { "rows": 4, "columns": 1 },
            "entities": [
                {
                    "properties": ["InFlow", "OutFlow", "Temperature"],
                    "chartDataOptions": {
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