
/**
 * The JSON-RPC interface.
 */

export const webpackServicePath = '/services/webpack-visulaizer';

export const WebpackVisualizer = Symbol('WebpackVisualizer');
export interface WebpackVisualizer {

    /**
     * Returns the dependency data
     */
    getDependencyData(confFile:string ): Promise<string | undefined>;

}