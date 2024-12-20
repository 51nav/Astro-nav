export interface NavItem {
  title: string;
  description?: string;
  url?: string;
  logo?: string;
  features?: string[];
  details?: {
    intro?: string;
    pricing?: string;
    pros?: string[];
    cons?: string[];
    tips?: string[];
  };
}

export interface SubCategory {
  name: string;
  items: NavItem[];
}

export interface Category {
  name: string;
  icon: string;
  subCategories?: SubCategory[];
  items?: NavItem[];
}

export const navigationData: Category[] = [
  {
    name: "追踪系统",
    icon: "mdi:chart-line",
    items: [
      {
        title: "Binom",
        description: "老毛子写的高性能tracker",
        url: "https://binom.org",
        logo: "/logos/binom.png",
        features: [
          "跳转速度快",
          "价格是基于服务器的，而不是像其他的服务商那样基于点击数量",
          "生成报表的速度快",
          "无限域名(additional domains)",
          "多用户管理系统",
          "提供API",
          "售后支持相应速度快"
        ],
        details: {
          intro: "Binom一款由俄罗斯开发团队开发的高性能追系统。它的主要特点是采用服务器授权模式，用户只需支付服务器费用，无需按点击量付费。系统采用PHP7 + Nginx架构，确保了极快的响应速度。",
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
            "建议配置CDN以提升球访问速度"
          ]
        }
      },
      {
        title: "Voluum",
        description: "业界成名较早的tracker之一",
        url: "https://voluum.com",
        logo: "/logos/voluum.png",
        features: [
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
            "注意设置据备份",
            "多利用他们的教程资源"
          ]
        }
      },
      {
        title: "FunnelFlux",
        description: "价格昂贵但是功能强大, 支持安装在自己的服务器上",
        url: "https://funnelflux.com",
        logo: "/logos/funnelflux.png",
        features: [
          "自托管选项",
          "强大的漏斗分析",
          "详细的访客画像",
          "高级报表功能",
          "多服务器集群支持"
        ],
        details: {
          intro: "FunnelFlux是一款功能强大的追踪系统，特别适合需要深入分析用户行为和漏斗转化的营销人员。支持自托管部署，让用户完全控制数据和基础设施。",
          pricing: "自托管版本起价$299/月，云托管版本价格更高。价格虽高但功能齐全。",
          pros: [
            "数据掌控度高",
            "漏斗分析功能强大",
            "支持复杂的分流规则",
            "报表系统专业",
            "安全性好"
          ],
          cons: [
            "价格昂贵",
            "部署复杂",
            "学习曲线陡峭"
          ],
          tips: [
            "建先评估ROI再决定是否使用",
            "准备好专业的技术支持",
            "重视服务器配置",
            "做好完整的部署计划",
            "定期检查系统性能"
          ]
        }
      },
      {
        title: "Adsbridge",
        description: "简单易用, 功能强大, 自带smartlink",
        url: "https://adsbridge.com",
        logo: "/logos/adsbridge.png",
        features: [
          "内置Smartlink系统",
          "云端部署",
          "界面简洁易用",
          "多重防作弊机制",
          "支持多用户管理"
        ],
        details: {
          intro: "Adsbridge是一款云端追踪系统，以其简单易用和功能完整而闻名。特别适合新手入门，同时也能满足专业用户的需求。内置的Smartlink功能是其一大特色。",
          pricing: "基础版起价$79/月，包含100万点击，提供多个套餐选择。",
          pros: [
            "部署简单，即开即用",
            "内置Smartlink功能",
            "界面直观友好",
            "学习曲线平缓",
            "支持多种追踪模式"
          ],
          cons: [
            "高级功能需要更高套餐",
            "大流量时成本较高",
            "部分地区响应较慢"
          ],
          tips: [
            "可以先用基础版本测试",
            "善用内置的Smartlink功能",
            "注意设置防作弊规则",
            "定期导出重要数据",
            "关注官方更新通知"
          ]
        }
      },
      {
        title: "ThriveTracker",
        description: "中规中距的一个tracker",
        url: "#",
        logo: "/logos/thrive.png",
        features: [
          "自托管选项",
          "完整的追踪功能",
          "支持多用户",
          "实时统计",
          "自定义报表"
        ],
        details: {
          intro: "ThriveTracker是一款功能完整的追踪系统，提供自托管选项，适合需要完全控制数据的用户。系统稳定，功能齐全。",
          pricing: "自托管版本起价$199/月，支持无限点击量。",
          pros: [
            "功能齐全",
            "数据掌控度高",
            "系统稳定性好",
            "报表功能强大",
            "支持自定义功能"
          ],
          cons: [
            "价格较高",
            "部署较复杂",
            "更新频率一般"
          ],
          tips: [
            "建议先评估服务器配置",
            "做好完整的部署计划",
            "重视数据备份",
            "关注性能优化",
            "善用自定义功能"
          ]
        }
      },
      {
        title: "Bemob",
        description: "捷克出品的优质Tracker",
        url: "https://bemob.com",
        logo: "/logos/bemob.png",
        features: [
          "性价比高",
          "界面简洁直观",
          "支持多种追踪模式",
          "防作弊功能",
          "API支持"
        ],
        details: {
          intro: "Bemob是一款来自捷克追踪器，以其高性价比稳定性在市场上赢得了良好口碑。系统设计简洁，易于使用，同时又不失专业性。",
          pricing: "基础版起价$99/月，包含100万点击，价格较为实惠。",
          pros: [
            "性价比高",
            "界面简洁易用",
            "服务稳定",
            "更新频繁",
            "支持功能丰富"
          ],
          cons: [
            "部分高级功能不如顶级tracker",
            "文档相对简单",
            "社区相对较小"
          ],
          tips: [
            "新手入门的好选择",
            "注意研究他们的文档",
            "善用客服支持",
            "期备份数据",
            "关注他们的更新通知"
          ]
        }
      },
      {
        title: "Keitaro",
        description: "据说很厉害的tracker, 无缘一试",
        url: "#",
        logo: "/logos/keitaro.png",
        features: [
          "高性能架构",
          "强大的规则系统",
          "详细的数据分析",
          "多服务器集群",
          "完善的API"
        ],
        details: {
          intro: "Keitaro是一款高端追踪系统，以其强大的性能和灵活的规则系统著称。特别适合大型团队和需要处理大量数据的用户。",
          pricing: "授权费用约$399/月，需要自己部署服务器。",
          pros: [
            "性能极其强大",
            "规则系统灵活",
            "数据分析详细",
            "支持集群部署",
            "API功能完善"
          ],
          cons: [
            "价格昂贵",
            "配置复杂",
            "需要专业技术支持"
          ],
          tips: [
            "需要专业的技术团队",
            "做好充足的预算",
            "重视服务器配置",
            "注意规则优化",
            "定期检查性能"
          ]
        }
      },
      {
        title: "RedTrack",
        description: "功能强大，需要一定的学习曲线",
        url: "#",
        logo: "/logos/redtrack.png",
        features: [
          "云端部署",
          "AI优化功能",
          "多维度分析",
          "自动规则系统",
          "团队协作功能"
        ],
        details: {
          intro: "RedTrack是新一代的追踪系统，集成了AI优化和自动化功能，适合需要深度数据分析和自动化的用户。",
          pricing: "基础版$99/月起，根据点击量阶梯收费。",
          pros: [
            "AI辅助优化",
            "自动化程度高",
            "分析功能强大",
            "团队协作好",
            "更新频繁"
          ],
          cons: [
            "学习曲线较陡",
            "高级功能费用高",
            "部分功能复杂"
          ],
          tips: [
            "循序渐进学习功能",
            "充分利用AI功能",
            "注意成本控制",
            "重视团队培训",
            "关注新功能更新"
          ]
        }
      },
      {
        title: "PeerClick",
        description: "号称跳转(redirect)最快的tracker",
        url: "#"
      },
      {
        title: "CPVLAB Pro",
        description: "CPVLab分家后的作品",
        url: "#"
      },
      {
        title: "iMobitrax",
        description: "Mobile流行时的首选tracker",
        url: "#"
      },
      {
        title: "Prosper202",
        description: "只当留个回忆",
        url: "#"
      }
    ]
  },
  {
    name: "SPY服务",
    icon: "mdi:magnify",
    items: [
      {
        title: "Adplexity",
        description: "创立最早也是最优秀的spy工具",
        url: "https://adplexity.com",
        logo: "/logos/adplexity.png",
        features: [
          "支持多种广告形式监控",
          "历史数据丰富",
          "覆盖全球主要市场",
          "数据更新及时",
          "界面操作友好"
        ],
        details: {
          intro: "Adplexity是市面上最早也是最专业的广告监控工具之一，支持Native、Mobile、Desktop、Push、Carrier等多种广告形式的监控。它的数据库覆盖全球主要市场，能让用户及时了解竞争对手的投放策略",
          pricing: "不同产品线价格不同，基础版本约$199/月起，可选择单个产品或者打包购买。",
          pros: [
            "数据库最全面",
            "更新频率快",
            "支持多种广告形式",
            "界面直观易用",
            "客服响应快"
          ],
          cons: [
            "价格较贵",
            "部分小语种市场覆盖不足",
            "某些高级功能需要更高套餐"
          ],
          tips: [
            "建议先选择单个产品线试用",
            "重点关注同行最新投放动向",
            "善用过滤器功能",
            "定期导出重要数据",
            "关注他们的更新通知"
          ]
        }
      },
      {
        title: "Anstrex",
        description: "专注于Push和Native广告的SPY",
        url: "https://anstrex.com",
        logo: "/logos/anstrex.png",
        features: [
          "专注Push和Native广告",
          "价格相对实惠",
          "数据更新快",
          "支持Landing Page下载",
          "提供详细的投放数据"
        ],
        details: {
          intro: "Anstrex是一款专注于Push和Native广告的监控工具，以其优秀的性价比和完善的功能在市场上占有重要地位。特别适合做Push和Native广告的广告主。",
          pricing: "基础版约$99/月起，提供Push或Native单个产品线的访问权限。",
          pros: [
            "性价比高",
            "Push广数据全面",
            "支持自动下载落地页",
            "数据更新及时",
            "操作界面友好"
          ],
          cons: [
            "仅支持Push和Native",
            "某些小众市场数据不足",
            "高级功能需要升级套餐"
          ],
          tips: [
            "可以先用基础版本测试",
            "重点关注长期投放的广告",
            "善用标签管理功能",
            "定期检查热门offer",
            "注意保存重要素材"
          ]
        }
      },
      {
        title: "AdVault",
        description: "最好的原生广告SPY服务商之一",
        url: "#",
        logo: "/logos/advault.png",
        features: [
          "专注原生广告监控",
          "支持多个广告网络",
          "提供详细的投放数据",
          "支持素材下载",
          "数据分析功能强大"
        ],
        details: {
          intro: "AdVault是专注于原生广告监控的工具，支持主流原生广告网络的数据监控，为广告主提供竞品分析和市场洞察。",
          pricing: "月费制，基础版约$149/月起。",
          pros: [
            "原生广告数据全面",
            "覆盖主���������������������������������������广�����网���",
            "分析功能强大",
            "界面设计专业",
            "支持批量导出"
          ],
          cons: [
            "价格偏高",
            "仅限原生广告",
            "部分地区数据有限"
          ],
          tips: [
            "重点关注热门垂直领域",
            "多利用数据分析功能",
            "保存优质创意素材",
            "跟踪长期投放的广告主",
            "注意竞品投放策略变化"
          ]
        }
      },
      {
        title: "SpyOver",
        description: "原生广告(Native Ads)监控和分析服务商",
        url: "#",
        features: [
          "专注原生广告监控",
          "实时数据更新",
          "竞品分析功能",
          "广告创意库",
          "流量来源分析"
        ],
        details: {
          intro: "SpyOver是专业的原生广告监控平台，提供实时的广告数据和竞品分析功能。",
          pricing: "基础版约$199/月起",
          pros: [
            "原生广告数据全面",
            "更新及时",
            "分析工具专业",
            "操作界面友好",
            "报表功能强大"
          ],
          cons: [
            "价格较高",
            "仅限原生广告",
            "部分区数据有限"
          ],
          tips: [
            "关注长期投放广告",
            "分析竞品策略",
            "保存优质创意",
            "定期导出数据",
            "跟踪热门offer"
          ]
        }
      },
      {
        title: "AdSpy",
        description: "世界上最大的facebook ads 和 instagram ads SPY服务商",
        url: "#",
        features: [
          "Facebook广告数据库",
          "Instagram广告监控",
          "社交媒体分析",
          "创意素材下载",
          "受众分析"
        ]
      },
      {
        title: "FindNiche",
        description: "BigSpy马甲之一，侧重于Aliexpress 和Shopify",
        url: "#"
      },
      {
        title: "MixRank",
        description: "曾经的明星站点, 现在流量下滑的厉害",
        url: "#"
      },
      {
        title: "WhatRunsWhere",
        description: "曾经的霸主之一",
        url: "#"
      },
      {
        title: "SocialAdScout",
        description: "社交广告SPY",
        url: "#"
      },
      {
        title: "PowerAdSpy",
        description: "Facebook Ads SPY专家",
        url: "#"
      },
      {
        title: "Adspyhub",
        description: "BigSpy马甲",
        url: "#"
      },
      {
        title: "Idvert",
        description: "号称对标adplexity的国内服务商",
        url: "#"
      },
      {
        title: "BigSpy",
        description: "国产优质SPY服务商，推荐",
        url: "#"
      },
      {
        title: "SpyPush",
        description: "专注于Push广告",
        url: "#"
      },
      {
        title: "AdplexityAdult",
        description: "Adplexity的成人版",
        url: "#"
      }
    ]
  },
  {
    name: "流量平台",
    icon: "mdi:traffic-light",
    subCategories: [
      {
        name: "PoP流量",
        items: [
          {
            title: "PropellerAds",
            description: "很多人都在用的平台",
            url: "https://propellerads.com",
            logo: "/logos/propellerads.png",
            features: [
              "全球性的流量覆盖",
              "支持多种广告形式",
              "实时报表系统",
              "智能出价系统",
              "反作弊系统"
            ],
            details: {
              intro: "PropellerAds是全球领先的Pop和Push广告网络，提供高质量的流量和先进的定向选项。平台支持多种广告形式，包括Popunder、Push通知、In-Page Push等。",
              pricing: "最低充值$100，CPM/CPC竞价模式，支持多种支付方式。",
              pros: [
                "流量质量稳定",
                "覆盖地区广",
                "支持多种广告形式",
                "实时优化工具",
                "客服响应快"
              ],
              cons: [
                "部分地区竞争激烈",
                "优质流量成本较高",
                "需要一定预算测试"
              ],
              tips: [
                "建议从小预算开始测试",
                "注意使用黑名单过滤",
                "多关注ROI报表",
                "善用自动优化功能",
                "重视转化追踪设置"
              ]
            }
          },
          {
            title: "Zeropark",
            description: "老牌流量平台，Pop和Domain流量质量好",
            url: "https://zeropark.com",
            logo: "/logos/zeropark.png",
            features: [
              "高质量的Pop流量",
              "强大的定向功能",
              "详细的数据分析",
              "Domain流量资源",
              "RON/ROC投放选项"
            ],
            details: {
              intro: "Zeropark是业内知名的流量平台，以其高质量的Pop和Domain流量而闻名。平台提供详细的数据分析和优化工具，适合经验丰富的广告主。",
              pricing: "最低充值$200，支持CPV/CPC模式，需要通过账户审核。",
              pros: [
                "流量质量高",
                "定向选项丰富",
                "报表系统专业",
                "支持API对接",
                "优化工具完善"
              ],
              cons: [
                "入门门槛较高",
                "需要较大测试预算",
                "部分流量竞争激烈"
              ],
              tips: [
                "建议准备充足测试预算",
                "重视前期数据收集",
                "善用分时段投放",
                "注意流量源筛选",
                "合理使用竞价策略"
              ]
            }
          },
          {
            title: "Popads",
            description: "老牌Pop联盟之一",
            url: "https://popads.net",
            logo: "/logos/popads.png",
            features: [
              "专注Pop流量",
              "全球流量覆盖",
              "实时竞价系统",
              "地理定向选项",
              "设备定向功能"
            ],
            details: {
              intro: "Popads是最早专注于Pop流量的广告网络之一，拥有稳定的流量来源和完善的放系统。平以其透明的竞价系统和实时报表而受到广告主欢迎。",
              pricing: "最低充值$50，CPM竞价模式，支持多种支付方式。",
              pros: [
                "起投金额低",
                "操作界面简单",
                "竞价系统透明",
                "流量来源稳定",
                "支持多种定向"
              ],
              cons: [
                "部分流量量不稳定",
                "优化工具较少",
                "报表功能简单"
              ],
              tips: [
                "建议从小流量源开始测试",
                "注意设频次控制",
                "关注竞价变化",
                "做好预算控制",
                "重视转化追踪"
              ]
            }
          },
          {
            title: "Popcash",
            description: "历史悠久的pop联盟，popads的竞争对手",
            url: "https://popcash.net",
            logo: "/logos/popcash.png",
            features: [
              "专注于pop流量",
              "全球流量覆盖",
              "实时竞价系统",
              "地理定向选项",
              "设备定向功能"
            ],
            details: {
              intro: "Popcash是专注于pop流量的广告网络，以其高质量的流量和稳定的投放选项而闻名。平台支持多种支付方式，适合不同预算的广告主。",
              pricing: "最低充值$50，CPM竞价模式，支持多种支付方式。",
              pros: [
                "流量质量稳定",
                "覆盖地区广",
                "支持多种支付",
                "实时优化工具",
                "客服响应快"
              ],
              cons: [
                "部分地区竞争激烈",
                "优质流量成本较高",
                "需要持续优化"
              ],
              tips: [
                "建议从小预算开始测试",
                "注意受众定向设置",
                "关注转化数据",
                "优化创意文案",
                "合理控制频次"
              ]
            }
          },
          {
            title: "SelfAdvertiser",
            description: "Intango旗下产品, 全部按照CPA效果给钱",
            url: "https://selfadvertiser.com",
            logo: "/logos/selfadvertiser.png",
            features: [
              "专注于CPA效果",
              "全球流量覆盖",
              "实时数据统计",
              "智能优化功能",
              "多种广告形式"
            ],
            details: {
              intro: "SelfAdvertiser是专注于CPA效果的广告网络，提供多种广告形式和实时数据统计。平台支持多种支付方式，适合不同类型的推广需求。",
              pricing: "按效果付费，无需预付费用",
              pros: [
                "offer质量高",
                "支付准时",
                "优化工具强大",
                "数据透明",
                "支持多种广告形式"
              ],
              cons: [
                "部分地区竞争激烈",
                "流量规模较小",
                "需要持续优化"
              ],
              tips: [
                "建议从小预算开始测试",
                "注意创意规范",
                "关注转化数据",
                "合理设置预算",
                "持续优化定向"
              ]
            }
          },
          {
            title: "Adsterra",
            description: "提供主流和大人弹窗流量",
            url: "https://adsterra.com",
            logo: "/logos/adsterra.png",
            features: [
              "多样化广告形式",
              "全球流量覆盖",
              "反作弊系统",
              "时报表",
              "智能优化工具"
            ],
            details: {
              intro: "Adsterra是综合性广告平台，提供Push、Pop、Banner等多种广告形式。平台支持多种支付方式，适合不同预算的广告主。",
              pricing: "最低充值$100，支持CPM/CPC/CPA等多种计费模式。",
              pros: [
                "广告形式多样",
                "流量来源稳定",
                "支持多种支付",
                "报表系统完善",
                "客服支持好"
              ],
              cons: [
                "部分流量质量不稳定",
                "竞争较大",
                "需要较多测试"
              ],
              tips: [
                "多测试不同广告形式",
                "注意流量质量",
                "关注ROI指标",
                "优化投放时间",
                "合理分配预算"
              ]
            }
          },
          {
            title: "Ad-maven",
            description: "Push为主兼顾Pop",
            url: "https://ad-maven.com",
            logo: "/logos/ad-maven.png",
            features: [
              "Push和Pop流量",
              "全球流量覆盖",
              "实时统计系统",
              "多重定向选项",
              "自动优化功能"
            ],
            details: {
              intro: "Ad-maven是专业的Push和Pop广告平台，提供全球范围的流量覆盖。平台支持多种广告形式，适合不同类型的推广需求。",
              pricing: "最低充值$50，支持CPM/CPC计费模式。",
              pros: [
                "起投金额低",
                "流量类型多样",
                "操作界面友好",
                "支持多种定向",
                "优化工具实用"
              ],
              cons: [
                "部分地区流量不稳定",
                "报表功能简单",
                "优化选项有限"
              ],
              tips: [
                "先测试小预算",
                "关注质量指标",
                "持续监测数据",
                "优化投放策略",
                "注意成本控制"
              ]
            }
          },
          {
            title: "Adcash",
            description: "大佬们都在用的流量源之一",
            url: "https://adcash.com",
            logo: "/logos/adcash.png",
            features: [
              "高质量流量",
              "多种广告形式",
              "精准定向选项",
              "实时报表系统",
              "防作弊机制"
            ],
            details: {
              intro: "Adcash是专注于广告流量和定向选项的平台，提供高质量的流量和先进的定向选项。平台支持多种广告形式，包括Banner、Popunder、In-Page等。",
              pricing: "最低充值$100，支持CPM/CPC模式。",
              pros: [
                "流量质量高",
                "转化率高",
                "定向精准",
                "报表系统完善",
                "支持API"
              ],
              cons: [
                "部分地区竞争激烈",
                "优质流量成本高",
                "需要持续优化"
              ],
              tips: [
                "注意选择合适位置",
                "测试不同���意",
                "关注ROI指标",
                "合理控制频次",
                "持续优化定向"
              ]
            }
          },
          {
            title: "Hilltopads",
            description: "老牌流量平台，支持多种广告形式",
            url: "https://hilltopads.com",
            logo: "/logos/hilltopads.png",
            features: [
              "多种广告形式",
              "全球流量覆盖",
              "实时竞价系统",
              "地理定向选项",
              "设备定向功能"
            ],
            details: {
              intro: "Hilltopads是老牌流量平台，以其丰富的广告形式和稳定的流量来源而闻名。平台支持多种广告形式，包括Banner、Popunder、In-Page等。",
              pricing: "最低充值$100，支持CPM/CPC模式，需要通过账户审核。",
              pros: [
                "流量质量高",
                "定向选项丰富",
                "报表系统专业",
                "支持API对接",
                "优化工具完善"
              ],
              cons: [
                "入门门槛较高",
                "需要较大测试预算",
                "部分流量竞争激烈"
              ],
              tips: [
                "建议准备���足测试预算",
                "重视前期数据收集",
                "善用分时段投放",
                "注意流量源筛选",
                "合理使用竞价策略"
              ]
            }
          },
          {
            title: "Clickadu",
            description: "专注于Pop和视频广告",
            url: "https://clickadu.com",
            logo: "/logos/clickadu.png",
            features: [
              "专注于Pop和视频广告",
              "全球流量覆盖",
              "智能优化系统",
              "详细的定向选项",
              "实时竞价系统"
            ],
            details: {
              intro: "Clickadu是专注于Pop和视频广告的平台，提供高质量的流量和先进的定向选项。平台支持多种广告形式，包括Banner、Popunder、In-Page等。",
              pricing: "最低预算$500起，支持CPM/CPC模式，需要通过账户审核。",
              pros: [
                "广告形式多样",
                "覆盖地区广",
                "优化工具强大",
                "支持多种创意格式",
                "报表系统完善"
              ],
              cons: [
                "起投金额较高",
                "审核较严格",
                "部分地区竞争激烈"
              ],
              tips: [
                "建议从小预算测试开始",
                "注意创意规范",
                "重视素材测试",
                "关注ROI指标",
                "善用自动优化功能"
              ]
            }
          }
        ]
      },
      {
        name: "原生广告流量",
        items: [
          {
            title: "MGID",
            description: "全球最大的原生广告网络之一",
            url: "https://mgid.com"
          },
          {
            title: "Taboola",
            description: "高质量原生广告网络",
            url: "https://taboola.com"
          },
          {
            title: "Outbrain",
            description: "优质原生广告平台",
            url: "https://outbrain.com"
          },
          {
            title: "Revcontent",
            description: "内容推荐广告平台",
            url: "https://revcontent.com"
          },
          {
            title: "Content.ad",
            description: "专注于内容营销的广告平台",
            url: "https://content.ad"
          },
          {
            title: "Yahoo Gemini",
            description: "雅虎的原生广告平台",
            url: "https://gemini.yahoo.com"
          },
          {
            title: "Nativo",
            description: "高端原生广告平台",
            url: "https://nativo.com"
          }
        ]
      },
      {
        name: "社交流量",
        items: [
          {
            title: "Facebook Ads",
            description: "最大的社交广告平台",
            url: "https://facebook.com/advertising",
            logo: "/logos/facebook.png",
            features: [
              "精准的用户定向",
              "多样的广告形式",
              "强大的优化算法",
              "详细的数据分析",
              "广泛的受众覆盖"
            ],
            details: {
              intro: "Facebook Ads是全球最大的社交媒体广平台，拥有数十亿活跃用户，提供精准的用户定向和多样的广告形式。",
              pricing: "最低日预算$1起，支持多种计费方式，包括CPM、CPC等。",
              pros: [
                "用户基数大",
                "定向精准",
                "数据分析详细",
                "创意形式丰富",
                "优化工���强大"
              ],
              cons: [
                "获取账户难度大",
                "政策限制多",
                "竞争激烈"
              ],
              tips: [
                "注意账户安全",
                "遵守广告政策",
                "重视素材质量",
                "做好预算规划",
                "持续测试优化"
              ]
            }
          },
          {
            title: "TikTok Ads",
            description: "短视频广告平台",
            url: "https://ads.tiktok.com",
            logo: "/logos/tiktok.png",
            features: [
              "年轻用户群体",
              "视频广告为主",
              "创意展现丰富",
              "全球化布局",
              "智能投放系统"
            ],
            details: {
              intro: "TikTok Ads是快速增长的短视频广告平台，主要面向年轻用户群体，支持多种创意广告形式。",
              pricing: "最低预算因地区而异，通常$50起，支持多种计费方式。",
              pros: [
                "用户增长快",
                "互动率高",
                "创意空间大",
                "覆盖广",
                "效果好"
              ],
              cons: [
                "制作成本较高",
                "创意要求高",
                "部分地区受限"
              ],
              tips: [
                "注重视频质量",
                "把握用户兴趣",
                "测试不同创意",
                "关注热点趋势",
                "优化投放时间"
              ]
            }
          },
          {
            title: "Twitter Ads",
            description: "推特广告平台",
            url: "https://ads.twitter.com",
            logo: "/logos/twitter.png",
            features: [
              "精准的广告定向",
              "多种广告形式",
              "强大的数据分析",
              "实时竞价系统",
              "广告创意库"
            ],
            details: {
              intro: "Twitter Ads是领先的广告平台之一，提供精准的广告定向和多种广告形式。平台支持实时竞价系统，让广告主能够根据数据分析调整投放策略。",
              pricing: "按点击付费(CPC)，最低预算因地区而异，通常每日$1起。",
              pros: [
                "广告定向精准",
                "广告形式多样",
                "数据分析详细",
                "实时竞价系统",
                "广告创���库丰富"
              ],
              cons: [
                "获取账户难度大",
                "政策限制多",
                "竞争激烈"
              ],
              tips: [
                "注意账户安全",
                "遵守广告政策",
                "重视数据分析",
                "保持活跃度",
                "关注行业动态"
              ]
            }
          },
          {
            title: "LinkedIn Ads",
            description: "领英广告平台",
            url: "https://business.linkedin.com/marketing-solutions",
            logo: "/logos/linkedin.png",
            features: [
              "精准的广告定向",
              "多种广告形式",
              "强大的数据分析",
              "实时竞价系统",
              "广告创意库"
            ],
            details: {
              intro: "LinkedIn Ads是领先的广告平台之一，提供精准的广告定向和多种广告形式。平台支持实时竞价系统，让广告主能够根据数据分析调整投放策略。",
              pricing: "按点击付费(CPC)，最低预算因地区而异，通常每日$1起。",
              pros: [
                "广告定向精准",
                "广告形式多样",
                "数据分析详细",
                "实时竞价系统",
                "广告创意库丰富"
              ],
              cons: [
                "获取账户难度大",
                "政策限制多",
                "竞争激烈"
              ],
              tips: [
                "注意账户安全",
                "遵守广告政策",
                "重视数据分析",
                "保持活跃度",
                "关注行业动态"
              ]
            }
          },
          {
            title: "Snapchat Ads",
            description: "Snapchat广告平台",
            url: "https://ads.snapchat.com",
            logo: "/logos/snapchat.png",
            features: [
              "精准的广告定向",
              "多种广告形式",
              "强大的数据分析",
              "实时竞价系统",
              "广告创意库"
            ],
            details: {
              intro: "Snapchat Ads是领先的广告平台之一，提供精准的广告定向和多种广告形式。平台支持实时竞价系统，让广告主能够根据数据分析调整投放策略。",
              pricing: "按点击付费(CPC)，最低预算因地区而异，通常每日$1起。",
              pros: [
                "广告定向精准",
                "广告形式多样",
                "数据分析详细",
                "实时竞价系统",
                "广告创意库丰富"
              ],
              cons: [
                "获取账户难度大",
                "政策限制多",
                "竞争激烈"
              ],
              tips: [
                "注意账户安全",
                "遵守广告政策",
                "重视数据分析",
                "保持活跃度",
                "关注行业动态"
              ]
            }
          },
          {
            title: "Pinterest Ads",
            description: "Pinterest广告平台",
            url: "https://ads.pinterest.com",
            logo: "/logos/pinterest.png",
            features: [
              "精准的广告定向",
              "多种广告形式",
              "强大的数据分析",
              "实时竞价系统",
              "广告创意库"
            ],
            details: {
              intro: "Pinterest Ads是领先的广告平台之一，提供精准的广告定向和多种广告形式。平台支持实时竞价系统，让广告主能够根据数据分析调整投放策略。",
              pricing: "按点击付费(CPC)，最低预算因地区而异，通常每日$1起。",
              pros: [
                "广告定向精准",
                "广告形式多样",
                "数据分析详细",
                "实时竞价系统",
                "广告创意库丰富"
              ],
              cons: [
                "获取账户难度大",
                "政策限制多",
                "竞争激烈"
              ],
              tips: [
                "注意账户安全",
                "遵守广告政策",
                "重视数据分析",
                "保持活跃度",
                "关注行业动态"
              ]
            }
          }
        ]
      },
      {
        name: "搜索流量",
        items: [
          {
            title: "Google Ads",
            description: "最大的搜索广告平台",
            url: "https://ads.google.com",
            logo: "/logos/google.png",
            features: [
              "精准的关键词定向",
              "全球最大搜索流量",
              "完善的优化工具",
              "多样的广告形式",
              "智能竞价系统"
            ],
            details: {
              intro: "Google Ads是全球最大的搜索广告平台，提供精准的关键词定向和丰富的流量资源。平台能完善，适合各类产品推广。",
              pricing: "按点���付费(CPC)，最低预算因地区而异，通常每日$10起。",
              pros: [
                "流量质量高",
                "转化率好",
                "定向精准",
                "数据透明",
                "工具完善"
              ],
              cons: [
                "获取账户难",
                "竞争激烈",
                "成本较高",
                "政策严格"
              ],
              tips: [
                "注意账户安全",
                "关注质量得分",
                "优化着陆页",
                "合理设置预算",
                "持续优化关键词"
              ]
            }
          },
          {
            title: "Bing Ads",
            description: "微软的搜索广告平台",
            url: "https://ads.microsoft.com",
            logo: "/logos/bing.png",
            features: [
              "成本相对较低",
              "竞争压力小",
              "导入Google Ads campaigns",
              "精准定向选项",
              "LinkedIn受众整合"
            ],
            details: {
              intro: "Bing Ads是微软的搜索广告平台，虽然流量规模不及Google，但具有成本较低、竞争较小的优势。特别适合预算有限的广告主。",
              pricing: "CPC计费，最低日预算$5起，具体价格因市场而异。",
              pros: [
                "获取账户容易",
                "竞争较小",
                "CPC较低",
                "政策相对宽松",
                "可导入Google campaigns"
              ],
              cons: [
                "流量规模小",
                "部分地区覆盖有限",
                "工具不如Google完善"
              ],
              tips: [
                "可以从Google导入广告",
                "关注独特受众群体",
                "善用LinkedIn定向",
                "注意移动端优化",
                "测试不同出价策略"
              ]
            }
          },
          {
            title: "Yandex.Direct",
            description: "俄罗斯最大的搜索广告平台",
            url: "https://direct.yandex.com",
            logo: "/logos/yandex.png",
            features: [
              "精准的关键词定向",
              "俄罗斯最大���索流量",
              "完善的优化工具",
              "多样���广告形式",
              "智能竞价系统"
            ],
            details: {
              intro: "Yandex.Direct是俄罗斯最大的搜索广告平台，提供精准的关键词定向和丰富的流量资源。平台功能完善，适合各类产品推广。",
              pricing: "按点击付费(CPC)，最低预算因地区而异，通常每日$10起。",
              pros: [
                "流量质量高",
                "转化率好",
                "定向精准",
                "数据透明",
                "工具完善"
              ],
              cons: [
                "获取账户难",
                "竞争激烈",
                "成本较高",
                "政策严格"
              ],
              tips: [
                "注意账户安全",
                "关注质量得分",
                "优化着陆页",
                "合理设置预算",
                "持续优化关键词"
              ]
            }
          },
          {
            title: "Baidu Ads",
            description: "百度广告平台",
            url: "https://e.baidu.com",
            logo: "/logos/baidu.png",
            features: [
              "精准的关键词定向",
              "中国最大搜索流量",
              "完善的优化工具",
              "多样的广告形式",
              "智能竞价系统"
            ],
            details: {
              intro: "Baidu Ads是中国最大的搜索广告平台，提供精准的关键词定向和丰富的流量资源。平台功能完善，适合各类产品推广。",
              pricing: "按点击付费(CPC)，最低预算因地区而异，通常每日$10起。",
              pros: [
                "流量质量高",
                "转化率好",
                "定向精准",
                "数据透明",
                "工具完善"
              ],
              cons: [
                "获取账户难",
                "竞争激烈",
                "成本较高",
                "政策严格"
              ],
              tips: [
                "注意账户安全",
                "关注质量得分",
                "优化着陆页",
                "合理设置预算",
                "持续优化关键词"
              ]
            }
          }
        ]
      },
      {
        name: "Adult流量",
        items: [
          {
            title: "TrafficFactory",
            description: "成人广告网络，Banner和Pop流量质量不错",
            url: "https://trafficfactory.com",
            logo: "/logos/trafficfactory.png",
            features: [
              "高质量成人流量",
              "多种广告形式",
              "精准定向选项",
              "实时报表系统",
              "防作弊机制"
            ],
            details: {
              intro: "TrafficFactory是专业的成人广告网络，提供高质量的Banner和Pop流量。平台支持多种定向选项，适合成人产品推广。",
              pricing: "最低充值$100，支持CPM/CPC模式。",
              pros: [
                "流量质量好",
                "转化率高",
                "定向选项多",
                "报表详细",
                "支持API"
              ],
              cons: [
                "部分地区限制",
                "竞争较大",
                "优质流量成本高"
              ],
              tips: [
                "注意选择合适位置",
                "测试不同创意",
                "关注ROI指标",
                "合理控制频次",
                "持续优化定向"
              ]
            }
          },
          {
            title: "Exoclick",
            description: "老牌综合广告网络，支持多种广告形式",
            url: "https://exoclick.com",
            logo: "/logos/exoclick.png",
            features: [
              "多样化广告形式",
              "全球流量覆盖",
              "智能优化系统",
              "详细的定向选项",
              "反作弊系统"
            ],
            details: {
              intro: "Exoclick是成熟的成人广告网络，提供多种广告形式和丰富的定向选项。平台技术成熟，适合各类推广需求。",
              pricing: "最低充值$200，支持多种计费模式。",
              pros: [
                "广告形式多样",
                "覆盖面广",
                "系统稳定",
                "优化工具强大",
                "支持自动化"
              ],
              cons: [
                "部分流量质量不稳定",
                "高级功能门槛高",
                "客服响应慢"
              ],
              tips: [
                "多测试不同广告形式",
                "注意流量质量筛选",
                "合理设置定向",
                "关注数据分析",
                "适时调整策略"
              ]
            }
          },
          {
            title: "JuicyAds",
            description: "专注成人广告的网络",
            url: "https://juicyads.com",
            logo: "/logos/juicyads.png",
            features: [
              "专注于成人广告",
              "全球流量覆盖",
              "智能优化系统",
              "详细的定向选项",
              "实时竞价系统"
            ],
            details: {
              intro: "JuicyAds是专注于成人广告的广告网络，提供高质量的流量和先进的定向选项。平台支持多种广告形式，包括Banner、Popunder、In-Page等。",
              pricing: "最低预算$500起，支持CPM/CPC模式，需要通过账户审核。",
              pros: [
                "广告形式多样",
                "覆盖地区广",
                "优化工具强大",
                "支持多种创意格式",
                "报表系统完善"
              ],
              cons: [
                "起投金额较高",
                "审核较严格",
                "部分地区竞争激烈"
              ],
              tips: [
                "建议从小预算测试开始",
                "注意创意规范",
                "重视素材测试",
                "关注ROI指标",
                "善用自动优化功能"
              ]
            }
          },
          {
            title: "PlugRush",
            description: "成人广告网络",
            url: "https://plugrush.com",
            logo: "/logos/plugrush.png",
            features: [
              "专注于成人广告",
              "全球流量覆盖",
              "智能优化系统",
              "详细的定向选项",
              "实时竞价系统"
            ],
            details: {
              intro: "PlugRush是专注于成人广告的广告网络，提供高质量的流量和先进的定向选项。平台支持多种广告形式，包括Banner、Popunder、In-Page等。",
              pricing: "最低预算$500起，支持CPM/CPC模式，需要通过账户审核。",
              pros: [
                "广告形式多样",
                "覆盖地区广",
                "优化工具强大",
                "支持多种创意格式",
                "报表系统完善"
              ],
              cons: [
                "起投金额较高",
                "审核较严格",
                "部分地区竞争激烈"
              ],
              tips: [
                "建议从小预算测试开始",
                "注意创意规范",
                "重视素材测试",
                "关注ROI指标",
                "善用自动优化功能"
              ]
            }
          },
          {
            title: "TrafficJunky",
            description: "PornHub背后的广告网络",
            url: "https://trafficjunky.com",
            logo: "/logos/trafficjunky.png",
            features: [
              "专注于成人广告",
              "全球流量覆盖",
              "智能优化系统",
              "详细的定向选项",
              "实时竞价系统"
            ],
            details: {
              intro: "TrafficJunky是专注于成人广告的广告网络，提供高质量的流量和先进的定向选项。平台支持多种广告形式，包括Banner、Popunder、In-Page等。",
              pricing: "最低预算$500起，支持CPM/CPC模式，需要通过账户审核。",
              pros: [
                "广告形式多样",
                "覆盖地区广",
                "优化工具强大",
                "支持多种创意格式",
                "报表系统完善"
              ],
              cons: [
                "起投金额较高",
                "审核较严格",
                "部分地区竞争激烈"
              ],
              tips: [
                "建议从小预算测试开始",
                "注意创意规范",
                "重视素材测试",
                "关注ROI指标",
                "善用自动优化功能"
              ]
            }
          }
        ]
      },
      {
        name: "Push流量",
        items: [
          {
            title: "PropellerAds",
            description: "全球领先的Push广告网络",
            url: "https://propellerads.com",
            logo: "/logos/propellerads.png",
            features: [
              "全球性Push流量覆盖",
              "智能出价系统",
              "多重定向选项",
              "实时数据统计",
              "自动优化功能"
            ],
            details: {
              intro: "PropellerAds是全球领先的Push广告网络之一，提供高质量的Push通知广告服务。平台支持多种定向选项和智能优化功能。",
              pricing: "最低充值$100，支持CPM/CPC模式。",
              pros: [
                "流量质量稳定",
                "覆盖地区广",
                "优化工具完善",
                "支持自动竞价",
                "客服响应快"
              ],
              cons: [
                "部分地区竞争激烈",
                "优质流量成本高",
                "需要持续优化"
              ],
              tips: [
                "建议小预算测试开始",
                "注意受众定向设置",
                "关注转化数据",
                "优化创意文案",
                "合理控制频次"
              ]
            }
          },
          {
            title: "RichAds",
            description: "专注于Push流量，质量较好",
            url: "https://richads.com",
            logo: "/logos/richads.png",
            features: [
              "高质量Push流量",
              "智能竞价系统",
              "反作弊机制",
              "详细的数据分析",
              "多样化定向选项"
            ],
            details: {
              intro: "RichAds是专业的Push广告平台，以其高质量的流量和完善的优化工具而闻名。平台特别注重流量质量和反作弊。",
              pricing: "最低充值$100，支持CPC/CPM计费模式。",
              pros: [
                "流量质量高",
                "转化率好",
                "定向精准",
                "报表系统完善",
                "优化工具强大"
              ],
              cons: [
                "价格相对较高",
                "部分地区流量有限",
                "审核较严格"
              ],
              tips: [
                "重视创意质量",
                "细分受众群体",
                "持续监测数据",
                "测试不同出价",
                "关注竞争对手"
              ]
            }
          },
          {
            title: "Megapu.sh",
            description: "专业的Push通知平台",
            url: "https://megapu.sh",
            logo: "/logos/megapu.png",
            features: [
              "专注Push通知",
              "实时竞价系统",
              "地理定向功能",
              "设备定向选项",
              "自动优化工具"
            ],
            details: {
              intro: "Megapu.sh是专注于Push通知广告的平台，提供稳定的流量和灵活的投放选项。平台操作简单，适合各类广告主。",
              pricing: "最低充值$50，主要采用CPC计费模式。",
              pros: [
                "入门门槛低",
                "操作简单直观",
                "定向选项丰富",
                "支持自动优化",
                "数据透明"
              ],
              cons: [
                "流量规模较小",
                "部分地区覆盖有限",
                "高级功能较少"
              ],
              tips: [
                "从小流量开始测试",
                "注意创意规范",
                "关注转化数据",
                "合理设置预算",
                "持续优化定向"
              ]
            }
          },
          {
            title: "Adsterra",
            description: "提供主流和大人弹窗流量",
            url: "https://adsterra.com",
            logo: "/logos/adsterra.png",
            features: [
              "多样化广告形式",
              "全球流量覆盖",
              "反作弊系统",
              "时报表",
              "智能优化工具"
            ],
            details: {
              intro: "Adsterra是综合性广告平台，提供Push、Pop、Banner等多种广告形式。平台支持多种支付方式，适合不同预算的广告主。",
              pricing: "最低充值$100，支持CPM/CPC/CPA等多种计费模式。",
              pros: [
                "广告形式多样",
                "流量来源稳定",
                "支持多种支付",
                "报表系统完善",
                "客服支持好"
              ],
              cons: [
                "部分流量质量不稳定",
                "竞争较大",
                "需要较多测试"
              ],
              tips: [
                "多测试不同广告形式",
                "注意流量质量",
                "关注ROI指标",
                "优化投放时间",
                "合理分配预算"
              ]
            }
          },
          {
            title: "Ad-maven",
            description: "Push为主兼顾Pop",
            url: "https://ad-maven.com",
            logo: "/logos/ad-maven.png",
            features: [
              "Push和Pop流量",
              "全球流量覆盖",
              "实时统计系统",
              "多重定向选项",
              "自动优化功能"
            ],
            details: {
              intro: "Ad-maven是专业的Push和Pop广告平台，提供全球范围的流量覆盖。平台支持多种广告形式，适合不同类型的推广需求。",
              pricing: "最低充值$50，支持CPM/CPC计费模式。",
              pros: [
                "起投金额低",
                "流量类型多样",
                "操作界面友好",
                "支持多���定向",
                "优化工具实用"
              ],
              cons: [
                "部分地区流量不稳定",
                "报表功能简单",
                "优化选项有限"
              ],
              tips: [
                "先测试小预算",
                "关注质量指标",
                "持续监测数据",
                "优化投放策略",
                "注意成本控制"
              ]
            }
          },
          {
            title: "DatsPush",
            description: "专注Push通知广告",
            url: "https://datspush.com",
            logo: "/logos/datspush.png",
            features: [
              "专注于Push通知广告",
              "全球流量覆盖",
              "实时数据统计",
              "智能优化功能",
              "多种广告形式"
            ],
            details: {
              intro: "DatsPush是专注于Push通知广告的广告网络，提供高质量的流量和先进的定向选项。平台支持多种广告形式，包括Banner、Popunder、In-Page等。",
              pricing: "最低预算$500起，支持CPM/CPC模式，需要通过账户审核。",
              pros: [
                "广告形式多样",
                "覆盖地区广",
                "优化工具强大",
                "支持多种创意格式",
                "报表系统完善"
              ],
              cons: [
                "起投金额较高",
                "审核较严格",
                "部分地区竞争激烈"
              ],
              tips: [
                "建议从小预算测试开始",
                "注意创意规范",
                "重视素材测试",
                "关注ROI指标",
                "善用自动优化功能"
              ]
            }
          },
          {
            title: "PushGround",
            description: "新兴的Push广告平台",
            url: "https://pushground.com",
            logo: "/logos/pushground.png",
            features: [
              "专注于Push广告",
              "全球流量覆盖",
              "实时数据统计",
              "智能优化功能",
              "多种广告形式"
            ],
            details: {
              intro: "PushGround是新兴的广告网络，提供高质量的流量和先进的定向选项。平台支持多种广告形式，包括Banner、Popunder、In-Page等。",
              pricing: "最低充值$500起，支持CPM/CPC模式，需要通过账户审核。",
              pros: [
                "广告形式多样",
                "覆盖地区广",
                "优化工具强大",
                "支持多种创意格式",
                "报表系统完善"
              ],
              cons: [
                "起投金额较高",
                "审核较严格",
                "部分地区竞争激烈"
              ],
              tips: [
                "建议从小预算测试开始",
                "注意创意规范",
                "重视素材测试",
                "关注ROI指标",
                "善用自动优化功能"
              ]
            }
          }
        ]
      },
      {
        name: "其他流量",
        items: [
          {
            title: "Outbrain",
            description: "优质原生广告平台",
            url: "https://outbrain.com"
          },
          {
            title: "Revcontent",
            description: "内容推荐广告平台",
            url: "https://revcontent.com"
          },
          {
            title: "AdRoll",
            description: "重定向广告平台",
            url: "https://adroll.com"
          },
          {
            title: "Perfect Audience",
            description: "重定向广告专家",
            url: "https://perfectaudience.com"
          },
          {
            title: "Criteo",
            description: "重定向广告巨头",
            url: "https://criteo.com"
          }
        ]
      }
    ]
  },
  {
    name: "综合性联盟",
    icon: "mdi:handshake",
    items: [
      {
        title: "Rakuten Advertising",
        description: "各种牛逼广告主聚集的地方",
        url: "https://rakutenadvertising.com",
        features: [
          "全球知名品牌广告主",
          "多样化的佣金模式",
          "深度链接工具",
          "报表系统完善",
          "支持多语言"
        ],
        details: {
          intro: "Rakuten Advertising是全球领先的联盟营销平台，汇集了众多知名品牌广告主，提供多样化的推广机会。",
          pricing: "免费加入，按效果付费",
          pros: [
            "品牌广告主多",
            "佣金比例高",
            "支付准时",
            "工具完善",
            "客服专业"
          ],
          cons: [
            "审核较严格",
            "部分项目门槛高",
            "竞争激烈"
          ],
          tips: [
            "注重内容质量",
            "选择适合的项目",
            "保持长期合作",
            "善用他们的工具",
            "重视数据分析"
          ]
        }
      },
      {
        title: "CJ Affiliate",
        description: "大名鼎鼎的CJ, 世界最大的营销联盟",
        url: "https://cj.com",
        features: [
          "全球最大联盟平台",
          "高质量广告主",
          "完善的追踪系统",
          "多样化支付方式",
          "强大的API支持"
        ],
        details: {
          intro: "CJ Affiliate(原Commission Junction)是全球最大的联盟营销平台，拥有最完善的系统和最多的优质广告主。",
          pricing: "免费注册，收入分成制",
          pros: [
            "平台最权威",
            "广告主质量高",
            "系统稳定性好",
            "数据分析详细",
            "支付方式多样"
          ],
          cons: [
            "审核时间长",
            "要求较高",
            "新手不友好"
          ],
          tips: [
            "准备专业的网站",
            "耐心等待审核",
            "选择合适项目",
            "重视合规性",
            "保持活跃度"
          ]
        }
      },
      {
        title: "Shareasale",
        description: "美国小型广告主聚集的公司，值得加入",
        url: "https://shareasale.com",
        features: [
          "门槛较低",
          "小型广告主多",
          "操作界面简单",
          "佣金结算及时",
          "支持多种推广"
        ],
        details: {
          intro: "Shareasale是一个面向中小型广告主的联盟平台，以其低门槛和友好的政策而闻名。平台汇集了大量优质的中小型商家，特别适合新手入门。",
          pricing: "免费注册，按销售分成",
          pros: [
            "注册门槛低",
            "审核速度快",
            "支付准时",
            "商家资源丰富",
            "操作简单直观"
          ],
          cons: [
            "部分商家佣金较低",
            "界面略显陈旧",
            "部分功能不够完善"
          ],
          tips: [
            "选择知名度高的商家",
            "关注高佣金项目",
            "保持账户活跃",
            "多尝试不同垂直领域",
            "重视数据分析"
          ]
        }
      },
      {
        title: "ClickBank",
        description: "主营业务: 各种电子书",
        url: "#",
        features: [
          "数字产品为主",
          "即时审核系统",
          "高额佣金比例",
          "全球化支付",
          "营销工具丰富"
        ],
        details: {
          intro: "ClickBank是全球最大的数字产品联盟平台之一，主要销售电子书、软件、在线课程等数字产品。平台以其高佣金率和即时审核系统而闻名。",
          pricing: "免费注册，$49.95激活费（首次销售时收取）",
          pros: [
            "佣金比例高（最高75%）",
            "支付准时可靠",
            "产品种类丰富",
            "全球化覆盖",
            "营销材料完善"
          ],
          cons: [
            "产品质量参差不齐",
            "竞争激烈",
            "退款率较高"
          ],
          tips: [
            "仔细���选产品质量",
            "关注退款率数据",
            "利用其营销工具",
            "测试不同垂直领域",
            "建立邮件列表"
          ]
        }
      },
      {
        title: "Impact",
        description: "发展极快, 广告主质量高",
        url: "#",
        features: [
          "技术领先",
          "合作伙伴优质",
          "自动化程度高",
          "报表系统强大",
          "API功能完善"
        ]
      },
      {
        title: "FlexOffers",
        description: "12,000+广告主",
        url: "#",
        features: [
          "广告主数量多",
          "审核速度快",
          "佣金比例好",
          "支付准时",
          "产品类型丰富"
        ]
      },
      {
        title: "Avangate",
        description: "专注于软件和电子产品的营销联盟",
        url: "#",
        features: [
          "软件产品为主",
          "全球化支付",
          "转化率高",
          "佣金比例好",
          "结算周期短"
        ]
      },
      {
        title: "Pepperjam",
        description: "小型广告主的最爱之一",
        url: "#"
      },
      {
        title: "TradeDoubler",
        description: "一句话: 欧洲巨头",
        url: "#"
      },
      {
        title: "Webgains",
        description: "老牌UK联盟之一",
        url: "#"
      },
      {
        title: "Avantlink",
        description: "聚集了大量的中小广告主",
        url: "#"
      },
      {
        title: "LinkConnector",
        description: "老牌联盟之一, 广告主质量不均",
        url: "#"
      },
      {
        title: "eBay Partner Network",
        description: "eBay也有自己的销售联盟噢",
        url: "#"
      },
      {
        title: "TradeTracker",
        description: "另外一家欧洲巨人",
        url: "#"
      },
      {
        title: "RevenueWire",
        description: "少见的加拿大联盟，侧重于电子商务",
        url: "#"
      },
      {
        title: "AdmitAd",
        description: "发展迅速的欧洲联盟",
        url: "#"
      }
    ]
  },
  {
    name: "CPA联盟",
    icon: "mdi:handshake-outline",
    items: [
      {
        title: "PerformCB",
        description: "曾经的Clickbooth",
        url: "#"
      },
      {
        title: "Maxbounty",
        description: "硕果仅存的老牌加拿大联盟",
        url: "#"
      },
      {
        title: "DMS Performance Ad Market",
        description: "老牌美国联盟，前身W4，再前身HydroAds",
        url: "#"
      },
      {
        title: "ClickDealer",
        description: "异军突起的老毛子联盟的代表",
        url: "#"
      },
      {
        title: "A4D",
        description: "一度没落的老牌联盟再次起飞",
        url: "#"
      },
      {
        title: "GlobalWideMedia",
        description: "曾经大名鼎鼎的NeverBlue",
        url: "#"
      },
      {
        title: "Adcombo",
        description: "近来发展迅速的老毛子联盟",
        url: "#"
      },
      {
        title: "Mobidea",
        description: "侧重于移动流量的欧洲联盟",
        url: "#"
      },
      {
        title: "Convert2media",
        description: "各种Trial Offer",
        url: "#"
      },
      {
        title: "RevenueAds",
        description: "美国中部小城的公司，信誉不错",
        url: "#"
      },
      {
        title: "AdworkMedia",
        description: "Content Locking 联盟",
        url: "#"
      },
      {
        title: "TopOffers",
        description: "Dating 联盟",
        url: "#"
      },
      {
        title: "CrakRevenue",
        description: "Adult Offer联盟",
        url: "#"
      }
    ]
  },
  {
    name: "广告论坛",
    icon: "mdi:forum",
    items: [
      {
        title: "Warriorforum",
        description: "勇士论坛",
        url: "https://warriorforum.com"
      },
      {
        title: "STM Forum",
        description: "号称高端网络营销论坛, 需要付费",
        url: "https://stmforum.com"
      },
      {
        title: "BlackHatWorld",
        description: "全球黑帽第一论坛",
        url: "https://blackhatworld.com"
      },
      {
        title: "AffiliateFix",
        description: "适合新手的论坛",
        url: "#"
      },
      {
        title: "广告中国",
        description: "最有全球影响力的中文数字营销论坛",
        url: "#"
      },
      {
        title: "Wickedfire",
        description: "老外最为专业的Marketing论坛",
        url: "#"
      },
      {
        title: "AffLift",
        description: "最近崛起的Affiliate Marketing论坛",
        url: "#"
      },
      {
        title: "DigitalPoint",
        description: "DP论坛",
        url: "#"
      }
    ]
  },
  {
    name: "SEO工具",
    icon: "mdi:magnify-scan",
    items: [
      {
        title: "SEMRush",
        description: "搜索引擎优化，关键字研究工具",
        url: "https://semrush.com",
        features: [
          "全面的关键词分析",
          "竞争对手研究",
          "网站审计功能",
          "内容营销工具",
          "排名跟踪系统"
        ],
        details: {
          intro: "SEMRush是全球领先的SEO工具之一，提供全面的数字营销解决方案，包括关键词研究、竞争对手分析、网站审计等功能。",
          pricing: "基础版$119.95/月起，提供多个套餐选择",
          pros: [
            "数据库庞大",
            "功能全面",
            "界面友好",
            "更新及时",
            "报告专业"
          ],
          cons: [
            "价格较高",
            "部分数据不准确",
            "学习曲线陡峭"
          ],
          tips: [
            "善用免费试用期",
            "按需选择套餐",
            "定期导出报告",
            "关注竞争对手动态",
            "充分利用培训资源"
          ]
        }
      },
      {
        title: "Ahrefs",
        description: "竞争对手关键字研究",
        url: "https://ahrefs.com",
        features: [
          "强大的反向链接分析",
          "关键词研究工具",
          "内容分析功能",
          "网站健康检查",
          "竞争对手分析"
        ],
        details: {
          intro: "Ahrefs是SEO专业人士首选的工具之一，以其强大的反向链接数据库和全面的SEO功能而闻名。",
          pricing: "基础版$99/月起，高级功能需要更高级别套餐",
          pros: [
            "数据更新快",
            "反向链接数据全面",
            "工具稳定可靠",
            "界面直观",
            "客服支持好"
          ],
          cons: [
            "价格昂贵",
            "免费版功能有限",
            "需要专业知识"
          ],
          tips: [
            "充分利用免费课程",
            "合理规划预算",
            "重视数据分析",
            "定期检查网站健康",
            "跟踪竞争对手变化"
          ]
        }
      },
      {
        title: "Moz",
        description: "著名的关键字研究工具",
        url: "https://moz.com",
        features: [
          "网站排名跟踪",
          "页面优化建议",
          "关��词研究",
          "本地SEO工具",
          "链接分析"
        ],
        details: {
          intro: "Moz是最早的SEO工��之一，提供全面的搜索引擎优化解决方案，特别适合初学者和中小企业。",
          pricing: "标准版$99/月起，企业版需要联系销售",
          pros: [
            "界面友好",
            "适合新手",
            "教育资源丰富",
            "工具稳定",
            "社区活跃"
          ],
          cons: [
            "数据库相对较小",
            "更新频率较慢",
            "高级功能较少"
          ],
          tips: [
            "利用免费学习资源",
            "参与社区讨论",
            "关注行业动态",
            "合理使用配额",
            "注重基础数据分析"
          ]
        }
      },
      {
        title: "Neil Patel",
        description: "著名的免费关键字研究工具",
        url: "https://neilpatel.com",
        features: [
          "免费SEO分析",
          "流量估算工具",
          "关键词建议",
          "竞争对手分析",
          "内容优化建议"
        ],
        details: {
          intro: "Neil Patel提供的免费SEO工具集合，适合预算有限的用户和初学者使用。工具简单直观，提供基础但实用的SEO分析功能。",
          pricing: "基础功能免费，高级功能需付费",
          pros: [
            "免费使用",
            "操作简单",
            "适合入门",
            "更新及时",
            "集成多个工具"
          ],
          cons: [
            "数据深度有限",
            "高级功能收费",
            "分析不够深入"
          ],
          tips: [
            "充分利用免费功能",
            "结合其他工具使用",
            "关注博客更新",
            "参考使用教程",
            "注��数据验证"
          ]
        }
      },
      {
        title: "Majestic",
        description: "最大的反向链接数据库",
        url: "https://majestic.com",
        features: [
          "大规模链接数据",
          "历史数据分析",
          "网站信任度评估",
          "竞争对手比较",
          "链接质量评分"
        ],
        details: {
          intro: "Majestic拥有全球最大的反向链接数据库之一，专注于提供深入的链接分析和网站信任度评估。",
          pricing: "基础版约$49.99/月起",
          pros: [
            "数据库庞大",
            "历史数据完整",
            "分析工具专业",
            "API支持完善",
            "更新频繁"
          ],
          cons: [
            "界面较复杂",
            "学习成本高",
            "价格不菲"
          ],
          tips: [
            "重视历史数据分析",
            "关注链接质量",
            "定期导出报告",
            "善用比较功能",
            "注意趋势变化"
          ]
        }
      }
    ]
  },
  {
    name: "邮件营销",
    icon: "mdi:email",
    items: [
      {
        title: "Mailgun",
        description: "SMTP服务商，transaction email 首选",
        url: "https://mailgun.com",
        features: [
          "可靠的邮件发送服务",
          "详细的数据分析",
          "API支持",
          "邮件验证功能",
          "自动化工具"
        ]
      },
      {
        title: "Sendgrid",
        description: "纯SMTP服务商，价格实惠",
        url: "https://sendgrid.com",
        features: [
          "高度可扩展",
          "强大的API",
          "详细的分析报告",
          "模板系统",
          "自动化营销"
        ]
      },
      {
        title: "iContact",
        description: "价格实惠的邮件营销平台",
        url: "https://icontact.com",
        features: [
          "易用的界面",
          "自动化功能",
          "A/B测试",
          "分段营销",
          "响应式模板"
        ]
      },
      {
        title: "GetResponse",
        description: "对affiliate友好的邮件营销平台",
        url: "https://getresponse.com",
        features: [
          "自动回复系统",
          "落地页创建",
          "网络研讨会功能",
          "CRM集成",
          "高级自动化"
        ]
      },
      {
        title: "Aweber",
        description: "老外都喜欢用的邮件营销平台，很严格!",
        url: "https://aweber.com",
        features: [
          "自动回复系统",
          "邮件模板",
          "列表管理",
          "分析报告",
          "API集成"
        ]
      },
      {
        title: "Mailchimp",
        description: "全平台的邮件营销平台",
        url: "https://mailchimp.com",
        features: [
          "全面的营销工具",
          "智能分析",
          "自动化工作流",
          "受众细分",
          "A/B测试"
        ]
      },
      {
        title: "Constant Contact",
        description: "适合小型企业的邮件营销平台",
        url: "https://constantcontact.com",
        features: [
          "易用的界面",
          "丰富的模板",
          "活动管理",
          "社交媒体整合",
          "实时报告"
        ]
      }
    ]
  },
  {
    name: "电商平台",
    icon: "mdi:shopping",
    items: [
      {
        title: "亚马逊",
        description: "电商出海的第一站",
        url: "https://amazon.com"
      },
      {
        title: "eBay",
        description: "电商鼻祖",
        url: "https://ebay.com"
      },
      {
        title: "速卖通",
        description: "阿里巴巴速卖通，中小卖家的福音",
        url: "https://aliexpress.com"
      },
      {
        title: "Shopify",
        description: "各种大牛的聚集地",
        url: "https://shopify.com"
      }
    ]
  },
  {
    name: "联盟后台",
    icon: "mdi:view-dashboard",
    items: [
      {
        title: "GetCake",
        description: "目前追踪最准价格最贵的平台",
        url: "#"
      },
      {
        title: "Tune(原hasoffers)",
        description: "用户使用最多的平台之一",
        url: "#"
      },
      {
        title: "Hitpath",
        description: "曾经是美国大型联盟的最爱",
        url: "#"
      },
      {
        title: "Linktrust",
        description: "号称追踪最准确，可惜自己作死",
        url: "#"
      },
      {
        title: "Affise",
        description: "新晋崛起的Performance Marketing Platform服务商",
        url: "#"
      },
      {
        title: "Offerslook",
        description: "亚洲客户比较多",
        url: "#"
      },
      {
        title: "Offer18",
        description: "入门级，价格比较便宜",
        url: "#"
      },
      {
        title: "Fuseclick",
        description: "国产服务商",
        url: "#"
      },
      {
        title: "PostAffiliatePro",
        description: "小型广告主最喜欢的联盟程序之一",
        url: "#"
      }
    ]
  },
  {
    name: "域名注册",
    icon: "mdi:web",
    items: [
      {
        title: "Dynadot",
        description: "对国人友好，支持支付宝，价格一般",
        url: "#"
      },
      {
        title: "Namecheap",
        description: "域名注册并不便宜，网站UI反应很慢，直接���问速度更慢",
        url: "https://namecheap.com"
      },
      {
        title: "Name.com",
        description: "历史悠久的域名注册商，界面清爽",
        url: "#"
      },
      {
        title: "Godaddy",
        description: "戏称'狗爹', 全球排名第一的域名注册商",
        url: "https://godaddy.com"
      }
    ]
  },
  {
    name: "云服务器(主流)",
    icon: "mdi:server",
    items: [
      {
        title: "NetActuate",
        description: "前HostVirtual, 前前vr.org, 全球网络服务商",
        url: "#"
      },
      {
        title: "Bandwagonhost",
        description: "优质CN2GIA服务商，信誉良好，富强的最爱",
        url: "#"
      },
      {
        title: "Vultr",
        description: "Choopa旗下品牌，价格厚道",
        url: "https://vultr.com"
      },
      {
        title: "DigitalOcean",
        description: "低价优质的策略，成为AWS的有利竞争者",
        url: "https://digitalocean.com"
      },
      {
        title: "Linode",
        description: "网络好, 服务稳定，affiliate的最爱之一",
        url: "https://linode.com"
      },
      {
        title: "腾讯云",
        description: "腾讯的云服务",
        url: "#"
      },
      {
        title: "阿里云",
        description: "阿里巴巴旗下品牌，有国内版和国际版，国际版厚道",
        url: "#"
      },
      {
        title: "谷歌云(GCP)",
        description: "谷歌的云服务, 厚道, 大量白女票用户",
        url: "#"
      },
      {
        title: "Azure",
        description: "微软的云服务，大企业的最爱，价格昂贵",
        url: "#"
      },
      {
        title: "AWS",
        description: "大名鼎鼎的AWS",
        url: "#"
      }
    ]
  },
  {
    name: "独立服务器",
    icon: "mdi:server-network",
    items: [
      {
        title: "CeraNetworks",
        description: "防DDos服务商，Hostloc服务器所在机房",
        url: "#"
      },
      {
        title: "PhoenixNAP",
        description: "凤凰城优质机房",
        url: "#"
      },
      {
        title: "Hivelocity",
        description: "立足于Florida, 多个机房面向全美服务",
        url: "#"
      },
      {
        title: "Krypt",
        description: "优质的CN2GIA服务商之一，贵族机房",
        url: "#"
      },
      {
        title: "Psychz",
        description: "业界俗称'饭桶', 鸡迷路, 神一样的路由",
        url: "#"
      },
      {
        title: "QuadraNet",
        description: "洛杉矶机房的优质服务商，推荐",
        url: "#"
      },
      {
        title: "Leaseweb",
        description: "荷兰巨头，全球服务",
        url: "#"
      },
      {
        title: "Rackspace",
        description: "提供managed服务，价格昂贵，大型企业的最爱",
        url: "#"
      },
      {
        title: "Softlayer",
        description: "现在变身IBM Cloud, 价格昂贵，拥有最好的network 和 服务",
        url: "#"
      }
    ]
  },
  {
    name: "支付服务",
    icon: "mdi:credit-card",
    items: [
      {
        title: "Paxum",
        description: "Affiliate最常用的支付工具之一",
        url: "https://paxum.com"
      },
      {
        title: "Payoneer",
        description: "以色列支付工具，对中国友好",
        url: "https://payoneer.com"
      },
      {
        title: "WebMoney",
        description: "俄罗斯支付工具，很多老毛子联盟都用",
        url: "#"
      },
      {
        title: "Capitalist",
        description: "新兴的支付工具，很多老毛子联盟都在用",
        url: "#"
      },
      {
        title: "Wise",
        description: "原TransferWise，跨境支付利器",
        url: "https://wise.com"
      }
    ]
  },
  {
    name: "VPS代理",
    icon: "mdi:server-network",
    items: [
      {
        title: "911",
        description: "老牌代理服务商",
        url: "#"
      },
      {
        title: "芝麻代理",
        description: "国内代理服务商",
        url: "#"
      },
      {
        title: "阿伟云",
        description: "性价比不错的代理",
        url: "#"
      }
    ]
  },
  {
    name: "落地页工具",
    icon: "mdi:web-box",
    items: [
      {
        title: "Instapage",
        description: "制作落地页的利器",
        url: "https://instapage.com"
      },
      {
        title: "Unbounce",
        description: "专业的落地页制作工具",
        url: "https://unbounce.com"
      },
      {
        title: "Leadpages",
        description: "简单易用的落地页工具",
        url: "https://leadpages.com"
      }
    ]
  }
]; 