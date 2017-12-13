import { injectable } from "inversify";
import { Compiler, MultiCompiler } from 'webpack';
import URI from "@theia/core/lib/common/uri";
import { WebpackVisualizer } from "../common";

export const WebpackVisualizerPlugin: WebpackVisualizerPlugin = require('webpack-visualizer-plugin');

@injectable()
export class DefaultWebpackVisualizer implements WebpackVisualizer {

    async getDependencyData(confFileUri: string): Promise<string | undefined> {
        const selectedFile = new URI(confFileUri);
        return "{data:'" + selectedFile.path + WebpackVisualizerPlugin + "'}";
    }
}

export interface WebpackVisualizerPlugin {
    new(options?: WebpackVisualizerPlugin.Options): WebpackVisualizerPlugin;
    apply(compiler: Compiler | MultiCompiler): void;
}

export namespace WebpackVisualizerPlugin {
    export interface Options {
        filename: string
    }    
}
