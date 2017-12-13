import { ContainerModule } from "inversify";
import { WebpackVisualizer, webpackServicePath } from "../common";
import { DefaultWebpackVisualizer } from "./";
import { ConnectionHandler, JsonRpcConnectionHandler } from '@theia/core/lib/common';
import { BackendApplicationContribution } from '@theia/core/lib/node/backend-application';

export default new ContainerModule(bind => {
    bind(DefaultWebpackVisualizer).toSelf().inSingletonScope();
    bind(BackendApplicationContribution).toDynamicValue(ctx => ctx.container.get(DefaultWebpackVisualizer)).inSingletonScope();
    bind(WebpackVisualizer).toDynamicValue(ctx =>
        ctx.container.get(DefaultWebpackVisualizer)
    ).inSingletonScope();

    bind(ConnectionHandler).toDynamicValue(ctx =>
        new JsonRpcConnectionHandler(webpackServicePath, () =>
            ctx.container.get(WebpackVisualizer)
        )
    ).inSingletonScope();
});