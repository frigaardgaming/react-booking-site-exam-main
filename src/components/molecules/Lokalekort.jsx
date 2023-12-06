import React from "react";
import { Card, Image, Text, Button, Center, Flex, rem } from "@mantine/core";
import Link from "next/link";
import { IconChalkboard, IconUser } from "@tabler/icons-react";

export default function Lokalekort({ room }) {
    return (
        <Card shadow="sm" padding="lg" withBorder>
            <Card.Section>
                <Image src="room.jpg" style={{ opacity: room.available ? 1 : 0.5 }} />
            </Card.Section>
            <Flex pt="lg" direction="column" c={room.available ? "black" : "gray"}>
                <Text fw="700" size="lg">
                    Lokale {room.id}
                </Text>
                <Flex gap="xs" align="center">
                    <IconUser stroke={1.5} />
                    {room.kapacitet == 1 ? "1 person" : `${room.kapacitet} personer`}
                </Flex>
                <Flex gap="xs" align="center">
                    <IconChalkboard stroke={1.5} />
                    {room.whiteboard ? "Whiteboard" : "Skærm"}
                </Flex>
                <Center mt="sm">
                    <Link href={`${room.id}`}>
                        <Button disabled={room.available ? false : true}>Book nu</Button>
                    </Link>
                </Center>
            </Flex>
        </Card>
    );
}
