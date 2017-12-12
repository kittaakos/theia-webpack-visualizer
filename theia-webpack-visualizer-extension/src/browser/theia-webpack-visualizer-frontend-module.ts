import { ContainerModule } from 'inversify';
import { TheiaWebpackVisualizerCommandContribution, TheiaWebpackVisualizerMenuContribution } from './theia-webpack-visualizer-contribution';
import { CommandContribution, MenuContribution } from '@theia/core/lib/common';

export default new ContainerModule(bind => {
    bind(CommandContribution).to(TheiaWebpackVisualizerCommandContribution);
    bind(MenuContribution).to(TheiaWebpackVisualizerMenuContribution);
});
