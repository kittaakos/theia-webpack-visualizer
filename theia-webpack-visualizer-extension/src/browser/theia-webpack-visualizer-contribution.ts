import { injectable, inject } from "inversify";
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService } from "@theia/core/lib/common";
import { CommonMenus } from "@theia/core/lib/browser";
import { NAVIGATOR_CONTEXT_MENU } from "@theia/navigator/lib/browser/navigator-menu";

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
    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(TheiaWebpackVisualizerCommand, {
            execute: () => this.messageService.info('Hello World!')
        });
    }
}

@injectable()
export class TheiaWebpackVisualizerMenuContribution implements MenuContribution {

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(CommonMenus.EDIT_FIND, {
            commandId: TheiaWebpackVisualizerCommand.id,
            label: 'Show Webpack Dependency Graph'
        });
        menus.registerMenuAction(TheiaWebpackVisualizerContextMenu.SHOW, {
            commandId: TheiaWebpackVisualizerCommand.id
        })
    }
}