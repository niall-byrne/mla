import {
  Text,
  Container,
  Center,
  Box,
  useColorModeValue,
} from "@chakra-ui/react";

interface BillboardProps {
  title: string;
  children: JSX.Element | JSX.Element[];
}

const Billboard = ({ children, title }: BillboardProps) => {
  const bg = useColorModeValue("gray.200", "gray.800");

  return (
    <Center height={"calc(100vh + 32px)"}>
      <Box p={3} bg={bg} w={["90%", "80%", "70%"]}>
        <Container centerContent={true} maxW={"medium"} textAlign={"center"}>
          <Text fontSize={["xl", "2xl", "3xl"]}>{title}</Text>
        </Container>
        <br />
        {children}
      </Box>
    </Center>
  );
};

export default Billboard;
