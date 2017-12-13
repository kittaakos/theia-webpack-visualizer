import { injectable, inject } from "inversify";
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService, SelectionService } from "@theia/core/lib/common";
import { NAVIGATOR_CONTEXT_MENU } from "@theia/navigator/lib/browser/navigator-menu";
import { WebpackVisualizer } from "../common/index";
import { UriSelection } from '@theia/filesystem/lib/common/index';

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
        @inject(WebpackVisualizer) private readonly visualizer: WebpackVisualizer
    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(TheiaWebpackVisualizerCommand, {
            execute: async () => {
                const selection = this.selectionService.selection;
                if (UriSelection.is(selection)) {
                    const result = await this.visualizer.visualizeDependency(selection.uri.toString());
                    if (result.success) {
                        this.messageService.info(result.html.substring(0, 100));
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
