import { assert } from 'chai';
import { suite, test } from 'mocha-typescript';
import Analysis from '../../src/utils/Analysis';
import { parse } from '../../src/index';

const mock = require('mock-fs');

@suite('Inline Objstr Root Styles')
export class Test {

  @test 'Elements with root applied are tracked on attribute `class`'(){
    mock({
      'bar.block.css': '.root { color: red; } .foo { color: blue; }'
    });

    return parse(`
      import bar from 'bar.block.css';
      import objstr from 'obj-str';

      function render(){
        return ( <div class={objstr({ [bar]: true, foo: 'bar' })}></div> );
      }`
    ).then((analysis: Analysis) => {
      mock.restore();
      assert.equal(Object.keys(analysis.blocks).length, 1);
      assert.equal(analysis.stylesFound.size, 1);
    });
  }

  @test 'Root block styles may be applied with `.root` on attribute `class`'(){
    mock({
      'bar.block.css': '.root { color: red; } .foo { color: blue; }'
    });

    return parse(`
      import bar from 'bar.block.css'
      import objstr from 'obj-str';

      function render(){
        return ( <div class={objstr({ [bar.root]: true, foo: 'bar' })}></div> );
      }`
    ).then((analysis: Analysis) => {
      mock.restore();
      assert.equal(Object.keys(analysis.blocks).length, 1);
      assert.equal(analysis.stylesFound.size, 1);
    });
  }

  @test 'Elements with root applied are tracked on attribute `className`'(){
    mock({
      'bar.block.css': '.root { color: red; } .foo { color: blue; }'
    });

    return parse(`
      import bar from 'bar.block.css';
      import objstr from 'obj-str';

      function render(){
        return ( <div className={objstr({[bar]: true,foo: 'bar'})}></div> );
      }`
    ).then((analysis: Analysis) => {
      mock.restore();
      assert.equal(Object.keys(analysis.blocks).length, 1);
      assert.equal(analysis.stylesFound.size, 1);
    });
  }

  @test 'Root block styles may be applied with `.root` on attribute `className`'(){
    mock({
      'bar.block.css': '.root { color: red; } .foo { color: blue; }'
    });

    return parse(`
      import bar from 'bar.block.css';
      import objstr from 'obj-str';

      function render(){
        return ( <div className={objstr({ [bar.root]: true, foo: 'bar'})}></div> );
      }`
    ).then((analysis: Analysis) => {
      mock.restore();
      assert.equal(Object.keys(analysis.blocks).length, 1);
      assert.equal(analysis.stylesFound.size, 1);
    });
  }

  @test 'Root block styles are deduped if applied to multiple valid properties'(){
    mock({
      'bar.block.css': '.root { color: red; } .foo { color: blue; }'
    });

    return parse(`
      import bar from 'bar.block.css'
      import objstr from 'obj-str';

      function render(){
        return ( <div class={objstr({ [bar.root]: true, foo: 'bar' })} className={objstr({ [bar.root]: true, foo: 'bar' })}></div> );
      }`
    ).then((analysis: Analysis) => {
      mock.restore();
      assert.equal(Object.keys(analysis.blocks).length, 1);
      assert.equal(analysis.stylesFound.size, 1);
    });
  }

}
