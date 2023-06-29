const fetch = require('node-fetch')

const seedDB = async () => {
    const _users = await fetch('http://localhost:4000/users/allUser')
    const users = await _users.json()
    console.log('users got')
    for (let i = 0; i < users.length; i++) {
        const user = await fetch('http://localhost:3002/v1/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(users[i])
        })
        console.log(user)
    }
}


seedDB()