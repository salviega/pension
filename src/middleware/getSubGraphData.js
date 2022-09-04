import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

function getSubGraphData() {
  const url = 'https://api.studio.thegraph.com/query/32331/pension/0.0.5';
  const depositQuery = `
    query {
      depositContributors {
        id
        contributorAddress
        contributorAmount
        timeDeposit
      }
    }
  `
  const client = new ApolloClient({
    uri: url,
    cache: new InMemoryCache(),
  })
  
  const getAllItems = async () => {
    const response = await client.query({ query: gql(depositQuery) }) 
    return response.data.depositContributors
  }

  return {
    getAllItems
  }
}

export { getSubGraphData }


