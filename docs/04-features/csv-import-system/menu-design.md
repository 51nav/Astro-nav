# 📋 左侧菜单结构设计

## 🎯 菜单层级关系

### 单级菜单结构
```
📊 追踪系统 (6)
👁️ SPY服务 (8)  
🤝 综合性联盟 (12)
```

### 多级菜单结构
```
🚦 流量平台 (45)
  ├── 📱 PoP流量 (8)
  ├── 📰 原生广告流量 (6)
  ├── 🔔 Push流量 (7)
  ├── 👥 社交流量 (12)
  ├── 🔍 搜索流量 (5)
  └── 🔞 Adult流量 (7)
```

## 📊 菜单表格设计

### 表格字段定义

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| `menuId` | 必填 | 菜单唯一标识 | tracking |
| `menuName` | 必填 | 菜单显示名称 | 追踪系统 |
| `menuIcon` | 必填 | 菜单图标 | mdi:chart-line |
| `menuType` | 必填 | 菜单类型 | single 或 tabs |
| `parentMenuId` | 可选 | 父菜单ID（子菜单用） | traffic |
| `sortOrder` | 必填 | 排序顺序 | 1, 2, 3... |

### Excel/CSV 表头
```csv
menuId,menuName,menuIcon,menuType,parentMenuId,sortOrder
```

### 完整示例数据

```csv
menuId,menuName,menuIcon,menuType,parentMenuId,sortOrder
tracking,追踪系统,mdi:chart-line,single,,1
spy,SPY服务,mdi:eye,single,,2
traffic,流量平台,mdi:traffic-light,tabs,,3
traffic-pop,PoP流量,mdi:popup,single,traffic,1
traffic-native,原生广告流量,mdi:newspaper,single,traffic,2
traffic-push,Push流量,mdi:bell,single,traffic,3
traffic-social,社交流量,mdi:account-group,single,traffic,4
traffic-search,搜索流量,mdi:magnify,single,traffic,5
traffic-adult,Adult流量,mdi:alert-circle,single,traffic,6
networks,综合性联盟,mdi:handshake,single,,4
```

## 🏗️ 生成的JSON结构

上述表格将生成：

```json
{
  "menuItems": [
    {
      "name": "追踪系统",
      "href": "#tracking",
      "icon": "mdi:chart-line", 
      "type": "single",
      "sites": []
    },
    {
      "name": "SPY服务",
      "href": "#spy",
      "icon": "mdi:eye",
      "type": "single", 
      "sites": []
    },
    {
      "name": "流量平台",
      "href": "#traffic",
      "icon": "mdi:traffic-light",
      "type": "tabs",
      "submenu": [
        {
          "name": "PoP流量",
          "href": "#traffic-pop",
          "icon": "mdi:popup",
          "sites": []
        },
        {
          "name": "原生广告流量", 
          "href": "#traffic-native",
          "icon": "mdi:newspaper",
          "sites": []
        },
        {
          "name": "Push流量",
          "href": "#traffic-push",
          "icon": "mdi:bell", 
          "sites": []
        },
        {
          "name": "社交流量",
          "href": "#traffic-social",
          "icon": "mdi:account-group",
          "sites": []
        },
        {
          "name": "搜索流量",
          "href": "#traffic-search", 
          "icon": "mdi:magnify",
          "sites": []
        },
        {
          "name": "Adult流量",
          "href": "#traffic-adult",
          "icon": "mdi:alert-circle",
          "sites": []
        }
      ]
    },
    {
      "name": "综合性联盟",
      "href": "#networks", 
      "icon": "mdi:handshake",
      "type": "single",
      "sites": []
    }
  ]
}
```

## 🎨 图标库参考

### 常用分类图标
- `mdi:chart-line` - 追踪系统
- `mdi:eye` - SPY服务  
- `mdi:traffic-light` - 流量平台
- `mdi:handshake` - 综合性联盟
- `mdi:tools` - 工具类
- `mdi:school` - 教育培训

### 流量子分类图标
- `mdi:popup` - PoP流量
- `mdi:newspaper` - 原生广告
- `mdi:bell` - Push流量
- `mdi:account-group` - 社交流量
- `mdi:magnify` - 搜索流量
- `mdi:alert-circle` - Adult流量
- `mdi:email` - 邮件营销
- `mdi:video` - 视频广告

## ⚠️ 设计规则

1. **menuId 规则**
   - 顶级菜单：简短英文标识，如 `tracking`, `spy`
   - 子菜单：`父菜单ID-子标识`，如 `traffic-pop`

2. **排序规则**
   - 顶级菜单按 `sortOrder` 排序
   - 子菜单在父菜单内按 `sortOrder` 排序

3. **类型规则**
   - 有子菜单的父菜单必须是 `tabs` 类型
   - 子菜单和无子菜单的菜单都是 `single` 类型

4. **层级限制**
   - 最多支持两级：顶级菜单 → 子菜单
   - 不支持三级及以上嵌套

## 🔗 下一步：网站数据设计

菜单结构确定后，需要设计网站数据表格，用于填充各个菜单下的具体网站内容。
