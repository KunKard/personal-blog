-- Sample seed data for development

-- Seed projects
INSERT INTO projects (slug, title, tagline, description, category, tags, tech_stack, status, dev_duration, team_size, my_role, featured, sort_order) VALUES
('pixel-dungeon', 'Pixel Dungeon', '一款像素风格的地下城探险游戏', '在随机生成的地牢中探索、战斗、收集宝藏。使用独特的像素艺术风格呈现暗黑奇幻的地下世界。', 'game', ARRAY['2D', '像素', 'Roguelike', '地牢'], ARRAY['Unity', 'C#', 'Aseprite'], 'published', '6个月', 1, '全部（程序、美术、设计）', true, 1),
('neon-runner', 'Neon Runner', '赛博朋克风格跑酷游戏', '在霓虹闪烁的赛博城市中奔跑、跳跃、滑行，挑战最高分数。', 'game', ARRAY['2D', '赛博朋克', '跑酷', '休闲'], ARRAY['Unity', 'C#', 'Photoshop'], 'published', '3个月', 1, '全部', true, 2),
('game-jam-2025', 'Ludum Dare 57 作品', '48小时游戏开发马拉松', '主题: "Deep" - 一款关于深海探索的小游戏', 'jam', ARRAY['GameJam', '48小时', '深海'], ARRAY['Unity', 'C#', 'FMOD'], 'published', '48小时', 1, '全部', false, 3);

-- Seed posts
INSERT INTO posts (slug, title, excerpt, content, category, tags, status, reading_time, published_at) VALUES
('unity-2d-best-practices', 'Unity 2D 游戏开发最佳实践', '总结我在 Unity 2D 项目开发中积累的经验和教训。', '# Unity 2D 开发最佳实践\n\n## 项目结构\n...', 'tutorial', ARRAY['Unity', '2D', 'Best Practices'], 'published', 8, NOW()),
('pixel-art-guide', '像素画入门指南', '从零开始学习像素画的基础知识和技巧。', '# 像素画入门指南\n\n像素画是一种独特的数字艺术形式...', 'tutorial', ARRAY['像素画', 'Aseprite', '入门'], 'published', 12, NOW()),
('my-first-game-jam', '我的第一次 Game Jam 经历', '参加 Ludum Dare 的体验和收获。', '# 第一次 Game Jam\n\n紧张、刺激、充满挑战...', 'devlog', ARRAY['GameJam', '经验', 'LudumDare'], 'published', 6, NOW());

-- Seed timeline
INSERT INTO timeline_entries (date, title, description, category, icon) VALUES
('2024-09-01', '开始学习 Unity', '从零开始接触游戏引擎，完成第一个 Roll-a-Ball 教程', 'learning', '🎓'),
('2024-11-15', '完成第一款小游戏', '使用 Unity 2D 制作了一款简单的平台跳跃游戏', 'milestone', '🎮'),
('2025-01-20', '参加第一次 Game Jam', 'Ludum Dare 56，48小时挑战完成', 'jam', '⏰'),
('2025-03-01', '开始学习像素画', '入手 Aseprite，开始系统学习像素艺术', 'learning', '🎨'),
('2025-06-15', 'Pixel Dungeon 项目启动', '开始开发第一款完整的独立游戏', 'project', '🚀'),
('2026-01-10', 'Pixel Dungeon 发布 Demo', '在 itch.io 上发布了第一个可玩 Demo', 'demo', '📦');
