
/**
 * loosly based on ionic/Storage
 */
export interface IAppSettings {
    /**
     * Get the value associated with the given key.
     * @param {any} key the key to identify this value
     * @returns {Promise} Returns a promise with the value of the given key
     */
    get(key: string): Promise<any>;
    /**
     * Set the value for the given key.
     * @param {any} key the key to identify this value
     * @param {any} value the value for this key
     * @returns {Promise} Returns a promise that resolves when the key and value are set
     */
    set(key: string, value: any): Promise<any>;
    /**
     * Remove any value associated with this key.
     * @param {any} key the key to identify this value
     * @returns {Promise} Returns a promise that resolves when the value is removed
     */
    remove(key: string): Promise<any>;
    /**
     * Clear the entire key value store. WARNING: HOT!
     * @returns {Promise} Returns a promise that resolves when the store is cleared
     */
    clear(): Promise<void>;
    /**
     * @returns {Promise} Returns a promise that resolves with the number of keys stored.
     */
    length(): Promise<number>;
    /**
     * @returns {Promise} Returns a promise that resolves with the keys in the store.
     */
    keys(): Promise<string[]>;
    /**
     * Iterate through each key,value pair.
     * @param {any} iteratorCallback a callback of the form (value, key, iterationNumber)
     * @returns {Promise} Returns a promise that resolves when the iteration has finished.
     */
    forEach(iteratorCallback: (value: any, key: string, iterationNumber: Number) => any): Promise<void>;
}
