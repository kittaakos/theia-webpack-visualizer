
import { injectable } from "inversify";
import { WebpackVisualizer } from "../common";
import URI from "@theia/core/lib/common/uri";

const Visualizer: any = require('webpack-visualizer-plugin');

@injectable()
export class DefaultWebpackVisualizer implements WebpackVisualizer {

    async getDependencyData(confFileUri: string): Promise<string | undefined> {
        const selectedFile = new URI(confFileUri);
        log(Visualizer);
        return "{data:'" + selectedFile.path + "'}";
    }
}