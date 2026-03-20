# WezTerm 终端阅读工具（Ubuntu）

在 WezTerm 里阅读 Markdown、代码和图片的实用组合。

## Markdown（含表格）

- 安装（推荐 Go 版，避免 snap 沙箱限制）：
  - `go install github.com/charmbracelet/glow@latest`
  - `export PATH="$(go env GOPATH)/bin:$PATH"`
- 使用：`glow README.md`
- 分页：`glow README.md | less -R`
- 可选（不是必须）：
  - `mdcat`：`sudo snap install mdcat` 或 `cargo install mdcat`

## glow 安装与常见问题

- `apt install glow` 失败：
  - Ubuntu 某些源没有 `glow` 包，提示有 snap 包是正常现象。
- `snap` 版能装但读不到 `/opt/...`：
  - 常见原因是 snap 沙箱限制，表现为文件打开失败。
  - 临时绕过：`cat /opt/code/xxx/README.md | glow -`
- 从 snap 切到 Go 版：
  - `sudo snap remove glow`
  - `go install github.com/charmbracelet/glow@latest`
  - `export PATH="$(go env GOPATH)/bin:$PATH"`
  - `hash -r`
- 命令还指向旧的 `/snap/bin/glow`：
  - `hash -r`
  - `unalias glow 2>/dev/null || true`
  - `type -a glow`
- 多机排查（为什么一台可用、一台不可用）：
  - `type -a glow`
  - `which glow`
  - `snap list glow`
- 版本显示 `glow version unknown (built from source)`：
  - Go 源码安装常见现象，可正常使用。
- 持久化 PATH：
  - `echo 'export PATH=\"$(go env GOPATH)/bin:$PATH\"' >> ~/.bashrc`
  - `source ~/.bashrc`
- `ERROR: ld.so ... libonion.so` 警告：
  - 与 `glow` 功能本身无直接关系，属于系统动态库预加载配置问题。

## 代码阅读

- `nvim`：阅读/编辑都适合
- `bat`（语法高亮）：
  - 安装：`sudo apt install bat`
  - Ubuntu 默认命令名是 `batcat`
  - 使用：`batcat file.ts`
- `rg`（快速搜索）：
  - 安装：`sudo apt install ripgrep`
  - 使用：`rg "关键词" -n .`

## 图片（终端里只能凑合）

- `chafa`（ASCII 预览）：
  - 安装：`sudo apt install chafa`
  - 使用：`chafa image.png`
- 看清楚：`xdg-open image.png`

## WezTerm 使用建议

- 左右分屏：左侧 `nvim` 看代码，右侧 `glow` 看文档
- 常用操作：绑定快捷键或通过 Command Palette 快速执行
