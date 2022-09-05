import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

function getSubGraphData() {
  const url = 'https://api.studio.thegraph.com/query/32331/pension/0.0.5';
  
  const client = new ApolloClient({
    uri: url,
    cache: new InMemoryCache(),
  })
  
  const queryDeposit = `
    query {
      depositContributors {
        id
        contributorAddress
        contributorAmount
        timeDeposit
      }
    }
  `
  
  const queryAllElementsByAddress = `
    query {
      depositContributors(String: address) {
        contributorAmount
        timeDeposit
      }
    }
  `
  const getAllItems = async () => {
    const response = await client.query({ query: gql(queryDeposit) }) 
    return response.data.depositContributors
  }

  const getAllElementsByItem = async (address) => {
    let ownerAddress = address
    const response = await client.query({ query: gql(queryAllElementsByAddress), variables: ownerAddress})
    return response.data.depositContributors
  }

  return {
    getAllItems,
    getAllElementsByItem
  }
}

export { getSubGraphData }


