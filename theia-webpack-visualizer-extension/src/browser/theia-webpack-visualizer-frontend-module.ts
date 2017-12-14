import { ContainerModule } from 'inversify';
import { TheiaWebpackVisualizerCommandContribution } from './theia-webpack-visualizer-contribution';
import { CommandContribution } from '@theia/core/lib/common';
import { WebpackVisualizer, webpackServicePath} from '../common';
import { WebSocketConnectionProvider, WidgetFactory} from '@theia/core/lib/browser';
import { DEPENDENCY_WIDGET_FACTORY_ID, WebpackDependencyWidget } from './theia-webpack-dependency-widget';

import '../../src/browser/style/index.css';

export default new ContainerModule(bind => {
    bind(CommandContribution).to(TheiaWebpackVisualizerCommandContribution);
    bind(WebpackVisualizer).toDynamicValue(ctx => {
        const provider = ctx.container.get(WebSocketConnectionProvider);
        return provider.createProxy<WebpackVisualizer>(webpackServicePath);
    }).inSingletonScope();
    bind(WebpackDependencyWidget).toSelf();
    bind(WidgetFactory).toDynamicValue(context => ({
        id: DEPENDENCY_WIDGET_FACTORY_ID,
        createWidget: () => context.container.get<WebpackDependencyWidget>(WebpackDependencyWidget)
    }));
});
