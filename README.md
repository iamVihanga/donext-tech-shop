# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)

---

<!--
  admin@techshop.lk
  techshopAdmin
-->

<!--

Product Creation Prepared Data Object

{
    "product": {
        "name": "MSI Gaming Laptop",
        "slug": "msi-gaming-laptop",
        "description": "fsdfdsf",
        "shortDescription": "MSI is most poweful gaming laptop in this era",
        "price": "0.00",
        "sku": "MSI-GAMING-LAPTOP",
        "reservedQuantity": 0,
        "stockQuantity": 0,
        "minStockLevel": 1,
        "weight": "240.00",
        "dimensions": "20 x 50 x 10 cm",
        "categoryId": "a20755fe-ace9-4c36-86cd-b3bf6a348065",
        "subcategoryId": "8b8f6205-fc69-4931-b561-5c8d568c1a02",
        "isActive": true,
        "isFeatured": false,
        "requiresShipping": true,
        "metaTitle": null,
        "metaDescription": null,
        "tags": null
    },
    "images": [
        {
            "imageUrl": "https://donext.s3.ap-south-1.amazonaws.com/techshop/gallery/deluxe-banner-1751132567276-d7b230492e725997.jpg",
            "altText": "MSI Gaming Laptop",
            "sortOrder": 0,
            "isThumbnail": true
        },
        {
            "imageUrl": "https://donext.s3.ap-south-1.amazonaws.com/techshop/gallery/ecd064534ef23d47b210a44ac563ec28-1751133232180-243ddfa51041b4a9.jpeg",
            "altText": "MSI Gaming Laptop",
            "sortOrder": 1,
            "isThumbnail": false
        },
        {
            "imageUrl": "https://donext.s3.ap-south-1.amazonaws.com/techshop/gallery/img-hotel-glendower-nuwara-eliya-28-1751133560453-c45e4e5b37255237.jpg",
            "altText": "MSI Gaming Laptop",
            "sortOrder": 2,
            "isThumbnail": false
        }
    ],
    "variants": [
        {
            "name": "Red",
            "sku": "MSI-GAMING-LAPTOP-C-RED",
            "stockQuantity": 0,
            "price": "1200.00",
            "comparePrice": null,
            "attributes": "{\"type\":\"Color\",\"value\":\"Red\"}",
            "isActive": true
        },
        {
            "name": "Black",
            "sku": "MSI-GAMING-LAPTOP-C-BLACK",
            "stockQuantity": 0,
            "price": "1200.00",
            "comparePrice": null,
            "attributes": "{\"type\":\"Color\",\"value\":\"Black\"}",
            "isActive": true
        },
        {
            "name": "White",
            "sku": "MSI-GAMING-LAPTOP-C-WHITE",
            "stockQuantity": 0,
            "price": "1200.00",
            "comparePrice": null,
            "attributes": "{\"type\":\"Color\",\"value\":\"White\"}",
            "isActive": true
        },
        {
            "name": "Gray",
            "sku": "MSI-GAMING-LAPTOP-C-GRAY",
            "stockQuantity": 0,
            "price": "1200.00",
            "comparePrice": null,
            "attributes": "{\"type\":\"Color\",\"value\":\"Gray\"}",
            "isActive": true
        }
    ]
}

-->
