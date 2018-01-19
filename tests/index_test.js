'use strict';

const assert   = require('assert');
const helpers  = require('./test_helper.js');

const config   = helpers.config();
const uri      = helpers.app(config);

let response = {};

before((done) => {
    helpers.preFetch(uri, (res) => {
        response = res;
        done();
    });
});

const latest = config.bootstrap[0];

describe('config', () => {
    it('is latest', (done) => {
        assert(latest.latest);
        done();
    });

    it('has stylesheet integrity', (done) => {
        assert(typeof latest.stylesheetSri !== 'undefined');
        done();
    });

    it('has javascript integrity', (done) => {
        assert(typeof latest.javascriptSri !== 'undefined');
        done();
    });

    it('has javascript bundle integrity', (done) => {
        assert(typeof latest.javascriptBundleSri !== 'undefined');
        done();
    });
});

it('works', (done) => {
    assert(response);
    assert.equal(200, response.statusCode);
    done();
});

it('contains authors', (done) => {
    config.authors.forEach((author) => {
        assert(response.body.includes(author), `Expects response body to include "${author}"`);
    });
    done();
});

describe('stylesheet', () => {
    it('has uri', (done) => {
        assert(response.body.includes(latest.stylesheet),
            `Expects response body to include "${latest.stylesheet}"`);
        done();
    });

    ['html', 'pug', 'haml'].forEach((fmt) => {
        it(`has ${fmt}`, (done) => {
            const str = helpers.css[fmt](latest.stylesheet, latest.stylesheetSri);

            assert(response.body.includes(str), `Expects response body to include "${str}"`);
            done();
        });
    });
});

describe('javascript', () => {
    it('has javascript uri', (done) => {
        assert(response.body.includes(latest.javascript),
            `Expects response body to include "${latest.javascript}"`);
        done();
    });

    it('has javascript bundle uri', (done) => {
        assert(response.body.includes(latest.javascriptBundle),
            `Expects response body to include "${latest.javascriptBundle}"`);
        done();
    });

    ['html', 'pug', 'haml'].forEach((fmt) => {
        it(`has ${fmt}`, (done) => {
            const str = helpers.javascript[fmt](latest.javascript, latest.javascriptSri);

            assert(response.body.includes(str), `Expects response body to include "${str}"`);
            done();
        });
    });
});
