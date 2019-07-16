export function parseReferrer(referringUserSlug: string) {
    const spl = referringUserSlug.split(/-/g)

    return {
        name: referringUserSlug.replace(/-[^-]+$/, "").replace(/\+/g, ' '),
        id: spl[spl.length-1]
    }
}