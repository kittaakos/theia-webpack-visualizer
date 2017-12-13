import 'mocha';
import { expect, assert} from 'chai';
import { DefaultWebpackVisualizer } from './default-webpack-visualizer';

describe('webpack-visualizer', () => {

    it('generate', async () => {
        const vis = new DefaultWebpackVisualizer;
        const result =  await vis.getDependencyData('test')
        assert(result == "{data:'test'}", 'Wrong result');
    });

    it('bumm!', () => {
        expect(true).to.be.true;
    });

});
