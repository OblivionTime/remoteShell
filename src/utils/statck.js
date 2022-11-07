/*
 * @Description:
 * @Version: 1.0
 * @Autor: solid
 * @Date: 2022-08-26 16:32:57
 * @LastEditors: solid
 * @LastEditTime: 2022-08-26 16:34:09
 */
export class Stack {
    constructor () {
      this.items = []
    }
    // 返回的长度
    size () {
      return this.items.length
    }
    // 压栈(入栈)
    push (item) {
      this.items.push(item)
    }
    // 弹栈(出栈)
    pop () {
      return this.items.pop()
    }
    // 返回栈顶元素
    peek () {
      return this.items[this.items.length - 1]
    }
    // 清空栈
    clear () {
      this.items = []
    }
    // 判断是否空栈
    isEmpty () {
      return this.size() == 0
    }
  }
