import type { SiteConfig } from '../types/config';

// 网站基础配置
export const siteConfig: SiteConfig = {
  site: {
    title: "Affiliate导航",
    description: "专业的Affiliate营销导航网站 - 发现最好的Affiliate营销工具、资源和平台",
    logo: {
      text: "Affiliate导航",
      href: "/"
    }
  },
  categoryMap: {
    "追踪系统": "tracking",
    "SPY服务": "spy", 
    "流量平台": "traffic",
    "综合性联盟": "networks"
  },
  menuItems: [
    {
      name: "追踪系统",
      href: "#tracking",
      icon: "mdi:chart-line",
      type: "single",
      sites: [
        {
          title: "Binom",
          description: "老毛子写的高性能tracker",
          url: "https://binom.org",
          logo: "/logos/binom.png",
          advantages: [
            "跳转速度快",
            "价格是基于服务器的，而不是像其他的服务商那样基于点击数量",
            "生成报表的速度快",
            "无限域名(additional domains)",
            "多用户管理系统",
            "提供API",
            "售后支持相应速度快"
          ],
          details: {
            intro: "Binom一款由俄罗斯开发团队开发的高性能追踪系统。它的主要特点是采用服务器授权模式，用户只需支付服务器费用，无需按点击量付费。系统采用PHP7 + Nginx架构，确保了极快的响应速度。",
            pricing: "价格根据服务器配置而定，基础版本起价约$100/月。不同于其他tracker按点击收费，Binom采用服务器授权模式，这意味着只要服务器能承受，您可以处理无限的点击量。",
            pros: [
              "性价比极高，尤其是对于大流量用户",
              "响应速度快，平均redirect时间<1ms",
              "安装简单，一键部署",
              "支持多用户管理",
              "报表生成速度快",
              "支持无限域名",
              "API支持完善"
            ],
            cons: [
              "需要自己管理服务器",
              "界面相对简单，不够美观",
              "学习曲线相对陡峭"
            ],
            tips: [
              "建议选择SSD服务器以获得更好性能",
              "新手可以先使用他们提供的共享服务器方案",
              "重视服务器的地理位置，建议选择离目标流量来源较近的机房",
              "定期备份数据库很重要",
              "建议配置CDN以提升全球访问速度"
            ]
          },
          related: [
            {
              title: "Voluum",
              description: "业界成名较早的tracker之一"
            },
            {
              title: "FunnelFlux", 
              description: "价格昂贵但是功能强大"
            }
          ]
        },
        {
          title: "Voluum",
          description: "业界成名较早的tracker之一",
          url: "https://voluum.com",
          logo: "/logos/voluum.png",
          advantages: [
            "云端部署，无需自己维护服务器",
            "完善的报表系统",
            "支持多种追踪模式",
            "内置防作弊系统",
            "支持团队协作"
          ],
          details: {
            intro: "Voluum是业内最知名的追踪系统之一，提供云端部署解决方案，无需自己维护服务器。系统功能完善，适合团队使用。",
            pricing: "按点击计费，起价$69/月，包含100万点击，超出部分额外收费。提供多个套餐可选择。",
            pros: [
              "部署简单，无需技术背景",
              "界面美观，操作直观",
              "客服支持及时",
              "报表系统强大",
              "定期推出新功能"
            ],
            cons: [
              "价格较贵，尤其是大流量时",
              "部分高级功能需要更高套餐",
              "服务器位置有限，某些地区延迟较高"
            ],
            tips: [
              "建议先使用试用版本测试",
              "根据流量预估选择合适套餐",
              "善用他们的API功能",
              "注意设置数据备份",
              "多利用他们的教程资源"
            ]
          }
        }
      ]
    }
  ]
};
