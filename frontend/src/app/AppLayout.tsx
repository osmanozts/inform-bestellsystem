import { Box, Flex, Heading, Text } from '@chakra-ui/react';
import { NavLink, Outlet } from 'react-router-dom';
import { Toaster } from '../shared/ui/index.ts';

const NAV_ITEMS = [
  { to: '/products', label: 'Produkte' },
  { to: '/orders', label: 'Bestellungen' },
];

export function AppLayout() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Box as="header" bg="white" borderBottomWidth="1px" borderColor="gray.200" px={8} py={0}>
        <Flex align="center" h={14} gap={8}>
          <Heading size="sm" color="blue.700" whiteSpace="nowrap">
            Inform Bestellsystem
          </Heading>
          <Flex as="nav" gap={1}>
            {NAV_ITEMS.map(({ to, label }) => (
              <NavLink key={to} to={to}>
                {({ isActive }) => (
                  <Text
                    as="span"
                    display="block"
                    px={4}
                    py={3}
                    fontSize="sm"
                    fontWeight={isActive ? 'semibold' : 'normal'}
                    color={isActive ? 'blue.600' : 'gray.600'}
                    borderBottomWidth="2px"
                    borderColor={isActive ? 'blue.500' : 'transparent'}
                    _hover={{ color: 'blue.600' }}
                    transition="color 0.15s"
                  >
                    {label}
                  </Text>
                )}
              </NavLink>
            ))}
          </Flex>
        </Flex>
      </Box>

      <Box as="main" px={8} py={6}>
        <Outlet />
      </Box>

      <Toaster />
    </Box>
  );
}
