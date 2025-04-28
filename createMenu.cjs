module.exports = function createMenu(items, option = {}) {
    const { type = "contextmenu", roles = {} } = option;
    const menu = new nw.Menu({ type });
    // 循环创建菜单项
    const itemsMap = {};
    items.forEach((item) => {
        const { id, shortcut, click, role, submenu, ...option } = item;
        // 组合快捷键
        if (shortcut){
            const split = shortcut.toLowerCase().split("+");
            option.key = split.pop();
            option.modifiers = split.join("+");
        }
        // 拓展单选类型
        if(item.type === "radio") option.type = "checkbox";
        // 点击事件
        option.click = () => {
            click?.call(menuItem, item, menuItem, menu);
            roles[role]?.call(menuItem, item, menuItem, menu);
            // 单选时更新其他菜单项选中状态
            if(item.type === "radio"){
                items.forEach((_item, i) => {
                    if(_item.type === "radio" && _item.name === item.name){
                        menu.items[i].checked = _item === item;
                    }
                });
            }
        };
        // 递归创建子菜单
        if(submenu) option.submenu = createMenu(submenu, { roles });
        const menuItem = new nw.MenuItem(option);
        menu.append(menuItem);
        if(id) itemsMap[id] = menuItem;
    });
    menu.itemsMap = itemsMap;
    return menu;
}