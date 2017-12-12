/**
 * Generated using theia-extension-generator
 */

import { TheiaWebpackVisualizerCommandContribution, TheiaWebpackVisualizerMenuContribution } from './theia-webpack-visualizer-contribution';
import {
    CommandContribution,
    MenuContribution
} from "@theia/core/lib/common";

import { ContainerModule } from "inversify";

export default new ContainerModule(bind => {
    // add your contribution bindings here
    
    bind(CommandContribution).to(TheiaWebpackVisualizerCommandContribution);
    bind(MenuContribution).to(TheiaWebpackVisualizerMenuContribution);
    
});