const data = {
    "schema": "0.0.1",
    "layout": { "rows": 5, "columns": 3 },
    "cards": [
        {
            "@type": "cb:com:azure:digitaltwins:process_graphic;1",
            "title": "Production metrics",
            "size": { "rows": 3, "columns": 2 },
            "properties": {
                "graphic": "<image-url>",
                "markers": [
                    {
                        "label": "Temperature",
                        "position": { "x": 200, "y": 450 },
                        "propertyId": "temperature"
                    },
                    {
                        "label": "Out flow",
                        "position": { "x": 200, "y": 450 },
                        "propertyId": "outflow"
                    },
                    {
                        "label": "In flow",
                        "position": { "x": 200, "y": 450 },
                        "propertyId": "inflow"
                    }
                ]
            }
        },
        {
            "@type": "table",
            "title": "Machine maintainers",
            "size": { "rows": 2, "columns": 2 },
            "properties": {
                "tableColumns": [
                    {
                        "header": "Maintainer",
                        "columnKey": "maintainer",
                        "sortable": true,
                        "contentType": "string"
                    },
                    {
                        "header": "Shift",
                        "columnKey": "shift"
                    }
                ]
            }
        },
        {
            "@type": "lkv",
            "title": "Total production runs",
            "position": { "row": 2, "column": 5 },
            "properties": {

            }
        }
    ]
};

export default data;