import { injectable, inject } from 'inversify';
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService, SelectionService } from '@theia/core/lib/common';
import { UriSelection } from '@theia/filesystem/lib/common/index';
import { WidgetManager } from '@theia/core/lib/browser/widget-manager';
import { NAVIGATOR_CONTEXT_MENU } from '@theia/navigator/lib/browser/navigator-menu';
import { WebpackVisualizer } from '../common/index';
import { WebpackDependencyWidget, DEPENDENCY_WIDGET_FACTORY_ID } from './theia-webpack-dependency-widget';
import { FrontendApplication } from '@theia/core/lib/browser';
import { setTimeout } from 'timers';

export const TheiaWebpackVisualizerCommand = {
    id: 'TheiaWebpackVisualizer.command',
    label: 'Show Webpack Dependency Graph'
};

export namespace TheiaWebpackVisualizerContextMenu {
    export const SHOW = [...NAVIGATOR_CONTEXT_MENU, '5_show'];
}

@injectable()
export class TheiaWebpackVisualizerCommandContribution implements CommandContribution {

    constructor(
        @inject(MessageService) private readonly messageService: MessageService,
        @inject(SelectionService) private readonly selectionService: SelectionService,
        @inject(WebpackVisualizer) private readonly visualizer: WebpackVisualizer,
        @inject(WidgetManager) private readonly widgetManager: WidgetManager,
        @inject(FrontendApplication) private readonly app: FrontendApplication,
    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(TheiaWebpackVisualizerCommand, {
            execute: async () => {
                const selection = this.selectionService.selection;
                if (UriSelection.is(selection)) {
                    const result = await this.visualizer.visualizeDependency(selection.uri.toString());
                    if (result.success) {
                        const dependencyWidget = await this.widgetManager.getOrCreateWidget<WebpackDependencyWidget>(DEPENDENCY_WIDGET_FACTORY_ID);
                        if (dependencyWidget.isAttached) {
                            this.app.shell.activateMain(dependencyWidget.id);
                        } else {
                            this.app.shell.addToMainArea(dependencyWidget);
                        }
                        setTimeout(() => dependencyWidget.setSource(result.url), 0);
                    } else {
                        this.messageService.error(result.message);
                    }
                }
            },
            isEnabled: () => {
                const selection = this.selectionService.selection;
                if (UriSelection.is(selection)) {
                    return selection.uri.toString().toLowerCase().endsWith('webpack.config.js');
                }
                return false;
            }
        });
    }
}

@injectable()
export class TheiaWebpackVisualizerMenuContribution implements MenuContribution {

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(TheiaWebpackVisualizerContextMenu.SHOW, {
            commandId: TheiaWebpackVisualizerCommand.id
        });
    }

}
