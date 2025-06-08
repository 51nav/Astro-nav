# 📋 菜单表格格式说明

## 🎯 概述

菜单表格用于定义导航网站的分类结构，对应配置文件中的 `menuItems` 部分。

## 📊 菜单表格结构

### 表头定义

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| `name` | 必填 | 菜单名称 | 追踪系统 |
| `href` | 必填 | 锚点链接 | #tracking |
| `icon` | 必填 | 图标名称 | mdi:chart-line |
| `type` | 必填 | 菜单类型 | single 或 tabs |
| `parentMenu` | 可选 | 父菜单名称（用于子菜单） | 流量平台 |

### 字段说明

#### `name` - 菜单名称
- 显示在侧边栏的分类名称
- 如果是子菜单，则为子分类名称

#### `href` - 锚点链接
- 页面内跳转的锚点
- 格式：`#category-id`
- 子菜单格式：`#parent-subcategory`

#### `icon` - 图标名称
- 使用 Iconify 图标库
- 格式：`mdi:icon-name`
- 常用图标：
  - `mdi:chart-line` - 图表线条
  - `mdi:eye` - 眼睛
  - `mdi:traffic-light` - 交通灯
  - `mdi:handshake` - 握手
  - `mdi:popup` - 弹窗
  - `mdi:newspaper` - 报纸
  - `mdi:bell` - 铃铛

#### `type` - 菜单类型
- `single`: 单级菜单，直接包含网站列表
- `tabs`: 多级菜单，包含子菜单标签页

#### `parentMenu` - 父菜单名称
- 仅用于子菜单行
- 必须与父菜单的 `name` 字段完全匹配
- 空值表示这是顶级菜单

## 📝 Excel/CSV 模板

### 表头行
```csv
name,href,icon,type,parentMenu
```

### 示例数据

```csv
name,href,icon,type,parentMenu
追踪系统,#tracking,mdi:chart-line,single,
SPY服务,#spy,mdi:eye,single,
流量平台,#traffic,mdi:traffic-light,tabs,
PoP流量,#traffic-pop,mdi:popup,single,流量平台
原生广告流量,#traffic-native,mdi:newspaper,single,流量平台
Push流量,#traffic-push,mdi:bell,single,流量平台
综合性联盟,#networks,mdi:handshake,single,
```

## 🏗️ 生成的结构

上述表格将生成以下菜单结构：

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

## ⚠️ 注意事项

1. **顺序重要**：父菜单必须在子菜单之前定义
2. **名称匹配**：子菜单的 `parentMenu` 必须与父菜单的 `name` 完全匹配
3. **类型一致**：有子菜单的父菜单 `type` 必须为 `tabs`
4. **锚点唯一**：所有 `href` 值必须唯一
5. **图标格式**：必须使用 `mdi:` 前缀的 Material Design Icons

## 🔗 下一步

定义好菜单结构后，需要创建网站表格来填充各个菜单下的网站数据。
