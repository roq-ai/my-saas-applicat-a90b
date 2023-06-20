import { useState } from 'react';
import AppLayout from 'layout/app-layout';
import NextLink from 'next/link';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Text,
  Button,
  Link,
  IconButton,
  Flex,
  Center,
} from '@chakra-ui/react';
import useSWR from 'swr';
import { Spinner } from '@chakra-ui/react';
import { getProducts, deleteProductById } from 'apiSdk/products';
import { ProductInterface } from 'interfaces/product';
import { Error } from 'components/error';
import { AccessOperationEnum, AccessServiceEnum, useAuthorizationApi, withAuthorization } from '@roq/nextjs';
import { useRouter } from 'next/router';
import { FiTrash, FiEdit2 } from 'react-icons/fi';

function ProductListPage() {
  const { hasAccess } = useAuthorizationApi();
  const { data, error, isLoading, mutate } = useSWR<ProductInterface[]>(
    () => '/products',
    () =>
      getProducts({
        relations: ['store', 'price_history.count'],
      }),
  );
  const router = useRouter();
  const [deleteError, setDeleteError] = useState(null);

  const handleDelete = async (id: string) => {
    setDeleteError(null);
    try {
      await deleteProductById(id);
      await mutate();
    } catch (error) {
      setDeleteError(error);
    }
  };

  const handleView = (id: string) => {
    if (hasAccess('product', AccessOperationEnum.READ, AccessServiceEnum.PROJECT)) {
      router.push(`/products/view/${id}`);
    }
  };

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {hasAccess('product', AccessOperationEnum.CREATE, AccessServiceEnum.PROJECT) && (
          <Flex justifyContent="space-between" mb={4}>
            <Text as="h1" fontSize="2xl" fontWeight="bold">
              Product
            </Text>
            <NextLink href={`/products/create`} passHref legacyBehavior>
              <Button onClick={(e) => e.stopPropagation()} colorScheme="blue" mr="4" as="a">
                Create
              </Button>
            </NextLink>
          </Flex>
        )}
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {deleteError && (
          <Box mb={4}>
            <Error error={deleteError} />{' '}
          </Box>
        )}
        {isLoading ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>name</Th>
                  <Th>price</Th>
                  {hasAccess('store', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && <Th>store</Th>}
                  {hasAccess('price_history', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                    <Th>price_history</Th>
                  )}
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data?.map((record) => (
                  <Tr cursor="pointer" onClick={() => handleView(record.id)} key={record.id}>
                    <Td>{record.name}</Td>
                    <Td>{record.price}</Td>
                    {hasAccess('store', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>
                        <Link as={NextLink} href={`/stores/view/${record.store?.id}`}>
                          {record.store?.name}
                        </Link>
                      </Td>
                    )}
                    {hasAccess('price_history', AccessOperationEnum.READ, AccessServiceEnum.PROJECT) && (
                      <Td>{record?._count?.price_history}</Td>
                    )}
                    <Td>
                      {hasAccess('product', AccessOperationEnum.UPDATE, AccessServiceEnum.PROJECT) && (
                        <NextLink href={`/products/edit/${record.id}`} passHref legacyBehavior>
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
                      {hasAccess('product', AccessOperationEnum.DELETE, AccessServiceEnum.PROJECT) && (
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(record.id);
                          }}
                          colorScheme="red"
                          variant="outline"
                          aria-label="edit"
                          icon={<FiTrash />}
                        />
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AppLayout>
  );
}
export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'product',
  operation: AccessOperationEnum.READ,
})(ProductListPage);
