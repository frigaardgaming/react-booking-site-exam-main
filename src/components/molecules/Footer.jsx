import {
    IconBrandFacebook,
    IconBrandInstagram,
    IconBrandLinkedin,
    IconBrandYoutube,
} from "@tabler/icons-react";
import { Container, Flex, Text, rem } from "@mantine/core";
import React from "react";

export default function Footer() {
    return (
        <Container fluid p="xl" bg="#565656" c="#fff">
            <Flex direction="column" gap="sm">
                <Flex gap="lg">
                    <IconBrandFacebook style={{ width: rem(32), height: rem(32) }} stroke={1.5} />
                    <IconBrandLinkedin style={{ width: rem(32), height: rem(32) }} stroke={1.5} />
                    <IconBrandYoutube style={{ width: rem(32), height: rem(32) }} stroke={1.5} />
                    <IconBrandInstagram style={{ width: rem(32), height: rem(32) }} stroke={1.5} />
                </Flex>
                <Text>Designet med Moodlerooms, bygget på Moodle.</Text>
                <Text>Opsumering af dataopbevaring</Text>
                <Text>Hent mobilappen</Text>
            </Flex>
        </Container>
    );
}
