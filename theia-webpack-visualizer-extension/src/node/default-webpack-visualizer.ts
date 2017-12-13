import * as path from 'path';
import * as webpack from 'webpack';
import { inject, injectable } from "inversify";
import { Compiler, MultiCompiler, Configuration, Plugin, Stats } from 'webpack';
import { FileUri } from '@theia/core/lib/node/file-uri';
import { WebpackVisualizer, VisualizerResult } from "../common";
import { FileSystem } from '@theia/filesystem/lib/common';

export const WebpackVisualizerPlugin: WebpackVisualizerPlugin & Plugin = require('webpack-visualizer-plugin');

export interface WebpackVisualizerPlugin {
    new(options?: WebpackVisualizerPlugin.Options): WebpackVisualizerPlugin;
    apply(compiler: Compiler | MultiCompiler): void;
}

export namespace WebpackVisualizerPlugin {
    export interface Options {
        filename: string
    }
}

@injectable()
export class DefaultWebpackVisualizer implements WebpackVisualizer {

    constructor( @inject(FileSystem) protected fileSystem: FileSystem) {
    }

    async visualizeDependency(webpackConfigFileUri: string): Promise<VisualizerResult> {
        const configuration: Configuration = require(FileUri.fsPath(webpackConfigFileUri));
        if (configuration.output === undefined || configuration.output.path === undefined) {
            return {
                success: false,
                message: 'Output location was not specified in the webpack configuration.'
            }
        }
        const outputPath = configuration.output.path;
        const compiler = webpack(configuration);
        const visualizer = new WebpackVisualizerPlugin();
        compiler.apply(visualizer);
        return new Promise<VisualizerResult>((resolve, reject) => {
            compiler.run(async (err: Error, stats: Stats) => {
                if (err) {
                    resolve(this.toResult(err));
                    return;
                }
                if (stats.hasErrors()) {
                    resolve({
                        success: false,
                        message: stats.toString('normal')
                    })
                    return;
                }
                const uri = FileUri.create(path.join(outputPath, 'stats.html'));
                try {

                } catch (error) {

                }
                try {
                    const html = (await this.fileSystem.resolveContent(uri.toString())).content;
                    resolve({
                        success: true,
                        html
                    });
                } catch (error) {
                    resolve(this.toResult(error));
                }
            });
        });
    }

    private toResult(error: Error): VisualizerResult {
        const { message, stack } = error;
        return {
            success: false,
            message,
            stack
        };
    }

}
