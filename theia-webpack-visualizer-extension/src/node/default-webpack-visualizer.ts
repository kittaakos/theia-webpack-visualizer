
import { injectable } from "inversify";
import { WebpackVisualizer } from "../common";
import URI from "@theia/core/lib/common/uri";

@injectable()
export class DefaultWebpackVisualizer implements WebpackVisualizer {

    async getDependencyData(confFileUri: string): Promise<string | undefined> {
       const selectedFile = new URI(confFileUri);
       return "{data:'"+ selectedFile +"'}";
    }
}