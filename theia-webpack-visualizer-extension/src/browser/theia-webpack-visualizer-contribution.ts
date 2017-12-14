import { injectable, inject } from 'inversify';
import { CommandContribution, CommandRegistry } from '@theia/core/lib/common';
import { DirNode, FileNode, FileDialogFactory } from '@theia/filesystem/lib/browser';
import { FileSystem } from '@theia/filesystem/lib/common';
import { WidgetManager } from '@theia/core/lib/browser/widget-manager';
import { NAVIGATOR_CONTEXT_MENU } from '@theia/navigator/lib/browser/navigator-menu';
import { WebpackVisualizer } from '../common/index';
import { WebpackDependencyWidget, DEPENDENCY_WIDGET_FACTORY_ID } from './theia-webpack-dependency-widget';
import { FrontendApplication } from '@theia/core/lib/browser';
import { VisualizerResult } from '../common/webpack-visualizer-protocol';
import { WorkspaceService } from '@theia/workspace/lib/browser/workspace-service';
import { LabelProvider } from "@theia/core/lib/browser/label-provider";
import URI from "@theia/core/lib/common/uri";

export const TheiaWebpackVisualizerCommand = {
    id: 'TheiaWebpackVisualizer.command',
    label: 'Show Webpack Dependency Graph'
};

export namespace TheiaWebpackVisualizerContextMenu {
    export const SHOW = [...NAVIGATOR_CONTEXT_MENU, '5_show'];
}

@injectable()
export class TheiaWebpackVisualizerCommandContribution implements CommandContribution {

    private rootUri: string | undefined;

    constructor(
        @inject(WorkspaceService) private readonly workspaceService: WorkspaceService,
        @inject(FileSystem) private readonly fileSystem: FileSystem,
        @inject(LabelProvider) private readonly labelProvider: LabelProvider,
        @inject(FileDialogFactory) private readonly fileDialogFactory: FileDialogFactory,
        @inject(WebpackVisualizer) private readonly visualizer: WebpackVisualizer,
        @inject(WidgetManager) private readonly widgetManager: WidgetManager,
        @inject(FrontendApplication) private readonly app: FrontendApplication,
    ) {
        this.workspaceService.root.then(stat => {
            if (stat) {
                this.rootUri = stat.uri;
            }
        })
    }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(TheiaWebpackVisualizerCommand, {
            execute: async () => {
                const rootUri = new URI(this.rootUri);
                const rootStat = await this.fileSystem.getFileStat(rootUri.toString());
                const name = this.labelProvider.getName(rootUri);
                const label = await this.labelProvider.getIcon(rootStat);
                const rootNode = DirNode.createRoot(rootStat, name, label);
                const dialog = this.fileDialogFactory({ title: 'Select a webpack configuration file...' });
                dialog.model.navigateTo(rootNode);
                const node = await dialog.open();
                if (FileNode.is(node)) {
                    const dependencyWidget = await this.widgetManager.getOrCreateWidget<WebpackDependencyWidget>(DEPENDENCY_WIDGET_FACTORY_ID);
                    const updateContent = (result: VisualizerResult | undefined) => {
                        if (dependencyWidget.isAttached) {
                            this.app.shell.activateMain(dependencyWidget.id);
                        } else {
                            this.app.shell.addToMainArea(dependencyWidget);
                        }
                        setTimeout(() => dependencyWidget.result = result, 0);
                    }
                    updateContent(undefined);
                    updateContent(await this.visualizer.visualizeDependency(node.fileStat.uri));
                }
            },
            isEnabled: () => {
                return this.rootUri !== undefined;
            }
        });
    }
}