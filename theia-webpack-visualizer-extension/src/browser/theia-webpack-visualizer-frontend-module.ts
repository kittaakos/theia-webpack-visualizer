import { ContainerModule } from 'inversify';
import { TheiaWebpackVisualizerCommandContribution, TheiaWebpackVisualizerMenuContribution } from './theia-webpack-visualizer-contribution';
import { CommandContribution, MenuContribution } from '@theia/core/lib/common';
import { WebpackVisualizer, webpackServicePath} from "../common";
import { WebSocketConnectionProvider} from '@theia/core/lib/browser';

export default new ContainerModule(bind => {
    bind(CommandContribution).to(TheiaWebpackVisualizerCommandContribution);
    bind(MenuContribution).to(TheiaWebpackVisualizerMenuContribution);
    bind(WebpackVisualizer).toDynamicValue(ctx => {
        const provider = ctx.container.get(WebSocketConnectionProvider);
        return provider.createProxy<WebpackVisualizer>(webpackServicePath);
    }).inSingletonScope();
});
