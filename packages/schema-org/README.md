# Schema Org

## Install

`npm install @tryghost/schema-org --save`

or

`yarn add @tryghost/schema-org`


## Usage

```js
const SchemaGenerator = require('@tryghost/schema-org');

const schema = new SchemaGenerator();
const makeSchemaTags = json => `<script type="application/ld+json">\n${json}\n</script>`;

// Schema data pertaining to the entire site
const site = {
    title: 'Ghost',
    url: 'https://demo.ghost.io',
    image: {
        url: 'https://static.ghost.org/v2.0.0/images/welcome-to-ghost.jpg',
        // Optional!
        dimensions: {
            width: 1600,
            height: 1050
        }
    }
};

// Example: generate schema for a post.
// Other supported options are `author`, `tag`, and `home`
const postObject = ghostPost(); // https://ghost.org/docs/api/v3/content/#posts

// Schema data pertaining to this specific resource
const postMeta = {
    author: {
        name: postObject.authors[0].name,
        url: postObject.authors[0].url,
        image: postObject.authors[0].profile_image,
        description: postObject.authors[0].meta_description || postObject.authors[0].bio
    },
    meta: {
        title: postObject.title,
        url: postObject.url,
        datePublished: postObject.published_at,
        dateModified: postObject.updated_at,
        image: postObject.feature_image,
        keywords: postObject.tags.map(({name}) => name),
        description: postObject.custom_excerpt || postObject.excerpt
    }
};

// Logs a valid JSON-LD script
console.log(
    makeSchemaTags(schema.createSchema('post', {site, meta: postMeta}))
);
```

### Supported Schemas:

```typescript
// type = 'author'
interface AuthorSchemaProperties {
    site: SiteData; // See `site` in the example
    meta: {
        name: string;
        url: string;
        description?: string;
        sameAs?: string[]; // must be full URLs
        image?: ImageObject; // see `site.image` in the example
    }
}

// type = 'home'
interface HomeSchemaProperties {
    name: string;
    site: SiteData;
    meta: {
        url: string;
        description?: string;
        image?: ImageObject;
    }
}

// type = 'post'
interface PostSchemaProperties {
    site: SiteData;
    author?: {
        name: string;
        url: string;
        sameAs?: string[];
        image?: ImageData;
        description?: string;
    };
    meta: {
        title: string;
        url: string;
        datePublished?: Date | string;
        dateModified?: Date | string;
        image?: ImageData;
        keywords?: string[];
        description?: string;
    }
}

// type = 'tag'
interface TagSchemaProperties {
    site: SiteData;
    meta: {
        name: string;
        url: string;
        image?: ImageObject;
        description?: string;
    }
}
```

## Develop

This is a mono repository, managed with [lerna](https://lernajs.io/).

Follow the instructions for the top-level repo.
1. `git clone` this repo & `cd` into it as usual
2. Run `yarn` to install top-level dependencies.


## Run

- `yarn dev`


## Test

- `yarn lint` run just eslint
- `yarn test` run lint and tests




# Copyright & License

Copyright (c) 2013-2021 Ghost Foundation - Released under the [MIT license](LICENSE).
