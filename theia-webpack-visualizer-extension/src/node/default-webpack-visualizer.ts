import * as crypto from 'crypto';
import * as http from 'http';
import * as express from 'express';
import * as path from 'path';
import * as webpack from 'webpack';
import { injectable } from "inversify";
import { Compiler, MultiCompiler, Configuration, Plugin, Stats } from 'webpack';
import { FileUri } from '@theia/core/lib/node/file-uri';
import { BackendApplicationContribution } from '@theia/core/lib/node/backend-application';
import { WebpackVisualizer, VisualizerResult } from "../common";

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
export class DefaultWebpackVisualizer implements WebpackVisualizer, BackendApplicationContribution {

    private app: express.Application | undefined;
    private server: http.Server | undefined;

    configure(app: express.Application): void {
        this.app = app;
    }

    onStart(server: http.Server): void {
        this.server = server;
    }

    async visualizeDependency(webpackConfigFileUri: string): Promise<VisualizerResult> {
        if (this.app === undefined || this.server === undefined) {
            throw new Error(`Backend configuration error.`)
        }
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
                const statPath = path.join(outputPath, 'stats.html');
                const statName = this.md5(webpackConfigFileUri);
                const { address, port } = this.server!.address();
                const url = `http://${address}:${port}/${statName}`;
                this.app!.get(`/${statName}`, (request, response) => response.sendFile(statPath));
                try {
                    resolve({
                        success: true,
                        url
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

    private md5(data: string): string {
        return crypto.createHash('md5').update(data).digest("hex")
    }

}
