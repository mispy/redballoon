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