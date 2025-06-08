# 📊 表格导入工具设计指南

## 🎯 设计思路

基于现有的配置格式，将导航数据分为两个层次：
1. **左侧菜单结构** - 定义分类和子分类
2. **右侧网站内容** - 填充具体的网站数据

## 📋 两表格设计

### 1. 菜单表格 (menu-template.csv)

**用途**：定义左侧导航菜单的层级结构

**字段**：
- `menuId` - 菜单唯一标识
- `menuName` - 菜单显示名称  
- `menuIcon` - 菜单图标
- `menuType` - 菜单类型 (single/tabs)
- `parentMenuId` - 父菜单ID (子菜单用)
- `sortOrder` - 排序顺序

**示例**：
```csv
menuId,menuName,menuIcon,menuType,parentMenuId,sortOrder
tracking,追踪系统,mdi:chart-line,single,,1
traffic,流量平台,mdi:traffic-light,tabs,,3
traffic-pop,PoP流量,mdi:popup,single,traffic,1
```

### 2. 网站表格 (site-template.csv)

**用途**：填充各个菜单下的具体网站数据

**字段**：
- `menuId` - 所属菜单ID (关联菜单表格)
- `title` - 网站标题
- `description` - 简短描述
- `url` - 网站链接
- `logo` - Logo路径
- `advantages` - 优势特点 (分号分隔)
- `features` - 功能特性 (分号分隔)
- `intro` - 详细介绍
- `pricing` - 价格信息
- `pros` - 优点列表 (分号分隔)
- `cons` - 缺点列表 (分号分隔)
- `tips` - 使用技巧 (分号分隔)
- `relatedTitles` - 相关网站标题 (分号分隔)
- `relatedDescriptions` - 相关网站描述 (分号分隔)
- `sortOrder` - 排序顺序

**示例**：
```csv
menuId,title,description,url,advantages,pros,cons
tracking,Binom,老毛子写的高性能tracker,https://binom.org,跳转速度快;价格基于服务器,性价比高;响应速度快,需要管理服务器;界面简单
traffic-pop,PropellerAds,很多人都在用的平台,https://propellerads.com,全球流量覆盖;门槛低,流量质量稳定;覆盖地区广,部分地区竞争激烈
```

## 🏗️ 生成的配置结构

两个表格将生成完整的配置文件：

```json
{
  "site": {
    "title": "导航网站",
    "description": "专业导航平台"
  },
  "categoryMap": {
    "追踪系统": "tracking",
    "流量平台": "traffic"
  },
  "menuItems": [
    {
      "name": "追踪系统",
      "href": "#tracking",
      "icon": "mdi:chart-line",
      "type": "single",
      "sites": [
        {
          "title": "Binom",
          "description": "老毛子写的高性能tracker",
          "url": "https://binom.org",
          "advantages": ["跳转速度快", "价格基于服务器"],
          "details": {
            "pros": ["性价比高", "响应速度快"],
            "cons": ["需要管理服务器", "界面简单"]
          }
        }
      ]
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
          "sites": [
            {
              "title": "PropellerAds",
              "description": "很多人都在用的平台"
            }
          ]
        }
      ]
    }
  ]
}
```

## 🔄 导入流程

1. **第一步**：用户下载模板文件
   - `/templates/menu-template.csv`
   - `/templates/site-template.csv`

2. **第二步**：用户填写表格数据
   - 先设计菜单结构
   - 再填充网站内容

3. **第三步**：上传表格文件
   - 系统验证数据格式
   - 检查关联关系

4. **第四步**：生成配置文件
   - 自动转换为JSON格式
   - 提供下载和预览

## ⚠️ 设计规则

### 菜单设计规则
- `menuId` 必须唯一
- 子菜单的 `parentMenuId` 必须存在
- 有子菜单的父菜单 `menuType` 必须为 `tabs`
- 排序按 `sortOrder` 升序

### 网站设计规则  
- `menuId` 必须与菜单表格中的 `menuId` 匹配
- 多值字段用分号 `;` 分隔
- `relatedTitles` 和 `relatedDescriptions` 数量必须一致

### 数据验证规则
- 必填字段不能为空
- URL格式验证
- 图标名称格式验证 (`mdi:` 前缀)
- 关联关系完整性验证

## 🎨 图标参考

### 常用分类图标
- `mdi:chart-line` - 追踪系统
- `mdi:eye` - SPY服务
- `mdi:traffic-light` - 流量平台  
- `mdi:handshake` - 综合性联盟

### 流量子分类图标
- `mdi:popup` - PoP流量
- `mdi:newspaper` - 原生广告
- `mdi:bell` - Push流量
- `mdi:account-group` - 社交流量
- `mdi:magnify` - 搜索流量

## 📁 模板文件

用户可以下载以下模板文件开始使用：

- **菜单模板**：`/templates/menu-template.csv`
- **网站模板**：`/templates/site-template.csv`

模板包含示例数据，用户可以参考格式进行修改。

## 🚀 下一步开发

1. 创建表格导入工具界面
2. 实现Excel/CSV解析功能
3. 添加数据验证逻辑
4. 生成配置文件功能
5. 提供预览和下载功能
