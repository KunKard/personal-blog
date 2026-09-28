# personal-blog

游戏开发者个人主页：Next.js 16 App Router + TypeScript + Tailwind v4，静态导出后由 GitHub
Actions 部署到 GitHub Pages。

## 作品集数据

`data/projects.json` 是作品集的唯一数据源 —— Supabase 未配置时（`.env.local` 里还是占位符），
`src/lib/db/projects.ts` 会走 `localStore` 分支直接读这个 JSON 文件。

**新增作品请走 `scripts/add-project.mjs`，不要手改 JSON。** 完整流程见
[docs/ADD-PROJECT.md](docs/ADD-PROJECT.md)：在游戏项目里准备 `.portfolio/project.json`
和封面图，然后

```bash
node scripts/add-project.mjs "<游戏项目路径>/.portfolio/project.json"
```

脚本负责校验、复制图片、生成 id/slug/时间戳，并追加到 `data/projects.json`。

## 常用命令

| 命令 | 作用 |
|---|---|
| `npm run dev` | 本地开发（会先跑 `clean-dev.mjs`，并还原 API 路由） |
| `npm run build` | 静态导出构建。`prebuild` 临时移走 API 路由到 `src/app-api-backup/`，`postbuild` 再还原 |
| `node scripts/make-placeholder-cover.mjs` | 重新生成无封面时用的占位图 |

构建后如果看到 `src/app-api-backup/`，那是仓库里本来就有的备份文件，不是异常。

## 其他数据文件

`data/` 下还有 `posts.json`、`timeline.json`、`site-settings.json`，分别对应博客文章、
开发时间轴和站点设置。当前都没有对应的写入脚本，改动时保持和 `src/lib/types/` 里的类型一致。
