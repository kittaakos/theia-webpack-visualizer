import { injectable } from 'inversify';
import { h } from '@phosphor/virtualdom/lib';
import { VirtualWidget } from '@theia/core/lib/browser/widgets/virtual-widget';

export const DEPENDENCY_WIDGET_FACTORY_ID = 'webpack-dependency-graph';

@injectable()
export class WebpackDependencyWidget extends VirtualWidget {

    private src: string | undefined;

    constructor() {
        super();
        this.id = DEPENDENCY_WIDGET_FACTORY_ID;
        this.title.label = 'Webpack Dependencies';
        this.title.closable = true;
        this.title.iconClass = 'fa fa-pie-chart';
        this.update();
    }

    render(): h.Child {
        const frame = h.iframe({
            height: '100%',
            width: '99%',
            // src: `data:text/html;charset=utf-8,${this.innerHTML || ''}`
            src: this.src || ''
        });
        return h.div({ id: 'frame-container', style: { height: 'inherit' } }, frame);
    }

    async setSource(src: string | undefined): Promise<void> {
        this.src = src;
        this.update();
    }

}