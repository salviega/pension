import { ApolloClient, InMemoryCache, gql } from '@apollo/client'

function getSubGraphData() {
  const url = 'https://api.studio.thegraph.com/query/33980/pension/0.0.21';
  const depositQuery = `
    query {
      depositContributor {
        id
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
    try {
      const data = await client.query({ query: gql(depositQuery) })
      console.log( 'Subgraph data: ', data)
      return data;
    } catch(error) {
      console.log('Error fetching data: ', error);
    }
  }

  return {
    getAllItems
  }
}

export { getSubGraphData }


