import bcrypt from 'bcryptjs'

const users = [
        {
            name: 'adminuser',
            email: 'admin@admin.it',
            password: bcrypt.hashSync('12345', 10),
            isAdmin: true
        },
        {
            name: 'client1',
            email: 'client1@client.it',
            password: bcrypt.hashSync('12345', 10),
        },
        {
            name: 'client2',
            email: 'client2@client.it',
            password: bcrypt.hashSync('12345', 10),
        },
]

export default users