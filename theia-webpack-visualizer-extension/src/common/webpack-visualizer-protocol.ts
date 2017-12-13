/**
 * The JSON-RPC interface.
 */
export const webpackServicePath = '/services/webpack-visualizer';
export const WebpackVisualizer = Symbol('WebpackVisualizer');
export interface WebpackVisualizer {

    /**
     * Visualizes the `webpack` dependencies based on the given `webpack` configuration file.
     */
    visualizeDependency(webpackConfigFileUri: string): Promise<VisualizerResult>;

}

export type VisualizerResult = 
    { success: true, url: string } |
    { success: false, message: string, stack?: string };
