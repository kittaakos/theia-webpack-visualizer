import { injectable, inject } from "inversify";
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService } from "@theia/core/lib/common";
import { CommonMenus } from "@theia/core/lib/browser";

export const TheiaWebpackVisualizerCommand = {
    id: 'TheiaWebpackVisualizer.command',
    label: 'Show Webpack Dependency Graph'
};

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
    }
}