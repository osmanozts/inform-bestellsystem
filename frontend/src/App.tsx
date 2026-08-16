import { Box, Heading, Text } from '@chakra-ui/react';

export default function App() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Box as="header" bg="white" borderBottomWidth="1px" px={8} py={4}>
        <Heading size="md" color="blue.700">
          Inform Bestellsystem
        </Heading>
      </Box>
      <Box as="main" p={8}>
        <Text color="gray.500">Anwendung wird geladen…</Text>
      </Box>
    </Box>
  );
}
