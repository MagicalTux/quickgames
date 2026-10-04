# Quick Games

Small browser games, served with GitHub Pages at https://magicaltux.github.io/quickgames/.

- [Colorballs](colorballs/): tap pipes to pour colored balls onto a conveyor belt and fill the matching trays. Don't let the belt jam.

Each game is a single self-contained `index.html` in its own folder. Open it in a browser to play locally.

`node scripts/check.mjs` checks that every page has a title and that its scripts parse. CI runs it on every push and pull request, then deploys `master` to Pages.
