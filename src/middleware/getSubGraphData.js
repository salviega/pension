import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

export function getSubGraphData() {
  const url = 'https://api.studio.thegraph.com/query/32331/pension2/v0.0.13/';
  
  const client = new ApolloClient({
    uri: url,
    cache: new InMemoryCache(),
  })
  
  const queryPensionByAddress = `
    query {
      dataPensions(String: address) {
        id
        owner
        biologySex
        age
        bornAge
        retirentmentData
        pensionCreatedTime
      }
    }
  `
  const queryAllQuotesByAddress = `
    query {
      contributorQuotes(String: address) {
        id
        owner
        contributionDate
        savingAmount
        solidaryAmount
        totalAmount
      }
    }
  `
  const getPensionByAddress = async (address) => {
    let owner = address
    const response = await client.query({ query: gql(queryPensionByAddress), variables: owner})
    return response.data.dataPensions[0]
  }

  const getAllQuotesByAddress = async (address) => {
    let owner = address
    const response = await client.query({ query: gql(queryAllQuotesByAddress), variables: owner}) 
    return response.data.contributorQuotes
  }

  return {
    getPensionByAddress,
    getAllQuotesByAddress
  }
}
