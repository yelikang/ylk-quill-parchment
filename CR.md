# blot关系
```mermaid
graph BT
    T[Blot interface]
    A[ShadowBlot] -->|implements| T
     B[ParentBlot] -->|extends| A
     C1[ScrollBlot] -->|extends| B
     C2[ContainerBlot] -->|extends| B
     C3[InlineBlot 内联墨渍] -->|extends| B
     C4[BlockBlot 块级墨渍] -->|extends| B

     D[LeafBlot] -->|extends| A
     E1[text] -->|extends| D
     E2[embed] -->|extends| D
   
```

# attributor
```mermaid
graph TD
    B1[ClassAttributor] --> A[Attributor]
    B2[StyleAttributor] --> A
    
    T[AttributorStore 包含多个attributor]
```

# 声明周期
```mermaid
graph TD
    A[调用Blot.create静态函数，创建domNode] --> B[调用Blot构造函数，创建blot实例]
    B --> C[将domNode、blot实例，通过key-value的形式，存储在scroll的registry中；后续通过scroll.find查找到blot]
```

# Registry
```js
class Registry {
    // 维护一个WeakMap，key为domNode，value为blot实例
    public static blots = new WeakMap<Node, Blot>();

    // 通过domNode查找blot实例
    public static find(node?: Node | null, bubble = false): Blot | null
}

```