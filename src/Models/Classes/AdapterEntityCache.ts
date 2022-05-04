import { IAdapterData } from '../Constants';
import AdapterResult from './AdapterResult';

/**
 * Caches adapter results by entity ID and prevents concurrent requests for the same entity ID
 */
class AdapterEntityCache<T extends IAdapterData> {
    private maxAgeMs: number;
    private cachedEntities: Map<string, CachedEntity<T>> = new Map();

    /**
     * @param maxAgeMs The maximum age that a cached entity is allowed to be.  Any older and the cache is busted
     */
    constructor(maxAgeMs = 10000) {
        this.maxAgeMs = maxAgeMs;
    }

    /**
     * Retrieves an entity from the cache.  If the entity is stale, getEntityData will be executed to resolve the entity
     * @param key The key for the desired entity
     * @param getEntityData A function for retrieving the entity data.  Likely using an axios call wrapped in the adapter sandbox
     * @returns A promise that resolves the AdapterResult for the desired entity
     */
    getEntity(
        key: string,
        getEntityData: () => Promise<AdapterResult<T>>
    ): Promise<AdapterResult<T>> {
        const existingEntity = this.cachedEntities[key];
        if (!existingEntity || existingEntity.isStale(this.maxAgeMs)) {
            const newCachedEntity = new CachedEntity(getEntityData);
            this.cachedEntities[key] = newCachedEntity;
            return newCachedEntity.entityAdapterResultPromise;
        } else if (existingEntity.isGettingAdapterResult) {
            return existingEntity.entityAdapterResultPromise;
        } else {
            return new Promise<AdapterResult<T>>((resolve, _reject) => {
                setTimeout(() => resolve(existingEntity.entityAdapterResult));
            });
        }
    }
}

/**
 * A straightforward class leveraged by AdapterEntityCache to handle stale results and concurrent requests
 */
class CachedEntity<T extends IAdapterData> {
    public key: string;
    public getEntityData: () => Promise<AdapterResult<T>>;
    public entityAdapterResultPromise: Promise<AdapterResult<T>>;
    public entityAdapterResult: AdapterResult<T>;
    public isGettingAdapterResult = true;
    private createdTimeMs: number;

    constructor(getEntityData: () => Promise<AdapterResult<T>>) {
        this.getEntityData = getEntityData;
        this.getAdapterResult();
    }

    public isStale(maxAgeMs: number) {
        return this.createdTimeMs + maxAgeMs < new Date().valueOf();
    }

    private async getAdapterResult() {
        this.entityAdapterResultPromise = this.getEntityData();
        const entityAdapterResult = await this.entityAdapterResultPromise;
        this.isGettingAdapterResult = false;
        this.entityAdapterResult = entityAdapterResult;
        this.createdTimeMs = new Date().valueOf();
    }
}

export default AdapterEntityCache;
