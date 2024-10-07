import {
  Flex,
  Badge,
  Button,
  Box,
  Card,
  Inset,
  Text,
  Strong,
  Progress,
  SegmentedControl,
} from "@radix-ui/themes";
import { BookmarkIcon } from "@radix-ui/react-icons";

export default function ComponentOverview() {
  return (
    <div className="p-8">
      <h1 className="mb-8 text-2xl font-bold">Component Overview</h1>

      <h2 className="mb-4 font-mono text-xl">SupplyMono</h2>
      <div className="mb-8 font-mono">
        <p className="mb-2 text-xs font-extralight">
          Hello There! (Ultralight)
        </p>
        <p className="mb-2 text-xs font-normal">Hello There! (Regular)</p>
        <p className="mb-2 text-xs font-medium">Hello There! (Medium)</p>
        <p className="mb-2 text-xs font-bold">Hello There! (Bold)</p>
      </div>

      <h2 className="mb-4 font-sans text-xl">SupplySans</h2>
      <div className="mb-8 font-sans">
        <p className="text-md mb-2 font-extralight">
          Hello There! (Ultralight)
        </p>
        <p className="text-md mb-2 font-normal">Hello There! (Regular)</p>
        <p className="text-md mb-2 font-medium">Hello There! (Medium)</p>
        <p className="text-md mb-2 font-bold">Hello There! (Bold)</p>
      </div>

      <h2 className="mb-4 font-sans text-xl">Badges</h2>
      <div className="mb-8 font-sans">
        <Flex gap="2">
          <Badge color="orange">Waiting for players</Badge>
          <Badge color="blue">Ready to Play</Badge>
          <Badge color="green">Victory!</Badge>
        </Flex>
      </div>

      <h2 className="mb-4 font-sans text-xl">Buttons</h2>
      <div className="mb-8 font-sans">
        <Flex gap="3">
          <Button variant="classic">
            <BookmarkIcon /> Bookmark
          </Button>
          <Button variant="solid">
            <BookmarkIcon /> Bookmark
          </Button>
          <Button variant="soft">
            <BookmarkIcon /> Bookmark
          </Button>
          <Button variant="surface">
            <BookmarkIcon /> Bookmark
          </Button>
          <Button variant="outline">
            <BookmarkIcon /> Bookmark
          </Button>
        </Flex>
      </div>

      <h2 className="mb-4 font-sans text-xl">Card with content</h2>
      <div className="mb-8 font-sans">
        <Box maxWidth="240px">
          <Card size="2">
            <Inset clip="padding-box" side="top" pb="current">
              <img
                src="https://images.unsplash.com/photo-1617050318658-a9a3175e34cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80"
                alt="Bold typography"
                style={{
                  display: "block",
                  objectFit: "cover",
                  width: "100%",
                  height: 140,
                  backgroundColor: "var(--gray-5)",
                }}
              />
            </Inset>
            <Text as="p" size="3">
              <Strong>Typography</Strong> is the art and technique of arranging
              type to make written language legible, readable and appealing when
              displayed.
            </Text>
          </Card>
        </Box>
      </div>
      <h2 className="mb-4 font-sans text-xl">Progress Bar</h2>
      <div className="mb-8 font-sans">
        <Box maxWidth="300px">
          <Progress />
        </Box>
      </div>

      <h2 className="mb-4 font-sans text-xl">Segmented Controls</h2>
      <div className="mb-8 font-sans">
        <Flex align="start" direction="column" gap="4">
          <SegmentedControl.Root defaultValue="inbox" size="1">
            <SegmentedControl.Item value="inbox">Inbox</SegmentedControl.Item>
            <SegmentedControl.Item value="drafts">Drafts</SegmentedControl.Item>
            <SegmentedControl.Item value="sent">Sent</SegmentedControl.Item>
          </SegmentedControl.Root>

          <SegmentedControl.Root defaultValue="inbox" size="2">
            <SegmentedControl.Item value="inbox">Inbox</SegmentedControl.Item>
            <SegmentedControl.Item value="drafts">Drafts</SegmentedControl.Item>
            <SegmentedControl.Item value="sent">Sent</SegmentedControl.Item>
          </SegmentedControl.Root>

          <SegmentedControl.Root defaultValue="inbox" size="3">
            <SegmentedControl.Item value="inbox">Inbox</SegmentedControl.Item>
            <SegmentedControl.Item value="drafts">Drafts</SegmentedControl.Item>
            <SegmentedControl.Item value="sent">Sent</SegmentedControl.Item>
          </SegmentedControl.Root>
        </Flex>
      </div>
    </div>
  );
}
