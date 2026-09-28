# 把游戏项目接入博客作品集

这份文档写给**正在游戏项目文件夹里工作、手上没有博客仓库上下文**的 Agent。

博客仓库位置：`D:\杂物文件夹\个人博客\personal-blog`

你的任务只有一件事：**在游戏项目里准备一份 JSON 和一张封面图，然后调用博客仓库里的脚本把它们写进去。** 你不需要、也不应该修改博客的源代码。

---

## 一、准备工作：在游戏项目里建 `.portfolio/`

在你的游戏项目根目录下建一个 `.portfolio/` 文件夹，放两样东西：

```text
<游戏项目>/
└── .portfolio/
    ├── project.json     ← 你写的展示数据
    └── cover.png        ← 封面图（从项目截图里挑一张复制过来）
```

`.portfolio/` 是暂存区，脚本读完之后你可以保留它，也可以删掉。

---

## 二、字段说明

`project.json` 只填**内容**。像 `id`、`slug`、时间戳、排序号这些机械字段全部由脚本生成 —— 不要自己写，写了也会被忽略。

| 字段 | 必填 | 说明 |
|---|---|---|
| `title` | ✅ | 项目名。如果里面**全是中文**，必须额外给一个 ASCII 的 `slug`（见下） |
| `slug` | 中文标题时必填 | URL 用的英文短名，小写字母 + 连字符，如 `"my-roguelike"` |
| `tagline` | ✅ | 一句话卖点。卡片上只显示两行，控制在 60 字以内 |
| `description` | 建议填 | 详情页正文，支持 Markdown，写法见第四节 |
| `category` | ✅ | 只能从这六个里选：`game`（游戏）、`jam`（Game Jam）、`tool`（工具）、`demo`（Demo）、`remake`（复刻）、`other`（其他） |
| `tags` | 建议填 | 最多 5 个。卡片只显示前 3 个，多的用 `+N` 折叠 |
| `tech_stack` | 建议填 | 用到的技术，自由文本，最多 8 个。**注意统一写法**：写 `UGUI` 就别在别的项目里写 `Unity UGUI`；`C#` 不要写成 `CSharp` |
| `dev_duration` | 可选 | 开发时长，如 `"4 天"`、`"3 周"` |
| `team_size` | 可选 | 正整数，不填默认 1 |
| `my_role` | 可选 | 你的职责，不填默认 `"开发者"` |
| `github_url` | 可选 | 仓库地址 |
| `download_links` | 可选 | 数组，每项 `{ "label": "百度网盘", "url": "https://..." }` |
| `cover` | 可选 | 封面图文件名，相对于 `.portfolio/`。不填或找不到就用占位图 |
| `postmortem` | 可选 | 项目复盘，纯文本，详情页单独成段 |

### 一个完整例子

```json
{
  "title": "My Roguelike Prototype",
  "tagline": "一个关于分拣邮件的微型 Roguelike",
  "description": "本项目是……（见下方模板）",
  "category": "demo",
  "tags": ["Unity", "Roguelike", "原型"],
  "tech_stack": ["Unity", "C#", "DOTween"],
  "dev_duration": "2 周",
  "team_size": 1,
  "my_role": "独立开发",
  "github_url": "https://github.com/KunKard/my-roguelike",
  "download_links": [
    { "label": "百度网盘", "url": "https://pan.baidu.com/s/xxxx?pwd=yyyy" }
  ],
  "cover": "cover.png"
}
```

中文标题的例子（注意多了 `slug`）：

```json
{
  "title": "塔防原型",
  "slug": "tower-defense-proto",
  "tagline": "带寻路和波次系统的塔防原型",
  "category": "demo"
}
```

---

## 三、封面图

- 从游戏项目的截图 / 美术素材里**挑一张复制到 `.portfolio/`**，命名为 `cover.png` 或 `cover.jpg`。
- 支持 `.png` `.jpg` `.jpeg` `.webp` `.gif`。
- **宽度至少 400px**，推荐 16:9（比如 1280×720、1920×1080）。卡片和详情页都会按 16:9 裁切，比例差太多会被明显切掉。
- 没有合适的图就**不填 `cover`**，脚本会自动用博客的占位图（一个像素风手柄，见 `public/images/placeholder-cover.png`）。不要为了凑数截一张全是灰色的编辑器窗口。

脚本会把图片复制成 `public/images/<slug>-cover.<ext>`，所以在你项目里叫什么都无所谓，不会跟别的项目撞名。

---

## 四、description 的写法

详情页用 `react-markdown` 渲染，支持加粗、列表、标题、链接、代码块。

博客里已有三个项目都用了同一套结构，**照这个格式写**，风格才统一：

```markdown
一句话说清这是什么项目。

**核心功能：**
- 🎴 **抽卡系统**：单抽 / 十连抽，从卡池随机抽取物品
- 🎒 **背包系统**：6 列网格布局，点击查看详情
- 💾 **JSON 存档**：写入 persistentDataPath，启动自动加载

**📐 实现亮点：**
- 虚拟列表替代全量实例化，上万物品也能流畅滚动
- 事件驱动替代每帧轮询，减少无用开销
```

要点：

- 每条用 `- emoji **粗体小标题**：说明` 的格式，emoji 用来做视觉锚点。
- 写**技术决策和取舍**，不要写"实现了 XX 功能"这种流水账。面试官关心的是你为什么这么做、遇到了什么坑、怎么解决的。
- 段落之间空一行。JSON 里换行要写成 `\n`。

---

## 五、调用脚本

在**博客仓库目录**下执行：

```bash
cd "D:\杂物文件夹\个人博客\personal-blog"
node scripts/add-project.mjs "<你的游戏项目绝对路径>/.portfolio/project.json"
```

例如：

```bash
node scripts/add-project.mjs "D:\杂物文件夹\MyGame\.portfolio\project.json"
```

脚本会：

1. 校验所有字段，**发现问题就一次性全部列出来并退出，不会写入任何东西**；
2. 把封面复制到 `public/images/`；
3. 生成 `id` / `slug` / 时间戳 / `sort_order`；
4. 追加到 `data/projects.json`。

成功后你会看到类似输出：

```text
✓ added "My Roguelike Prototype"
  slug      my-roguelike-prototype
  cover     /images/my-roguelike-prototype-cover.png
  copied cover -> public/images/my-roguelike-prototype-cover.png (1920x1080)
```

### 常见报错

| 报错 | 怎么办 |
|---|---|
| `cannot derive a slug from title` | 标题是中文，加一个 ASCII 的 `slug` 字段 |
| `slug "xxx" is already used by "yyy"` | 这个项目已经在作品集里了。**别自己改 slug 绕过** —— 去问用户是要更新已有条目还是真的有同名新项目 |
| `category "xxx" is not one of` | 从六个合法值里选一个 |
| `cover is 320x180 — too small` | 换一张更大的图，或者不填 `cover` 用占位图 |
| `cover "xxx" not found next to the payload` | 路径写错了，检查 `.portfolio/` 里文件名拼写 |

---

## 六、验证

```bash
npm run build
```

构建通过即可。想看得更直观就 `npm run dev`，然后打开 `/projects` 和 `/projects/<你的 slug>`，确认：

- 卡片上有封面图，不是破图也不是占位图（除非你本来就没提供）
- 标签显示正常，没有乱码
- 详情页正文的 Markdown 渲染正确，加粗和列表都在
- 侧边栏的开发时长、团队人数、技术栈是对的

> 构建时 `prebuild` 会临时把 API 路由搬到 `src/app-api-backup/`，`postbuild` 再搬回来，这是正常的，别手动干预。如果你在构建后看到 `src/app-api-backup/` 目录，那是仓库里本来就有的文件。

---

## 七、不要做的事

- **不要修改博客的任何源代码**（`src/` 下的文件）。新增作品纯粹是数据操作。
- **不要动 `data/` 里的其他文件**（`posts.json`、`timeline.json`、`site-settings.json`）。
- **不要 `git commit` 或 `git push`**。部署由 GitHub Actions 在推送后触发，推了就直接上线了。让用户自己看完预览再决定。
- **不要手动填 `id`、`created_at`、`sort_order`、`status`、`featured`** —— 前四个由脚本生成，`featured` 是用户手动挑选的（见下）。

---

## 八、几个当前不支持的东西

| 功能 | 状态 |
|---|---|
| **在线试玩（WebGL）** | 详情页的"在线试玩"按钮走 `/games/<slug>/` 路由，但那条路由目前只为占位符生成页面，**不会为你的项目自动生成**。所以脚本固定把 `webgl_game_slug` 写成 `null`。要接入需要用户先改代码。 |
| **宣传视频** | 数据字段 `video_url` 存在，但详情页**完全没渲染**，填了等于没填。 |
| **游戏截图轮播** | `screenshots` 字段存在且详情页会渲染，但当前**没有接入流程** —— 脚本固定写成 `[]`。有需要让用户手动加。 |

---

## 九、精选与排序（用户手动操作）

脚本创建的新条目：

- `featured: false` —— **首页"精选作品"只显示 `featured: true` 的，且最多 6 个**。是否精选由用户自己挑，你不要改。
- `sort_order` 是当前最大值 +1，也就是排在最后。

用户可以手动编辑 `data/projects.json` 调整这两项，`sort_order` 越大排越前。

---

## 十、参考

想看你写出来的东西和已有条目是否一致，读这几个现成的例子：

- `data/projects.json` —— 三个已发布项目，是格式的权威参考
- `src/lib/types/project.ts` —— 字段类型定义
- `src/app/(public)/projects/[slug]/page.tsx` —— 详情页渲染逻辑，能看到每个字段最终显示在哪
