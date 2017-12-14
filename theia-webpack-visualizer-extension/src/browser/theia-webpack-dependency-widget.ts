import { injectable } from 'inversify';
import { h } from '@phosphor/virtualdom/lib';
import { VirtualWidget, VirtualRenderer } from '@theia/core/lib/browser';
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
        let child: h.Child | null = null;
        if (this._result) {
            if (this._result.success) {
                const frame = h.iframe({
                    height: '100%',
                    width: '99%',
                    src: this._result.url
                });
                child = h.div({ style: { height: 'inherit' } }, frame);
            } else {
                const className = 'webpack-visualizer-container';
                const children = [
                    h.div({ className }, 'Error occurred while calculating the dependencies.'),
                    h.div({ className }, this._result.message)
                ];
                if (this._result.stack) {
                    h.div({ className }, this._result.stack);
                }
                child = h.div({ className: 'webpack-visualizer-container' }, VirtualRenderer.flatten(children));
            }
        } else {
            const spinner = h.div({ className: 'fa fa-spinner fa-pulse fa-3x fa-fw' }, '');
            child = h.div({ className: 'webpack-visualizer-spinner-container' }, spinner);
        }
        return child;
    }

    set result(result: VisualizerResult | undefined) {
        this._result = result;
        this.update();
    }

}
