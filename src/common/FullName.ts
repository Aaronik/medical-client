export interface IFullName {
    fName: string
    mName?: string
    lName: string
    prefix?: string
    suffic?: string
}

export class FullName implements IFullName {
    fName: string
    mName?: string
    lName: string
    suffix?: string
    prefix?: string

    constructor(fName: string, lName: string, mName?: string | undefined, suffix?: string | undefined, prefix?: string | undefined) {
        this.fName = fName
        this.mName = mName
        this.lName = lName
        this.suffix = suffix
        this.prefix = prefix
    }
}