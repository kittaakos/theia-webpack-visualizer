import { injectable, inject } from "inversify";
import { CommandContribution, CommandRegistry, MenuContribution, MenuModelRegistry, MessageService, SelectionService } from "@theia/core/lib/common";
import { NAVIGATOR_CONTEXT_MENU } from "@theia/navigator/lib/browser/navigator-menu";
import { WebpackVisualizer } from "../common/index";
import { UriSelection } from '@theia/filesystem/lib/common/index';
import { OpenerService } from "@theia/core/lib/browser";
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

    constructor(
        @inject(MessageService) private readonly messageService: MessageService,
        @inject(SelectionService) private readonly selectionService: SelectionService,
        @inject(OpenerService) private readonly openerService: OpenerService,
        @inject(WebpackVisualizer) private readonly webstatService: WebpackVisualizer
    ) { }

    registerCommands(registry: CommandRegistry): void {
        registry.registerCommand(TheiaWebpackVisualizerCommand, {
            execute: async () => {
                const selection = this.selectionService.selection
                if (UriSelection.is(selection)) {
                    const data = await this.webstatService.getDependencyData(selection.uri.toString());
                    if (data) {
                        this.messageService.info(data);
                        const toOpen = new URI('file://' + data)
                        this.openerService.getOpener(toOpen).then(opener => {
                           opener.open(toOpen)
                        })
                    }
                }
            },
            isEnabled:  ()=> {
                const selection = this.selectionService.selection
                if (UriSelection.is(selection)) {
                    return selection.uri.toString().toLowerCase().endsWith('webpack.config.js')
                }
                return false
            }
        });
    }
}

@injectable()
export class TheiaWebpackVisualizerMenuContribution implements MenuContribution {

    registerMenus(menus: MenuModelRegistry): void {
        menus.registerMenuAction(TheiaWebpackVisualizerContextMenu.SHOW, {
            commandId: TheiaWebpackVisualizerCommand.id
        })
    }
}