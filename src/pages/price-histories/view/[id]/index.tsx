import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import React, { useState } from 'react';
import {
  Text,
  Box,
  Spinner,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  Link,
  IconButton,
  Flex,
  Center,
  Stack,
} from '@chakra-ui/react';
import { UserSelect } from 'components/user-select';
import { FiTrash, FiEdit2, FiEdit3 } from 'react-icons/fi';
import { getPriceHistoryById } from 'apiSdk/price-histories';
import { Error } from 'components/error';
import { PriceHistoryInterface } from 'interfaces/price-history';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';

function PriceHistoryViewPage() {
  const { hasAccess } = useAuthorizationApi();
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<PriceHistoryInterface>(
    () => (id ? `/price-histories/${id}` : null),
    () =>
      getPriceHistoryById(id, {
        relations: ['product'],
      }),
  );

  const [deleteError, setDeleteError] = useState(null);
  const [createError, setCreateError] = useState(null);

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Flex justifyContent="space-between" mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Price History Detail View
          </Text>
          {hasAccess('price_history', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
            <NextLink href={`/price-histories/edit/${data?.id}`} passHref legacyBehavior>
              <Button
                onClick={(e) => e.stopPropagation()}
                mr={2}
                as="a"
                variant="outline"
                colorScheme="blue"
                leftIcon={<FiEdit2 />}
              >
                Edit
              </Button>
            </NextLink>
          )}
        </Flex>
        {error && (
          <Box mb={4}>
            {' '}
            <Error error={error} />{' '}
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <>
            <Stack direction="column" spacing={2} mb={4}>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Old Price:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.old_price}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  New Price:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.new_price}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Date:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.date as unknown as string}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Created At:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.created_at as unknown as string}
                </Text>
              </Flex>
              <Flex alignItems="center">
                <Text fontSize="lg" fontWeight="bold" as="span">
                  Updated At:
                </Text>
                <Text fontSize="md" as="span" ml={3}>
                  {data?.updated_at as unknown as string}
                </Text>
              </Flex>
            </Stack>
            <Box>
              {hasAccess('product', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                <Flex alignItems="center" mb={4}>
                  <Text fontSize="lg" fontWeight="bold" as="span">
                    Product:
                  </Text>
                  <Text fontSize="md" as="span" ml={3}>
                    <Link as={NextLink} href={`/products/view/${data?.product?.id}`}>
                      {data?.product?.name}
                    </Link>
                  </Text>
                </Flex>
              )}
            </Box>
            <Box></Box>
          </>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'price_history',
  operation: AccessOperationEnum.READ,
})(PriceHistoryViewPage);
