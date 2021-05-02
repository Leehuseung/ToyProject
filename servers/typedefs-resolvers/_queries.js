const { gql } = require('apollo-server-express')

const typeDefs = gql`
    type Query {
        todos: [Todo]
    }
`

module.exports = typeDefs