# Astro Starter Kit: Minimal

```sh
npm create astro@latest -- --template minimal
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/minimal)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/minimal)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/minimal/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

设置步骤：
在 GitHub 上生成 Personal Access Token：
访问 https://github.com/settings/tokens
点击 "Generate new token (classic)"
选择 "repo" 权限
生成并复制 token
在 Astro-nav 仓库添加 secret：
访问 https://github.com/51nav/Astro-nav/settings/secrets/actions
点击 "New repository secret"
Name: GIT_TOKEN
Value: 粘贴刚才生成的 token
点击 "Add secret"
这样设置的优点：
不需要生成和管理 SSH 密钥
更容易设置和维护
可以更精细地控制权限






```yaml:.github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout source repo
        uses: actions/checkout@v4

      - name: Install and Build
        uses: withastro/action@v3

      - name: Deploy to GitHub Pages repo
        uses: peaceiris/actions-gh-pages@v3
        with:
          personal_token: ${{ secrets.GIT_TOKEN }}
          external_repository: 51nav/51nav.github.io
          publish_branch: main
          publish_dir: ./dist
```

设置步骤：

1. 在 GitHub 上生成 Personal Access Token：
   - 访问 https://github.com/settings/tokens
   - 点击 "Generate new token (classic)"
   - 选择 "repo" 权限
   - 生成并复制 token

2. 在 Astro-nav 仓库添加 secret：
   - 访问 https://github.com/51nav/Astro-nav/settings/secrets/actions
   - 点击 "New repository secret"
   - Name: `GIT_TOKEN`
   - Value: 粘贴刚才生成的 token
   - 点击 "Add secret"

这样设置的优点：
1. 不需要生成和管理 SSH 密钥
2. 更容易设置和维护
3. 可以更精细地控制权限

