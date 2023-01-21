/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * 该文件由脚本自动生成，如需修改请联系 PMC
 * This file generated by scripts of tdesign-api. `npm run api:docs Button React(PC) vitest,finalProject`
 * If you need to modify this file, contact PMC first please.
 */
import React from 'react';
import { fireEvent, vi, render } from '@test/utils';
import { Button } from '..';

describe('Button Component', () => {
  it('props.block works fine', () => {
    // block default value is false
    const { container: container1 } = render(<Button>Text</Button>);
    expect(container1.querySelector(`.${'t-size-full-width'}`)).toBeFalsy();
    // block = true
    const { container: container2 } = render(<Button block={true}>Text</Button>);
    expect(container2.firstChild).toHaveClass('t-size-full-width');
    expect(container2).toMatchSnapshot();
    // block = false
    const { container: container3 } = render(<Button block={false}>Text</Button>);
    expect(container3.querySelector(`.${'t-size-full-width'}`)).toBeFalsy();
    expect(container3).toMatchSnapshot();
  });

  it('props.children works fine', () => {
    const { container } = render(
      <Button>
        <span className="custom-node">TNode</span>
      </Button>,
    );
    expect(container.querySelector('.custom-node')).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('props.content works fine', () => {
    const { container } = render(<Button content={<span className="custom-node">TNode</span>}></Button>);
    expect(container.querySelector('.custom-node')).toBeTruthy();
    expect(container).toMatchSnapshot();
  });

  it('props.disabled works fine', () => {
    // disabled default value is false
    const { container: container1 } = render(<Button>Text</Button>);
    expect(container1.querySelector(`.${'t-is-disabled'}`)).toBeFalsy();
    // disabled = true
    const { container: container2 } = render(<Button disabled={true}>Text</Button>);
    expect(container2.firstChild).toHaveClass('t-is-disabled');
    expect(container2).toMatchSnapshot();
    // disabled = false
    const { container: container3 } = render(<Button disabled={false}>Text</Button>);
    expect(container3.querySelector(`.${'t-is-disabled'}`)).toBeFalsy();
    expect(container3).toMatchSnapshot();
  });

  it('props.ghost works fine', () => {
    // ghost default value is false
    const { container: container1 } = render(<Button>Text</Button>);
    expect(container1.querySelector(`.${'t-button--ghost'}`)).toBeFalsy();
    // ghost = true
    const { container: container2 } = render(<Button ghost={true}>Text</Button>);
    expect(container2.firstChild).toHaveClass('t-button--ghost');
    expect(container2).toMatchSnapshot();
    // ghost = false
    const { container: container3 } = render(<Button ghost={false}>Text</Button>);
    expect(container3.querySelector(`.${'t-button--ghost'}`)).toBeFalsy();
    expect(container3).toMatchSnapshot();
  });

  it('props.href works fine', () => {
    const { container } = render(<Button href="https://tdesign.tencent.com/">Text</Button>);
    expect(container.firstChild.getAttribute('href')).toBe('https://tdesign.tencent.com/');
    expect(container).toMatchSnapshot();
  });

  it('props.icon works fine', () => {
    const { container } = render(<Button icon={<span className="custom-node">TNode</span>}>Text</Button>);
    expect(container.querySelector('.custom-node')).toBeTruthy();
  });

  it('props.loading works fine', () => {
    // loading default value is false
    const { container: container1 } = render(<Button>Text</Button>);
    expect(container1.querySelector(`.${'t-is-loading'}`)).toBeFalsy();
    // loading = true
    const { container: container2 } = render(<Button loading={true}>Text</Button>);
    expect(container2.firstChild).toHaveClass('t-is-loading');
    expect(container2).toMatchSnapshot();
    // loading = false
    const { container: container3 } = render(<Button loading={false}>Text</Button>);
    expect(container3.querySelector(`.${'t-is-loading'}`)).toBeFalsy();
    expect(container3).toMatchSnapshot();
  });

  it('props.loading: Button contains element `.t-loading`', () => {
    // loading default value is false
    const { container } = render(<Button>Text</Button>);
    expect(container.querySelector('.t-loading')).toBeFalsy();
    // loading = false
    const { container: container1 } = render(<Button loading={false}>Text</Button>);
    expect(container1.querySelector('.t-loading')).toBeFalsy();
    // loading = true
    const { container: container2 } = render(<Button loading={true}>Text</Button>);
    expect(container2.querySelector('.t-loading')).toBeTruthy();
    expect(container2).toMatchSnapshot();
  });

  const shapeClassNameList = [
    { 't-button--shape-rectangle': false },
    't-button--shape-square',
    't-button--shape-round',
    't-button--shape-circle',
  ];
  ['rectangle', 'square', 'round', 'circle'].forEach((item, index) => {
    it(`props.shape is equal to ${item}`, () => {
      const { container } = render(<Button shape={item}>Text</Button>);
      if (typeof shapeClassNameList[index] === 'string') {
        expect(container.firstChild).toHaveClass(shapeClassNameList[index]);
      } else if (typeof shapeClassNameList[index] === 'object') {
        const classNameKey = Object.keys(shapeClassNameList[index])[0];
        expect(container.querySelector(`.${classNameKey}`)).toBeFalsy();
      }
      expect(container).toMatchSnapshot();
    });
  });

  const sizeClassNameList = ['t-size-s', { 't-size-m': false }, 't-size-l'];
  ['small', 'medium', 'large'].forEach((item, index) => {
    it(`props.size is equal to ${item}`, () => {
      const { container } = render(<Button size={item}>Text</Button>);
      if (typeof sizeClassNameList[index] === 'string') {
        expect(container.firstChild).toHaveClass(sizeClassNameList[index]);
      } else if (typeof sizeClassNameList[index] === 'object') {
        const classNameKey = Object.keys(sizeClassNameList[index])[0];
        expect(container.querySelector(`.${classNameKey}`)).toBeFalsy();
      }
      expect(container).toMatchSnapshot();
    });
  });

  it('props.suffix works fine', () => {
    const { container } = render(<Button suffix={<span className="custom-node">TNode</span>}>Text</Button>);
    expect(container.querySelector('.custom-node')).toBeTruthy();
  });

  const tagExpectedDom = ['button', 'a', 'div'];
  ['button', 'a', 'div'].forEach((item, index) => {
    it(`props.tag is equal to ${item}`, () => {
      const { container } = render(<Button tag={item}>Text</Button>);
      expect(container.querySelector(tagExpectedDom[index])).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
  });

  ['default', 'primary', 'danger', 'warning', 'success'].forEach((item) => {
    it(`props.theme is equal to ${item}`, () => {
      const { container } = render(<Button theme={item}>Text</Button>);
      expect(container.firstChild).toHaveClass(`t-button--theme-${item}`);
      expect(container).toMatchSnapshot();
    });
  });

  const attributeValues = ['submit', 'reset', 'button'];
  ['submit', 'reset', 'button'].forEach((item, index) => {
    it(`props.type is equal to ${item}`, () => {
      const { container } = render(<Button type={item}></Button>);
      expect(container.firstChild.getAttribute('type')).toBe(attributeValues[index]);
    });
  });

  ['base', 'outline', 'dashed', 'text'].forEach((item) => {
    it(`props.variant is equal to ${item}`, () => {
      const { container } = render(<Button variant={item}>Text</Button>);
      expect(container.firstChild).toHaveClass(`t-button--variant-${item}`);
      expect(container).toMatchSnapshot();
    });
  });

  it('events.click works fine', () => {
    const fn = vi.fn();
    const { container } = render(<Button onClick={fn}></Button>);
    fireEvent.click(container.firstChild);
    expect(fn).toHaveBeenCalled();
    expect(fn.mock.calls[0][0].stopPropagation).toBeTruthy();
    expect(fn.mock.calls[0][0].type).toBe('click');
  });
});
