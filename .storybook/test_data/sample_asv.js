const windMillAst = {
    "version": "1.0",
    "schema": "1.0",
    "layout": { "rows": 3, "columns": 5 },
    "cards": [
        {
            "type": "LineChart",
            "title": "Production metrics",
            "size": { rows: 3, columns: 2 },
            "entities": [
                {
                    "id": "df4412c4-dba2-4a52-87af-780e78ff156b",
                    "properties": ["value"],
                    "chartDataOptions": [{ "includeDots": false }]
                }
            ]
        },
        {
            "type": "LineChart",
            "title": "Machine maintainers",
            "size": { rows: 2, columns: 2 },
            "entities": [
                {
                    "id": "Sensor_57",
                    "properties": ["Value"]
                }
            ]
        },
        {
            "type": "LineChart",
            "title": "Device connectivity",
            "entities": [
                {
                    "id": "Sensor_0",
                    "properties": ["Value"]
                }
            ]
        },
        {
            "type": "LineChart",
            "title": "Total production runs",
            "entities": [
                {
                    "id": "Sensor_0",
                    "properties": ["Value"]
                }
            ]
        },
        {
            "type": "LineChart",
            "title": "Asset information",
            "entities": [
                {
                    "id": "Sensor_0",
                    "properties": ["Value"]
                }
            ]
        },
        {
            "type": "LineChart",
            "title": "Key performance correlation",
            "size": { columns: 2 },
            "entities": [
                {
                    "id": "Sensor_0",
                    "properties": ["Value"]
                }
            ]
        }
    ]
}

export default windMillAst;