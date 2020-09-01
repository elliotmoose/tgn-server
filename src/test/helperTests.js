
let chai = require('chai');
const crypto = require('../helpers/crypto');
const { expect, assert } = require('chai');
const { ERROR_TOKEN_EXPIRED } = require('../constants/errors');
let should = chai.should();

describe('Helpers', function () {
	describe('Crypto', function () {			
        let userId = 'test_user_id';
        
		it('should accept valid token', () => {						
            let token = crypto.generateJsonWebToken({userId});
            let { userId: decryptedUserId } = crypto.decodeJsonWebToken(token);
            decryptedUserId.should.equal(userId);
		});
		it('should reject expired token', () => {						
            try {
                let token = crypto.generateJsonWebToken({userId}, '0m');
                crypto.decodeJsonWebToken(token);
                assert.fail('Should have thrown ERROR_TOKEN_EXPIRED');
            } catch (error) {
                error.toJSON().should.eql(ERROR_TOKEN_EXPIRED().toJSON());
            }
		});
        
        let password = 'hashtestpass12345'
        let salt = crypto.generateSalt(16);
        let hash = null;
		it('should hash password', () => {						
            hash = crypto.hashPassword(password, salt);
            crypto.verifyPassword(password, hash, salt).should.equal(true);
        });
        
        it('should reject wrong password', () => {
            let wrongPassword = password + '0';
            crypto.verifyPassword(wrongPassword, hash, salt).should.equal(false);
        });
        
        it('should reject wrong salt', () => {
            crypto.verifyPassword(password, hash, crypto.generateSalt(16)).should.equal(false);
        });
    })
});