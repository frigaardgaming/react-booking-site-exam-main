import useMyContext from "@/context/my-context";
import { Grid, Text, Title, Container, Flex, Stack, SimpleGrid, Group } from "@mantine/core";
import React, { useEffect, useState } from "react";
import lokaler from "/public/lokaler";
import { IconChalkboard, IconUser } from "@tabler/icons-react";
import bookinglengths from "../../public/bookinglengths";
import timeslots from "../../public/timeslots";

export default function confirmation() {
    const findLabel = (value, array) => {
        const label = array.find((slot) => slot.value === value);
        return label ? label.label : "";
    };

    const {
        setStepperValue,
        UserEmail,
        bookingRoom,
        bookingDate,
        bookingStart,
        setBookingStart,
        bookingLength,
    } = useMyContext();
    const [bookingStartTime, setBookingStartTime] = useState(bookingStart);
    useEffect(() => {
        setStepperValue(3);
        setBookingStart("");
    }, []);

    const getRoomCapacity = (id) => {
        const room = lokaler.find((room) => room.id == id);
        if (room && room.kapacitet) {
            return room.kapacitet == 1 ? "1 Person" : room.kapacitet + " personer";
        }
    };

    const getRoomScreen = (id) => {
        const room = lokaler.find((room) => room.id == id);
        if (room) {
            return room.whiteboard ? "Whiteboard" : "Skærm";
        }
    };

    return (
        <main>
            <Container>
                <Flex mt="lg" direction="column" align="center">
                    <Title order={2}>Bekræftelse af tid</Title>
                    <Text>Booking af lokale {bookingRoom} er bekræftet</Text>
                    <Text mt="lg" ta="center">
                        Kære {UserEmail}, vi kan nu bekræfte at lokale {bookingRoom} er booket den{" "}
                        {`${bookingDate.getDate()}-${
                            bookingDate.getMonth() + 1
                        }-${bookingDate.getFullYear()} `}
                        fra {findLabel(bookingStartTime, timeslots)} i{" "}
                        {findLabel(bookingLength, bookinglengths)}
                    </Text>
                </Flex>
                <Grid p="lg">
                    <Grid.Col span="6">
                        <Stack>
                            <Title order={4}>Detaljer</Title>
                            <SimpleGrid cols={2}>
                                <div>Lokale:</div>
                                <div>{bookingRoom}</div>
                                <div>Dato:</div>
                                <div>{`${bookingDate.getDate()}-${
                                    bookingDate.getMonth() + 1
                                }-${bookingDate.getFullYear()}`}</div>
                                <div>Tidspunkt:</div>
                                <div>{findLabel(bookingStartTime, timeslots)}</div>
                                <div>Længde:</div>
                                <div>{findLabel(bookingLength, bookinglengths)}</div>
                                <div>Faciliteter:</div>
                                <div>
                                    <Group gap="xs">
                                        <IconUser />
                                        {getRoomCapacity(bookingRoom)}
                                    </Group>
                                    <Group gap="xs">
                                        <IconChalkboard />
                                        {getRoomScreen(bookingRoom)}
                                    </Group>
                                </div>
                            </SimpleGrid>
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span="6">
                        <Stack>
                            <Title order={4}>Info</Title>
                            <Text>
                                Alle booket lokaler kan ses under “mine bookinger”, herunder kan du
                                også annullere tidligere bookinger.
                            </Text>
                            <Text>
                                Hvis du har spørgsmål eller er i tvivl om noget kan du altid
                                kontakte&nbsp;
                                <Text span td="underline">
                                    kontakt@cphbusiness.dk
                                </Text>
                                &nbsp;på mail.
                            </Text>
                        </Stack>
                    </Grid.Col>
                </Grid>
            </Container>
        </main>
    );
}
