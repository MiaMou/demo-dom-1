// 提供一个全局对象
window.dom = {
    // create: function() {}
    // 最简化，第一个API, 创建一个节点
    // create(tagName) {
    //     return document.createElement(tagName)
    // } 
    create(string) {
        // const container = document.createElement('div')
        // "template"可以容纳任意元素 ，但不能通过children拿
        const container = document.createElement("template")
        container.innerHTML = string.trim()   // trim可以去掉字符串两边的空格
        // return container.children[0]
        return container.content.firstChild
    },
    // 在node节点后面新增一个节点node2，新增弟弟
    after(node, node2) {
        // 没有在后面插入的API，有insertBefore在前面插入的API,利用这个
        // 在node节点后面插入一个节点node2 相当于在node后面节点的前面插node2
        node.parentNode.insertBefore(node2, node.nextSibling)
        // 在node后面插node2 相当于在 node.nextSibling前面插node2
    },
    // 在node前面新增一个节点node2，新增哥哥
    before(node, node2) {
        node.parentNode.insertBefore(node2, node)
    },
    // 在一个节点parent里面新增儿子node
    append(parent, node) {
        parent.appendChild(node)
    },
    // 新增爸爸，在一个节点node外面加一个节点parent
    wrap(node, parent) {
        // 先变兄弟，再变爸爸
        dom.before(node, parent)  
        dom.append(parent, node)
    },

    // 删除节点自己
    remove(node) {
        node.parentNode.removeChild(node)
        return node   // 返回删掉的节点
    },
    // 删除节点后代
    empty(node) {
        // const childNodes = node.childNodes
        const {childNodes} = node    // 高级语法，简写版，直接从node获取childNodes
        const array = []
        let x = node.firstChild
        while(x){
            array.push(dom.remove(node.firstChild)) //遍历 删除 返回
            x = node.firstChild
        }
        return array
    },

    // 改节点的属性
    attr(node, name, value) {   // 重载：根据参数个数写不同的代码
        if(arguments.length === 3){   // JS可以设置参数个数，3个参数实现了写，设置属性值
            node.setAttribute(name, value)
        }else if(arguments.length === 2){    // 2个参数实现了读属性，并返回属性值
            return node.getAttribute(name)
        }
    },
    // 改节点的文字内容
    text(node, string) {      // 适配
        if(arguments.length === 2){
            if('innerText' in node){
                node.innerText = string   // ie
            }else{
                node.textContent = string  // chrome/firefox
            } 
        }else if(arguments.length === 1){
            if('innerText' in node){
                return node.innerText
            }else{
                return node.textContent
            } 
        }           
    },
    // 改html
    html(node, string){   // 参数===2，设置；参数===1，读取
        if(arguments.length === 2){
            node.innerHTML = string
        }else if(arguments.length === 1){
            return node.innerHTML
        }    
    },
    // 修改style
    style(node, name, value) {
        if(arguments.length === 3){
            // dom.style(div, 'color', 'red') 三个参数说明是写style
            node.style[name] = value
        }else if(arguments.length === 2){
            if(typeof name === 'string'){
                // dom.style(div, 'color') 两个参数，且参数是字符串，说明是想读属性
                // 获取这个div里面的color
                return node.style[name]
            }else if(name instanceof Object){
                // dom.style(div, {border: '1px solid red', color: 'blue'}) 两个参数，且参数是 Object 的实例
                // 说明也是写属性
                const object = name
                for(let key in object){
                    // key: border / color 是变量
                    // node.style.border = ....
                    // node.style.color = ....
                    node.style[key] = object[key]
                }
            }
        }       
    },
    class: { 
        // 添加 class
        add(node, className){
            node.classList.add(className)
        },
        // 删除 class
        remove(node, className){
            node.classList.remove(className)
        },
        has(node, className){
            return node.classList.contains(className)
        }
    },
    // 改事件
    on(node, eventName, fn){
        node.addEventListener(eventName, fn)
    },
    off(node, eventName, fn){   // 移除监听
        node.removeEventListener(eventName, fn)
    },

    // 查  (之前用的全局id)
    find(selector, scope) {    // 给一个选择器， 返回所有符合范围的div
        return (scope || document).querySelectorAll(selector)
    },
    // 查节点的爸爸
    parent(node) {
        return node.parentNode
    },
    children(node) {
        return node.children
    },
    siblings(node) {
        return Array.from(node.parentNode.children).filter(n => n!==node)
    },
    next(node) {
        let x = node.nextSibling
        while(x && x.nodeType === 3){  // 如果x存在且x是文本就一直往下找
            x = x.nextSibling
        }
        return x
    },
    previous(node) {
        let x = node.previousSibling
        while(x && x.nodeType === 3){  // 如果x存在且x是文本就一直往前找
            x = x.previousSibling
        }
        return x
    },
    // 遍历
    each(nodeList, fn) {
        for(let i=0; i<nodeList.length; i++){
            fn.call(null, nodeList[i])
        }
    },
    index(node) {
        const list = dom.children(node.parentNode)
        let i 
        for(i=0; i<list.length; i++){
            if(list[i] === node){
                break
            }
        }
        return i
    }      
}

// dom.create = function() {}