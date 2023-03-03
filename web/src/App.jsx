import { Heading, Container, Flex } from '@chakra-ui/react'

function App() {

  return (
    <div className="App">
      <Container minHeight="100vh" maxW="3xl">
        <Flex minHeight="100vh" alignItems="center" justifyContent="center" flexDirection="column" >
          <Heading as="h1" size="3xl">
            College Project
          </Heading>
        </Flex>
      </Container>
   </div>
  )
}

export default App
