export const mockTwin = {
    $dtId: 'LeoTheDog',
    $etag: 'W/"7cece777-dbf3-47ca-947e-5842ff8021fb"',
    CarName: 'Slaaaa',
    CarPackage: 'Basic',
    BatteryDeadState: false,
    Mileage: 18324,
    BatteryLevel: 92,
    BatteryCapacity: 75,
    WheelInformation: {
        leftFrontPressure: 42,
        rightFrontPressure: 43,
        leftRearPressure: 42,
        rightRearPressure: 44,
        tireSpecification: {
            tireModel: 'Standard',
            tireWidth: '18'
        }
    },
    address: {
        $metadata: {}
    },
    location: {
        $metadata: {}
    },
    $metadata: {
        $model: 'dtmi:com:cocrowle:teslamodely;1',
        CarName: {
            lastUpdateTime: '2021-08-09T20:51:23.7045803Z'
        }
    }
};

export const mockRelationship = {
    $relationshipId: '4690c125-aac8-4456-9203-298c93f5fcf0',
    $etag: 'W/"4215f07a-ed6e-4c8d-a516-d65715f207d9"',
    $sourceId: 'LeoTheDog',
    $relationshipName: 'chargedBy',
    $targetId: 'Windmill_1',
    lastChargedStation: 'Eugene Oregon Tesla Supercharger'
};

export const mockRelationshipPropertiesModel = {
    '@type': 'Relationship',
    name: 'chargedBy',
    minMultiplicity: 0,
    maxMultiplicity: 1,
    properties: [
        {
            '@type': 'Property',
            name: 'lastChargedStation',
            schema: 'string',
            writable: true
        }
    ]
};

export const mockMediaTwin = {
    $dtId: 'bimFile',
    $etag: '',
    $relationshipName: 'isMemberOf',
    $metadata: {
        $model: 'dtmi:com:niusoff:mediatwin;1'
    },
    MediaSrc: 'bimfilepath.com'
}

export const mockHasMemberRelationship = {
    $relationshipId: '',
    $sourceId: 'bimFile',
    $targetId: 'imAssetTwin'
}

