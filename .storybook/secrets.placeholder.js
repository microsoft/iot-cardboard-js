export const AuthenticationParameters = {
    adt: {
        hostUrl: 'ADT_INSTANCE_URL',
        aadParameters: {
            login: 'LOGIN_URL_PLACEHOLDER',
            clientId: 'CLIENTID_PLACEHOLDER',
            tenantId: 'OPTIONAL_TENANTID_PLACEHOLDER'
        }
    },
    adx: {
        clusterUrl: 'ADX_CLUSTER_URL',
        databaseName: 'ADX_DATABASE_NAME_IN_CLUSTER',
        tableName: 'ADX_TABLE_NAME_IN_DATABASE',
        aadParameters: {
            login: 'LOGIN_URL_PLACEHOLDER',
            clientId: 'CLIENTID_PLACEHOLDER',
            tenantId: 'OPTIONAL_TENANTID_PLACEHOLDER'
        }
    },
    storage: {
        blobContainerUrl: 'AZURE_STORAGE_BLOB_CONTAINER_URL',
        accountId: 'AZURE_STORAGE_ACCOUNT_ID',
        aadParameters: {
            login: 'LOGIN_URL_PLACEHOLDER',
            clientId: 'CLIENTID_PLACEHOLDER',
            tenantId: 'OPTIONAL_TENANTID_PLACEHOLDER'
        }
    },
    powerBI: {
        embedUrl: 'POWERBI_EMBED_URL',
        pageName: 'POWERBI_PAGE_NAME',
        visualName: 'POWERBI_VISUAL_NAME'
    }
};
