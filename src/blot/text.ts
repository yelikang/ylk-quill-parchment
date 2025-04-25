import Scope from '../scope.js';
import type { Blot, Leaf, Root } from './abstract/blot.js';
import LeafBlot from './abstract/leaf.js';

class TextBlot extends LeafBlot implements Leaf {
  public static readonly blotName = 'text';
  public static scope = Scope.INLINE_BLOT;
  // 创建一个对应的 DOM node
  public static create(value: string): Text {
    return document.createTextNode(value);
  }

  public static value(domNode: Text): string {
    return domNode.data;
  }

  public domNode!: Text;
  protected text: string;

  constructor(scroll: Root, node: Node) {
    super(scroll, node);
    this.text = this.statics.value(this.domNode);
  }

  public deleteAt(index: number, length: number): void {
    this.domNode.data = this.text =
      this.text.slice(0, index) + this.text.slice(index + length);
  }

  public index(node: Node, offset: number): number {
    if (this.domNode === node) {
      return offset;
    }
    return -1;
  }

  public insertAt(index: number, value: string, def?: any): void {
    if (def == null) {
      this.text = this.text.slice(0, index) + value + this.text.slice(index);
      this.domNode.data = this.text;
    } else {
      super.insertAt(index, value, def);
    }
  }

  /**
   * 对于叶子节点，代表 blot 的 value() 返回值；
   * 对于父容器节点，代表子节点的 values 总和。
   * @returns 
   */
  public length(): number {
    return this.text.length;
  }

  public optimize(context: { [key: string]: any }): void {
    super.optimize(context);
    this.text = this.statics.value(this.domNode);
    if (this.text.length === 0) {
      this.remove();
    } else if (this.next instanceof TextBlot && this.next.prev === this) {
      this.insertAt(this.length(), (this.next as TextBlot).value());
      this.next.remove();
    }
  }

  public position(index: number, _inclusive = false): [Node, number] {
    return [this.domNode, index];
  }

  public split(index: number, force = false): Blot | null {
    if (!force) {
      if (index === 0) {
        return this;
      }
      if (index === this.length()) {
        return this.next;
      }
    }
    const after = this.scroll.create(this.domNode.splitText(index));
    this.parent.insertBefore(after, this.next || undefined);
    this.text = this.statics.value(this.domNode);
    return after;
  }

  /**
   * blot更新时，触发update
   * @param mutations 
   * @param _context 
   */
  public update(
    mutations: MutationRecord[],
    _context: { [key: string]: any },
  ): void {
    if (
      mutations.some((mutation) => {
        return (
          mutation.type === 'characterData' && mutation.target === this.domNode
        );
      })
    ) {
      // TextBlot进行更新时，只获取domNode的文本内容赋值给text即可
      this.text = this.statics.value(this.domNode);
    }
  }

  public value(): string {
    return this.text;
  }
}

export default TextBlot;
