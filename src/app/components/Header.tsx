import { Box, Heading } from "@radix-ui/themes";

const Header = () => {
  return (
    <Box as="header" py="4" px="6">
      <Heading size="6" as="h1">
        HotDamn!Fun
      </Heading>
    </Box>
  );
};

export default Header;
