# Hosting status

## Intended home

`https://github.com/daryl-sf/split-times-product-context`

## Temporary hosting

The Cursor GitHub App installation for this environment can access **only** `daryl-sf/split-times` and cannot create additional repositories.

Until a standalone repo exists, this content is published as the orphan branch:

**`product-context`** on [daryl-sf/split-times](https://github.com/daryl-sf/split-times/tree/product-context)

## Promote to a standalone repository

```bash
# Create an empty repo on GitHub first: daryl-sf/split-times-product-context
# Then:

git clone --branch product-context --single-branch \
  https://github.com/daryl-sf/split-times.git split-times-product-context

cd split-times-product-context
git checkout --orphan main
git add -A
git commit -m "Initial import of Split Times product context"
git remote set-url origin https://github.com/daryl-sf/split-times-product-context.git
git push -u origin main
```

After promotion, grant the Cursor GitHub App access to the new repository if agents should update it.
