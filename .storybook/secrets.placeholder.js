export const AuthenticationParameters = {
    adt: {
        hostUrl: 'ADT_INSTANCE_URL',
        aadParameters: {
            authority: 'AUTHORITY_PLACEHOLDER',
            clientId: 'CLIENTID_PLACEHOLDER',
            scope: 'SCOPE_PLACEHOLDER',
            redirectUri: 'REDIRECTURI_PLACEHOLDER',
            tenantId: 'TENANTID_PLACEHOLDER',
            uniqueObjectId: 'UNIQUE_OBJECTID_PLACEHOLDER'
        }
    },
    adx: {
        clusterUrl: 'ADX_CLUSTER_URL',
        databaseName: 'ADX_DATABASE_NAME_IN_CLUSTER',
        tableName: 'ADX_TABLE_NAME_IN_DATABASE',
        aadParameters: {
            authority: 'AUTHORITY_PLACEHOLDER',
            clientId: 'CLIENTID_PLACEHOLDER',
            scope: 'SCOPE_PLACEHOLDER',
            redirectUri: 'REDIRECTURI_PLACEHOLDER'
        }
    },
    storage: {
        blobContainerUrl: 'AZURE_STORAGE_BLOB_CONTAINER_URL',
        accountId: 'AZURE_STORAGE_ACCOUNT_ID',
        aadParameters: {
            authority: 'AUTHORITY_PLACEHOLDER',
            clientId: 'CLIENTID_PLACEHOLDER',
            scope: 'SCOPE_PLACEHOLDER',
            redirectUri: 'REDIRECTURI_PLACEHOLDER'
        }
    }
};
