import React from "react";
import { Anchor, Flex, Text, Image } from "@mantine/core";
import {
    IconBell,
    IconBrandHipchat,
    IconSearch,
    IconSettings,
    IconUserCircle,
} from "@tabler/icons-react";
import Link from "next/link";

export default function Header() {
    return (
        <header>
            <Flex justify="space-between" align="center" px="lg" py="sm">
                <Link href="/">
                    <Image
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbd4kPi3up2YcPlRxnx6WBmXHlw6pDzOTZRXQ1chme&s"
                        w="250"
                    />
                </Link>
                <Flex gap="sm">
                    <Text>
                        <Anchor c="black" href="https://mantine.dev/" target="_blank">
                            Booking
                        </Anchor>
                    </Text>
                    <Text>
                        <Anchor c="black" href="https://mantine.dev/" target="_blank">
                            Links
                        </Anchor>
                    </Text>
                    <Text weight="700">
                        <Anchor c="black" href="https://mantine.dev/" target="_blank">
                            Mine flows
                        </Anchor>
                    </Text>
                    <IconUserCircle />
                    <IconBell />
                    <IconSearch />
                    <IconBrandHipchat />
                    <IconSettings />
                </Flex>
            </Flex>
        </header>
    );
}
