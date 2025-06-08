# 🌐 右侧网站数据设计

## 🎯 网站数据结构

基于 `Site` 接口，每个网站包含基本信息、详细信息和相关推荐。

## 📊 网站表格设计

### 表格字段定义

| 字段名 | 类型 | 说明 | 示例 |
|--------|------|------|------|
| `menuId` | 必填 | 所属菜单ID | tracking 或 traffic-pop |
| `title` | 必填 | 网站标题 | Binom |
| `description` | 必填 | 简短描述 | 老毛子写的高性能tracker |
| `url` | 可选 | 网站链接 | https://binom.org |
| `logo` | 可选 | Logo路径 | /logos/binom.png |
| `advantages` | 可选 | 优势特点 | 跳转速度快;价格基于服务器;报表生成快 |
| `features` | 可选 | 功能特性 | 多用户管理;API支持;无限域名 |
| `intro` | 可选 | 详细介绍 | Binom是由俄罗斯开发团队开发的... |
| `pricing` | 可选 | 价格信息 | 基础版本起价约$100/月 |
| `pros` | 可选 | 优点列表 | 性价比高;响应速度快;安装简单 |
| `cons` | 可选 | 缺点列表 | 需要管理服务器;界面简单 |
| `tips` | 可选 | 使用技巧 | 建议选择SSD服务器;新手先用共享方案 |
| `relatedTitles` | 可选 | 相关网站标题 | Voluum;FunnelFlux |
| `relatedDescriptions` | 可选 | 相关网站描述 | 业界知名tracker;功能强大但昂贵 |
| `sortOrder` | 可选 | 排序顺序 | 1, 2, 3... |

### Excel/CSV 表头
```csv
menuId,title,description,url,logo,advantages,features,intro,pricing,pros,cons,tips,relatedTitles,relatedDescriptions,sortOrder
```

### 示例数据

```csv
menuId,title,description,url,logo,advantages,features,intro,pricing,pros,cons,tips,relatedTitles,relatedDescriptions,sortOrder
tracking,Binom,老毛子写的高性能tracker,https://binom.org,/logos/binom.png,跳转速度快;价格基于服务器;报表生成快,多用户管理;API支持;无限域名,Binom是由俄罗斯开发团队开发的高性能追踪系统。它的主要特点是采用服务器授权模式用户只需支付服务器费用无需按点击量付费。,基础版本起价约$100/月,性价比高;响应速度快;安装简单,需要管理服务器;界面简单,建议选择SSD服务器;新手先用共享方案,Voluum;FunnelFlux,业界知名tracker;功能强大但昂贵,1
tracking,Voluum,业界成名较早的tracker之一,https://voluum.com,/logos/voluum.png,云端部署;完善报表;支持多种追踪模式,防作弊系统;团队协作;智能优化,Voluum是业内最知名的追踪系统之一提供云端部署解决方案无需自己维护服务器。,按点击计费起价$69/月,部署简单;界面美观;客服及时,价格较贵;部分功能需高套餐,先使用试用版;选择合适套餐,Binom;RedTrack,高性价比自建系统;新一代云追踪,2
spy,Adplexity,创立最早也是最优秀的spy工具,https://adplexity.com,/logos/adplexity.png,支持多种广告形式;历史数据丰富;覆盖全球市场,Mobile/Desktop/Native监控;Landing页面下载;广告素材分析,Adplexity是业内最早的spy工具之一专注于移动和桌面广告监控。,Mobile版$149/月 Desktop版$249/月,数据最全面;更新及时;功能专业,价格昂贵;学习成本高,重点关注Top广告;善用过滤功能,Anstrex;BigSpy,功能全面spy工具;免费spy工具,1
traffic-pop,PropellerAds,很多人都在用的平台,https://propellerads.com,/logos/propellerads.png,全球流量覆盖;支持多种广告形式;门槛低,实时报表;智能出价;反作弊系统,PropellerAds是全球领先的Pop和Push广告网络拥有超过10亿日活用户。,最低充值$100,流量质量稳定;覆盖地区广;优化工具完善,部分地区竞争激烈;优质流量成本高,从小预算开始;注意黑名单过滤,Adcash;Popads,大佬们都在用;老牌Pop联盟,1
traffic-pop,Zeropark,老牌流量平台Pop和Domain流量质量好,https://zeropark.com,/logos/zeropark.png,高质量Pop流量;强大定向;详细数据分析,Domain流量;RON/ROC投放;实时优化,Zeropark是业内知名的流量平台专注于高质量的Pop和Domain流量。,最低充值$200,流量质量高;定向丰富;报表专业,入门门槛高;需要大测试预算,准备充足预算;重视数据收集,PropellerAds;Popcash,很多人都在用;历史悠久联盟,2
```

## 🏗️ 生成的JSON结构

上述表格将填充到对应菜单的 `sites` 数组中：

```json
{
  "menuItems": [
    {
      "name": "追踪系统",
      "type": "single",
      "sites": [
        {
          "title": "Binom",
          "description": "老毛子写的高性能tracker",
          "url": "https://binom.org",
          "logo": "/logos/binom.png",
          "advantages": ["跳转速度快", "价格基于服务器", "报表生成快"],
          "features": ["多用户管理", "API支持", "无限域名"],
          "details": {
            "intro": "Binom是由俄罗斯开发团队开发的高性能追踪系统...",
            "pricing": "基础版本起价约$100/月",
            "pros": ["性价比高", "响应速度快", "安装简单"],
            "cons": ["需要管理服务器", "界面简单"],
            "tips": ["建议选择SSD服务器", "新手先用共享方案"]
          },
          "related": [
            {"title": "Voluum", "description": "业界知名tracker"},
            {"title": "FunnelFlux", "description": "功能强大但昂贵"}
          ]
        }
      ]
    },
    {
      "name": "流量平台",
      "type": "tabs", 
      "submenu": [
        {
          "name": "PoP流量",
          "sites": [
            {
              "title": "PropellerAds",
              "description": "很多人都在用的平台",
              // ... 完整的网站数据
            }
          ]
        }
      ]
    }
  ]
}
```

## 📝 字段详细说明

### 必填字段
- `menuId`: 必须与菜单表格中的 `menuId` 完全匹配
- `title`: 网站名称，显示在卡片标题
- `description`: 简短描述，显示在标题下方

### 多值字段（分号分隔）
- `advantages`: 优势特点，显示为标签
- `features`: 功能特性，显示为标签  
- `pros`: 优点列表，详情弹窗中显示
- `cons`: 缺点列表，详情弹窗中显示
- `tips`: 使用技巧，详情弹窗中显示
- `relatedTitles` + `relatedDescriptions`: 相关推荐，数量必须一致

### 详细信息字段
- `intro`: 详细介绍，详情弹窗中显示
- `pricing`: 价格信息，详情弹窗中显示

## ⚠️ 数据规则

1. **menuId 匹配**
   - 必须与菜单表格中定义的 `menuId` 完全匹配
   - 支持顶级菜单ID（如 `tracking`）和子菜单ID（如 `traffic-pop`）

2. **分隔符规则**
   - 多值字段使用英文分号 `;` 分隔
   - 分号前后的空格会被自动清理

3. **相关网站规则**
   - `relatedTitles` 和 `relatedDescriptions` 必须数量一致
   - 按顺序一一对应

4. **排序规则**
   - 同一菜单下的网站按 `sortOrder` 排序
   - 未指定排序的按表格行顺序

5. **URL规则**
   - 支持完整URL：`https://example.com`
   - 支持占位符：`#` 表示暂无链接

## 🔄 导入流程

1. **第一步**：导入菜单表格，建立左侧菜单结构
2. **第二步**：导入网站表格，填充右侧内容
3. **第三步**：系统验证数据完整性和关联关系
4. **第四步**：生成完整的配置文件
