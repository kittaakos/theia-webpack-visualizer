import { injectable } from 'inversify';
import { h } from '@phosphor/virtualdom/lib';
import { VirtualWidget } from '@theia/core/lib/browser/widgets/virtual-widget';
import { VisualizerResult } from '../common/webpack-visualizer-protocol';

export const DEPENDENCY_WIDGET_FACTORY_ID = 'webpack-dependency-graph';

@injectable()
export class WebpackDependencyWidget extends VirtualWidget {

    private _result: VisualizerResult | undefined;

    constructor() {
        super();
        this.id = DEPENDENCY_WIDGET_FACTORY_ID;
        this.title.label = 'Webpack Dependencies';
        this.title.closable = true;
        this.title.iconClass = 'fa fa-pie-chart';
        this.update();
    }

    render(): h.Child {
        const src = this.src;
        const frame = h.iframe({
            height: '100%',
            width: '99%',
            src,
            style: {
                
            }
        });
        return h.div({ style: { height: 'inherit' } }, frame);
    }

    set result(result: VisualizerResult | undefined) {
        this._result = result;
        this.update();
    }

    private get src(): string {
        if (this._result) {
            if (this._result.success) {
                return this._result.url;
            } else {
                return `data:text/html;charset=utf-8,Error while calculating dependencies: ${this._result.message}`;
            }
        } else {
            return `data:text/html;charset=utf-8,Calculating webpack dependency graph...`;
        }
    }

}
