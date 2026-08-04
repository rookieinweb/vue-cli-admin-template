# 智能客户运营管理平台前端

基于 **Vue3 + Vite + Element Plus** 开发的企业级后台管理系统前端项目。

该项目主要用于企业客户信息管理、销售过程跟踪、客户数据分析及权限管理。

采用前后端分离架构：

- 前端：Vue3 管理后台
- 后端：Egg.js API 服务
- 数据库：MySQL
- 部署：Nginx + Node.js + PM2


---

# 项目简介


智能客户运营管理平台（Smart CRM）是一套面向企业销售团队的客户管理系统。


主要解决：

- 客户信息分散管理问题
- 销售跟进流程不规范问题
- 客户状态无法统计分析问题
- 用户权限管理问题


系统支持：

- 用户登录认证
- 客户信息管理
- 客户跟进记录
- 客户状态管理
- 数据统计分析
- RBAC权限控制
- 动态菜单加载


---

# 技术栈


## 前端技术


| 技术 | 说明 |
| --- | --- |
| Vue3 | 前端核心框架 |
| Vite | 项目构建工具 |
| Vue Router | 路由管理 |
| Pinia | 状态管理 |
| Element Plus | UI组件库 |
| Axios | HTTP请求库 |
| ECharts | 数据可视化 |
| JavaScript / TypeScript | 开发语言 |


---

# 项目架构


```
Vue3 Web

    |

Axios

    |

Egg.js API

    |

Sequelize

    |

MySQL
```


---

# 项目目录结构


```
crm-web

├── public
│
├── src
│
│   ├── api              # 接口请求封装
│   │
│   ├── assets           # 静态资源
│   │
│   ├── components       # 公共组件
│   │
│   ├── layouts          # 页面布局
│   │
│   ├── router           # 路由配置
│   │
│   ├── store            # Pinia状态管理
│   │
│   ├── utils            # 工具方法
│   │
│   ├── views            # 页面模块
│   │
│   ├── permission       # 权限控制
│   │
│   ├── App.vue
│   │
│   └── main.js
│
├── vite.config.js
│
├── package.json
│
└── README.md
```


---

# 功能模块


## 1. 用户认证


实现：

- 用户登录
- Token保存
- Token自动携带
- 登录状态校验
- 登录过期处理


登录流程：


```
输入账号密码

↓

调用登录接口

↓

获取JWT Token

↓

保存Token

↓

请求接口携带Token

↓

访问业务页面

```


---

# 2. RBAC权限管理


系统采用：

```
用户(User)

↓

角色(Role)

↓

权限(Permission)

↓

菜单(Menu)

```


支持：


- 动态菜单生成
- 动态路由加载
- 按钮权限控制
- 页面访问权限控制


实现方式：


```
登录成功

↓

获取用户权限

↓

生成Vue Router路由

↓

动态注册页面

↓

展示对应菜单

```


---

# 3. 首页数据看板


首页提供企业运营数据展示。


包含：

- 客户数量统计
- 客户状态统计
- 跟进数量统计
- 销售趋势分析
- 数据图表展示


使用：

```
ECharts
```


实现数据可视化。


---

# 4. 客户管理


客户列表支持：


- 客户分页查询
- 客户搜索
- 客户新增
- 客户编辑
- 客户删除
- 客户状态管理


客户信息包括：

```
客户编号

客户名称

手机号

微信

邮箱

客户来源

客户状态

负责人
```


---

# 5. 客户跟进管理


记录销售人员跟进过程。


功能：

- 新增跟进记录
- 查看历史跟进
- 跟进时间管理
- 跟进方式管理


数据包括：

```
客户

跟进人员

跟进内容

跟进时间

跟进类型
```


---

# 6. 通用组件


封装公共组件：


- 查询搜索组件
- 分页组件
- 表格组件
- 弹窗组件
- 上传组件
- 权限按钮组件


---

# Axios请求封装


统一处理：


- 请求拦截
- Token注入
- 响应处理
- 错误提示
- 登录过期跳转


示例：


```javascript
axios.interceptors.request.use(
config => {

    config.headers.Authorization =
    token

    return config

}
)
```


---

# 环境配置


## 开发环境


.env.development


```env
VITE_API_URL=http://localhost:7001
```


## 生产环境


.env.production


```env
VITE_API_URL=https://your-domain.com/api
```


---

# 本地运行


安装依赖：


```bash
npm install
```


启动开发环境：


```bash
npm run dev
```


访问：


```
http://localhost:5173
```


---

# 项目打包


执行：


```bash
npm run build
```


生成：


```
dist
```


目录。


---

# 生产部署


部署架构：


```
用户访问

↓

Nginx

↓

Vue dist静态文件

↓

Egg.js API

↓

MySQL

```


---

## Nginx配置示例


```nginx
server {


    location / {

        root /www/crm-web/dist;

        index index.html;

        try_files $uri $uri/ /index.html;

    }


    location /api/ {


        proxy_pass http://127.0.0.1:7001/;


        proxy_set_header Host $host;


        proxy_set_header X-Real-IP $remote_addr;


    }

}
```


---

# 开发规范


## 页面开发


页面统一放：

```
src/views
```


例如：

```
views

├── login

├── dashboard

├── customer

└── system
```


---

## 接口管理


统一放：

```
src/api
```


示例：


```javascript
export function getCustomerList(params){

    return request({

        url:'/customer/list',

        method:'get',

        params

    })

}
```


---

# 状态管理


使用 Pinia。


主要管理：


- 用户信息
- Token
- 权限列表
- 菜单数据


目录：

```
src/store
```


---

# 项目部署环境


服务器：

```
Ubuntu
```


服务：

```
Nginx

Node.js

PM2

MySQL
```


部署流程：

```
代码提交

↓

服务器拉取

↓

npm install

↓

npm run build

↓

上传dist

↓

Nginx代理

↓

上线
```


---

# 项目开发经历


## 项目开发过程中主要负责：


### 前端架构搭建

- Vue3项目初始化
- Vite工程配置
- Axios请求封装
- 路由权限设计


### 后台管理功能开发

- 登录认证模块
- 用户权限模块
- 客户管理模块
- 客户跟进模块
- 数据看板模块


### 前后端联调

- RESTful接口对接
- Token认证联调
- 数据分页处理
- 参数校验


### 项目部署

- Linux服务器部署
- Nginx配置
- 前端生产环境发布


---

# Git提交规范


新增功能：

```
feat: 新增客户管理页面
```


修复问题：

```
fix: 修复客户列表分页问题
```


代码优化：

```
refactor: 优化权限路由加载
```


---

# License


MIT
