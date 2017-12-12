
import { injectable } from "inversify";
import { WebpackVisualizer } from "../common";

@injectable()
export class DefaultWebpackVisualizer implements WebpackVisualizer {

    getDependencyData(confFile: string): Promise<string | undefined> {
       return Promise.resolve("{data:'maydata'}");
    }
}