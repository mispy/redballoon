interface Person {
    name: string
    email: string
    referringUserId: string
}

export const savePerson = (person: Person) => {
    return fetch(`/.netlify/functions/savePerson`, {
        body: JSON.stringify(person),
        method: 'POST'
    }).then(response => {
        return response.json()
    })
}

export const applyForPosition = (args: { email: string, name: string, coverLetter: string, cvFile: { filename: string, contentType: string, dataUri: string } }) => {
    return fetch(`/.netlify/functions/applyForPosition`, {
        body: JSON.stringify(args),
        method: 'POST'
    }).then(response => {
        return response.json()
    })
}
