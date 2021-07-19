const _ = require('lodash');
const glob = require('glob');
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const nameRegExp = /\/(.*)\.hbs/;

const trim = (schema) => {
    _.each(schema, function (value, key) {
        if (_.isNil(value) || (_.isString(value) && _.isEmpty(value))) {
            delete schema[key];
        }

        if (_.isObject(value)) {
            value = trim(value);
        }
    });

    return schema;
};

/**
 * @typedef {{
 *  url?: string;
 *  title?: string;
 *  logo?: ImageObject
 * }} SiteData
 *
 *
 * @typedef {{
 *  url: string;
 *  dimensions?: {
 *    width?: number;
 *    height?: number;
 *  }
 * }} DimensionalImage
 *
 * @typedef {DimensionalImage | string} ImageObject
 *
 *
 * @typedef {{
 *   site: SiteData;
 *   meta: {
 *     name: string;
 *     url: string;
 *     description?: string;
 *     sameAs?: string[];
 *     image?: ImageObject;
 *   }
 * }} AuthorSchemaProperties
 *
 *
 * @typedef {{
 *   name: string;
 *   site: SiteData;
 *   meta: {
 *     url: string;
 *     description?: string;
 *     image?: ImageObject;
 *   }
 * }} HomeSchemaProperties
 *
 *
 * @typedef {{
 *   site: SiteData;
 *   author?: {
 *     name: string;
 *     url: string;
 *     sameAs?: string[];
 *     image?: ImageData;
 *     description?: string;
 *   }
 *   meta: {
 *     title: string;
 *     url: string;
 *     datePublished?: Date | string;
 *     dateModified?: Date | string;
 *     image?: ImageData;
 *     keywords?: string[];
 *     description?: string;
 *   }
 * }} PostSchemaProperties
 *
 *
 * @typedef {{
 *   site: SiteData;
 *   meta: {
 *     name: string;
 *     url: string;
 *     image?: ImageObject;
 *     description?: string;
 *   }
 * }} TagSchemaProperties
 */

class SchemaGenerator {
    constructor(options) {
        this.options = options || {};

        this.loadHelpers();
        this.loadPartials();
        this.loadTemplates();
    }

    loadHelpers() {
        handlebars.registerHelper('join', function (data) {
            let output = '';
            if (data && data.length > 0) {
                output = data.join(', ');
            }
            return new handlebars.SafeString(output);
        });

        handlebars.registerHelper('array', function (data = '') {
            let json = JSON.stringify(data);
            return new handlebars.SafeString(json);
        });
    }

    loadTemplates() {
        let templateFiles = glob.sync('templates/*.hbs', {cwd: __dirname});
        this.templates = {};
        _.forEach(templateFiles, (templatePath) => {
            let name = templatePath.match(nameRegExp)[1];
            let template = fs.readFileSync(path.join(__dirname, templatePath)).toString();
            this.templates[name] = handlebars.compile(template);
        });
    }

    loadPartials() {
        let partialFiles = glob.sync('partials/*.hbs', {cwd: __dirname});
        _.forEach(partialFiles, (partialPath) => {
            let name = partialPath.match(nameRegExp)[1];
            let partial = fs.readFileSync(path.join(__dirname, partialPath)).toString();
            handlebars.registerPartial(name, partial);
        });
    }

    finalize(jsonString = '') {
        let json = JSON.parse(jsonString);

        return trim(json);
    }

    /**
     * @param {'home' | 'author' | 'post' | 'tag'} type
     * @param {HomeSchemaProperties | AuthorSchemaProperties | PostSchemaProperties | TagSchemaProperties} data
     */
    createSchema(type, data) {
        if (!_.has(this.templates, type)) {
            type = 'home';
        }

        return this.finalize(
            this.templates[type](data)
        );
    }
}

module.exports = SchemaGenerator;
