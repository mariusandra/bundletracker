import * as crypto from 'crypto'

export function randomString(length: number): string {
    return crypto
        .randomBytes(length)
        .toString('base64')
        .replace(/\//g, 'x')
        .replace(/\+/g, 'y')
        .replace(/=/g, '')
        .substring(0, length)
}
