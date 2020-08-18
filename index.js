const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())

app.use(cors())

let persons = [
    {
        name: "Natrium",
        number: "040-111",
        id: 1
    },
    {
        name:"Lead",
        number: "050-222",
        id: 2
    },
    {
        name:"Gold",
        number: "010-333",
        id: 3
    },
    {
        name: "Argon",
        number: "060-444",
        id: 4
    }

]


morgan.token('body', function (req, res) {return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :response-time ms - :res[content-length] :body '))

app.get('/api/persons', (request,response) => {
    response.json(persons)
})

app.get('/info', (request, response)=> {
    size = persons.length
    date = new Date()
    
    response.send(
    `<div><p>Phonebook has info for ${size} people</p><p>${date}</p></div>`
    )
})

app.get('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.post('/api/persons', (request,response) => {
    const body = request.body
    const id = Math.floor(Math.random()*100000)

    if((!body.name) || (!body.number)) {
        return response.status(400).json({
            error: 'Name or number missing!'
        })
    } else if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'Name is already in the phonebook'
    })
}

    person = {
        name: body.name,
        number: body.number,
        id: id
    }

    persons = persons.concat(person)
    response.json(person)
})

app.delete('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id)

    persons = persons.filter(person => person.id !== id )
    response.status(204).end()
}
)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})