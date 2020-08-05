
let chai = require('chai');
const crypto = require('../helpers/crypto');
const { expect, assert } = require('chai');
const { ERROR_TOKEN_EXPIRED } = require('../constants/errors');
let should = chai.should();

describe('Helpers', function () {
	describe('Crypto', function () {			
        let userId = 'test_user_id';
        let secret = 'mooselliot';
        crypto.initialize(secret);
        
		it('Should accept valid token', () => {						
            crypto.generateJsonWebToken({userId});
		});
		it('Should reject expired token', () => {						
            try {
                let token = crypto.generateJsonWebToken({userId}, '0m');
                crypto.decodeJsonWebToken(token);
                assert.fail('Should have thrown ERROR_TOKEN_EXPIRED');
            } catch (error) {
                error.should.equal(ERROR_TOKEN_EXPIRED);
            }
		});
    })
});