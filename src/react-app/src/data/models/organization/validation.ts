import { UIError, UIErrorType } from "../../../types";

export default class Validation {
    static nonPrintableRe = /[\000-\031]/

    static testNonPrintableCharacters(s: string) {
        const firstNonPrintable = s.search(Validation.nonPrintableRe)
        if (firstNonPrintable === -1) {
            return false
        }
        const beforeStart = firstNonPrintable - 5 < 0 ? 0 : firstNonPrintable - 5
        const before = s.slice(beforeStart, firstNonPrintable)
        const after = s.slice(firstNonPrintable + 1, firstNonPrintable + 6)
        return `Non-printable character at position ${firstNonPrintable}: "${before}___${after}`
    }
    static validateOrgId(id: string): [string, UIError] {
        // May not be empty
        if (id.length === 0) {
            return [
                id, {
                    type: UIErrorType.ERROR,
                    message: 'Organization id may not be empty'
                }]
        }
        // No spaces
        if (id.match(/\s/)) {
            return [
                id, {
                    type: UIErrorType.ERROR,
                    message: 'Organization id may not contain a space'
                }]
        }
        // May not exceed maximum size
        // todo: what is the real limit?
        if (id.length > 100) {
            return [
                id, {
                    type: UIErrorType.ERROR,
                    message: 'Organization id may not be longer than 100 characters'
                }]
        }

        // May only consist if lower case alphanumeric
        const alphaRe = /^[a-z0-9]+$/
        if (!id.match(alphaRe)) {
            return [
                id, {
                    type: UIErrorType.ERROR,
                    message: 'Organization id may only contain alphanumeric (a-z, 0-9)'
                }
            ]
        }

        return [id, {
            type: UIErrorType.NONE
        }]
    }

    static validateOrgName(name: string): [string, UIError] {
        if (name.length === 0) {
            return [
                name, {
                    type: UIErrorType.ERROR,
                    message: 'Organization name may not be empty'
                }]
        }
        if (name.length > 256) {
            return [
                name, {
                    type: UIErrorType.ERROR,
                    message: 'Organization name may not be longer than 256 characters'
                }]
        }
        return [
            name, {
                type: UIErrorType.NONE
            }]
    }

    static validateOrgGravatarHash(gravatarHash: string): [string, UIError] {
        if (gravatarHash.length === 0) {
            return [
                gravatarHash, {
                    type: UIErrorType.NONE
                }]
        }
        if (gravatarHash.length > 32) {
            return [
                gravatarHash, {
                    type: UIErrorType.ERROR,
                    message: 'Organization gravatar hash may not be longer than 32 characters'
                }]
        }
        return [
            gravatarHash, {
                type: UIErrorType.NONE
            }]
    }

    static validateOrgDescription(description: string): [string, UIError] {
        if (description.length === 0) {
            return [name, {
                type: UIErrorType.NONE
            }]
            // return [name, {
            //     type: UIErrorType.ERROR,
            //     message: 'Organization description may not be empty'
            // }]
        }
        // TODO: Is there really a limit?
        // const nonPrintable = Validation.testNonPrintableCharacters(description)
        // if (nonPrintable) {
        //     return [
        //         description, {
        //             type: UIErrorType.ERROR,
        //             message: nonPrintable
        //         }
        //     ]
        // }
        if (description.length > 4096) {
            return [
                description, {
                    type: UIErrorType.ERROR,
                    message: 'Organization description may not be longer than 4,096 characters'
                }]
        }
        return [
            description, {
                type: UIErrorType.NONE
            }
        ]
    }
}