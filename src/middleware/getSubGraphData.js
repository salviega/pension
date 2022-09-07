import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

export function getSubGraphData () {
  const url = 'https://api.studio.thegraph.com/query/32331/pension2/v0.0.13/'

  const client = new ApolloClient({
    uri: url,
    cache: new InMemoryCache()
  })

  const queryPensionByAddress = `
    query DataPension($owner: String!) {
      dataPensions(where: {owner: $owner}) {
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
  const queryAllQuotesFromAddress = `
    query ContributorQuote($owner: String!) {
      contributorQuotes(where: {owner: $owner}) {
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
    const response = await client.query({ query: gql(queryPensionByAddress), variables: { owner: address } })
    return response.data.dataPensions[0]
  }

  const getAllQuotesByAddress = async (address) => {
    const response = await client.query({ query: gql(queryAllQuotesFromAddress), variables: { owner: address } })
    return response.data.contributorQuotes
  }

  return {
    getPensionByAddress,
    getAllQuotesByAddress
  }
}
