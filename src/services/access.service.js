'use strict'

const shopModel = require("../models/shop.model")
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../utils")

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {

    static signUp = async ({ name, email, password }) => {
        try {
            //check email exist
            const holderShop = await shopModel.findOne({ email }).lean() //lean giúp giảm tải size object(giúp query nhanh)
            if (holderShop) {
                return {
                    code: 'xxx',
                    message: 'Shop already registered'
                }
            }
            const passwordHash = await bcrypt.hash(password, 10)//neu cao hon 10 se anh huong den cpu
            const newShop = await shopModel.create({ name, email, password: passwordHash, roles: [RoleShop.SHOP] })

            if (newShop) {
                // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1',//public key crytography standard (sec 5: 28:35)
                //         format: 'pem'
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     }
                // })
                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')

                console.log({ privateKey, publicKey })//save collection key store

                const keyStore = await KeyTokenService.createKeyToken({
                    userID: newShop._id,
                    publicKey,
                    privateKey
                })

                if (!keyStore) {
                    return {
                        code: 'xxxx',
                        message: 'keyStore error'
                    }
                }

                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)
                console.log(`Created Token Success`, tokens)
                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                        tokens
                    }
                }

            }
            return {
                code: 200,
                metadata: null
            }
        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService