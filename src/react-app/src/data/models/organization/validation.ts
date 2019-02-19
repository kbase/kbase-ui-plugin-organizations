import { ValidationState, ValidationErrorType } from "../../../types"

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

    static validateOrgId(id: string): [string, ValidationState] {
        // May not be empty
        if (id.length === 0) {
            return [
                id, {
                    type: ValidationErrorType.REQUIRED_MISSING,
                    message: 'Organization id may not be empty',
                    validatedAt: new Date()
                }]
        }
        // No spaces
        if (id.match(/\s/)) {
            return [
                id, {
                    type: ValidationErrorType.ERROR,
                    message: 'Organization id may not contain a space',
                    validatedAt: new Date()
                }]
        }
        // May not exceed maximum size
        // todo: what is the real limit?
        if (id.length > 100) {
            return [
                id, {
                    type: ValidationErrorType.ERROR,
                    message: 'Organization id may not be longer than 100 characters',
                    validatedAt: new Date()
                }]
        }

        // May only consist if lower case alphanumeric
        const alphaRe = /^[a-z0-9-]+$/
        if (!id.match(alphaRe)) {
            return [
                id, {
                    type: ValidationErrorType.ERROR,
                    message: 'Organization ID may only contain lower case letters (a-z), numeric digits (0-9) and the dash "-"',
                    validatedAt: new Date()
                }
            ]
        }

        return [id, {
            type: ValidationErrorType.OK,
            validatedAt: new Date()
        }]
    }

    static validateOrgName(name: string): [string, ValidationState] {
        if (name.length === 0) {
            return [
                name, {
                    type: ValidationErrorType.REQUIRED_MISSING,
                    message: 'Organization name may not be empty',
                    validatedAt: new Date()
                }]
        }
        if (name.length > 256) {
            return [
                name, {
                    type: ValidationErrorType.ERROR,
                    message: 'Organization name may not be longer than 256 characters',
                    validatedAt: new Date()
                }]
        }
        return [
            name, {
                type: ValidationErrorType.OK,
                validatedAt: new Date()
            }]
    }

    static validateOrgLogoUrl(logoUrl: string | null): [string | null, ValidationState] {
        if (logoUrl === null || logoUrl === '') {
            return [
                logoUrl, {
                    type: ValidationErrorType.OK,
                    validatedAt: new Date()
                }
            ]
        }
        if (logoUrl.length > 1000) {
            return [
                logoUrl, {
                    type: ValidationErrorType.ERROR,
                    message: 'Logo url may not be longer than 1000 characters',
                    validatedAt: new Date()
                }]
        }
        try {
            const url = new URL(logoUrl)
            if (!url.protocol.match(/^http[s]?:$/)) {
                return [
                    logoUrl, {
                        type: ValidationErrorType.ERROR,
                        message: 'Error parsing url: ' + url.protocol + ' is not a valid protocol',
                        validatedAt: new Date()
                    }]
            }
            if (!url.protocol.match(/^https:$/)) {
                return [
                    logoUrl, {
                        type: ValidationErrorType.ERROR,
                        message: 'Only https (secure) urls are supported',
                        validatedAt: new Date()
                    }]
            }
        } catch (ex) {
            return [
                logoUrl, {
                    type: ValidationErrorType.ERROR,
                    message: 'Error parsing url: ' + ex.message,
                    validatedAt: new Date()
                }]
        }
        return [
            logoUrl, {
                type: ValidationErrorType.OK,
                validatedAt: new Date()
            }]
    }

    static validateOrgHomeUrl(homeUrl: string | null): [string | null, ValidationState] {
        if (homeUrl === null || homeUrl === '') {
            return [
                homeUrl, {
                    type: ValidationErrorType.OK,
                    validatedAt: new Date()
                }
            ]
        }
        if (homeUrl.length > 1000) {
            return [
                homeUrl, {
                    type: ValidationErrorType.ERROR,
                    message: 'Home url may not be longer than 1000 characters',
                    validatedAt: new Date()
                }]
        }
        try {
            const url = new URL(homeUrl)
            if (!url.protocol.match(/^http[s]?:$/)) {
                return [
                    homeUrl, {
                        type: ValidationErrorType.ERROR,
                        message: 'Error parsing url: ' + url.protocol + ' is not a valid protocol',
                        validatedAt: new Date()
                    }]
            }
            if (!url.protocol.match(/^https:$/)) {
                return [
                    homeUrl, {
                        type: ValidationErrorType.ERROR,
                        message: 'Only https (secure) urls are supported',
                        validatedAt: new Date()
                    }]
            }
        } catch (ex) {
            return [
                homeUrl, {
                    type: ValidationErrorType.ERROR,
                    message: 'Error parsing url: ' + ex.message,
                    validatedAt: new Date()
                }]
        }
        return [
            homeUrl, {
                type: ValidationErrorType.OK,
                validatedAt: new Date()
            }]
    }

    static validateOrgResearchInterests(researchInterests: string): [string, ValidationState] {
        console.log('validating research interests', researchInterests, researchInterests === null, researchInterests === '')
        if (researchInterests.length === 0) {
            return [
                name, {
                    type: ValidationErrorType.REQUIRED_MISSING,
                    message: 'Research Interests may not be empty',
                    validatedAt: new Date()
                }]
        }

        if (researchInterests.length > 280) {
            return [
                researchInterests, {
                    type: ValidationErrorType.ERROR,
                    message: 'Research Interests may not be longer than 280 characters',
                    validatedAt: new Date()
                }]
        }
        return [
            researchInterests, {
                type: ValidationErrorType.OK,
                validatedAt: new Date()
            }]
    }

    static validateOrgDescription(description: string): [string, ValidationState] {
        console.log('validating description', description, description === null, description === '')
        if (description.length === 0) {
            // return [name, {
            //     type: ValidationErrorType.OK,
            //     validatedAt: new Date()
            // }]
            return [name, {
                type: ValidationErrorType.ERROR,
                message: 'Organization description may not be empty',
                validatedAt: new Date()
            }]
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
                    type: ValidationErrorType.ERROR,
                    message: 'Organization description may not be longer than 4,096 characters',
                    validatedAt: new Date()
                }]
        }
        return [
            description, {
                type: ValidationErrorType.OK,
                validatedAt: new Date()
            }
        ]
    }

    static validateMemberTitle(title: string): [string, ValidationState] {
        const maxTitleLength = 100
        if (title.length > maxTitleLength) {
            return [
                title, {
                    type: ValidationErrorType.ERROR,
                    message: `member title may not be longer than ${maxTitleLength} characters`,
                    validatedAt: new Date()
                }]
        }
        return [
            title, {
                type: ValidationErrorType.OK,
                validatedAt: new Date()
            }]
    }
}