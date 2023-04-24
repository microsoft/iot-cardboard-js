// TEMP SCHEMA
interface MockEntity {
    id: string;
    type: 'System' | 'User';
    values: Array<{
        label: string;
        value: number | string | boolean;
    }>;
}

export const MOCK_ENTITIES: MockEntity[] = [
    {
        id: 'EntityId1',
        type: 'System',
        values: [
            {
                label: 'Temp',
                value: 22
            },
            {
                label: 'Pressure',
                value: 'High'
            },
            {
                label: 'NeedsRepairs',
                value: false
            }
        ]
    }
];
