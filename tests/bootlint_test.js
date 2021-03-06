'use strict';

const assert   = require('assert');
const helpers  = require('./test_helper.js');

const config   = helpers.config();
const uri      = helpers.app(config, 'bootlint');

let response = {};

before((done) => {
    helpers.preFetch(uri, (res) => {
        response = res;
        done();
    });
});

describe('bootlint', () => {
    const current = config.bootlint[0];

    describe('config', () => {
        it('is current', (done) => {
            assert(current.current);
            done();
        });

        it('has integrity', (done) => {
            assert(typeof current.javascriptSri !== 'undefined');
            done();
        });
    });

    it('works', (done) => {
        assert(response);
        assert.equal(200, response.statusCode);
        done();
    });

    it('valid html', (done) => {
        helpers.assert.validHTML(response, done);
    });

    it('contains authors', (done) => {
        config.authors.forEach((author) => {
            assert(response.body.includes(author),
                `Expects response body to include "${author}"`);
        });
        done();
    });

    it('has header', (done) => {
        assert(response.body.includes('<h2 class="text-center mb-4">Bootlint</h2>'),
            'Expects response body to include Bootlint header');
        done();
    });

    it('has javascript', (done) => {
        assert(response.body.includes(current.javascript),
            `Expects response body to include "${current.javascript}"`);
        done();
    });

    ['html', 'pug', 'haml'].forEach((fmt) => {
        it(`has ${fmt}`, (done) => {
            const str = helpers.javascript[fmt](current.javascript, current.javascriptSri);

            assert(response.body.includes(str), `Expects response body to include "${str}"`);
            done();
        });
    });
});
