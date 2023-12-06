import { useRouter } from "next/router";
import lokaler from "/public/lokaler";
import { Button, Center, Container, Flex, Group, Image, Text, Title, rem } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { Grid, Select } from "@mantine/core";
import { IconClock, IconMan, IconChalkboard, IconUser } from "@tabler/icons-react";
import useMyContext from "@/context/my-context";
import bookinglengths from "../../public/bookinglengths";
import timeslots from "../../public/timeslots";
import { toast } from "react-toastify";

export default function RoomPage({ room }) {
    const router = useRouter();
    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    const {
        setStepperValue,
        UserEmail,
        setBookingRoom,
        bookingDate,
        bookingStart,
        setBookingStart,
        bookingLength,
        supabase,
        setBookingLength,
    } = useMyContext();
    useEffect(() => {
        setStepperValue(1);
        setBookingRoom(room.id);
    }, []);

    //Previous bookings
    const [bookings, setBookings] = useState([]);
    const fetchData = async () => {
        try {
            const tableName = "bookings";
            const projectUrl = "https://tytukeevrjivlptwlunf.supabase.co";
            const response = await fetch(projectUrl + "/rest/v1/" + tableName, {
                headers: {
                    "Content-Type": "application/json",
                    apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5dHVrZWV2cmppdmxwdHdsdW5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5OTM5NjcsImV4cCI6MjAxNTU2OTk2N30.W5cN_a05Nhs34WhIStNP8hv9H4_BjLxHdfJS4azZJ9Y",
                },
            });
            const newData = await response.json();
            const filteredData = newData.filter(
                (data) =>
                    data.room === room.id &&
                    data.date ===
                        `${bookingDate.getDate()}-${
                            bookingDate.getMonth() + 1
                        }-${bookingDate.getFullYear()}`
            );
            setBookings(filteredData);
        } catch (error) {
            toast.error("Kunne ikke indlæse bookings");
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    // !!CHATGPT DO NOT TOUCH!!
    const updatedTimeslots = timeslots.map((slot) => {
        const bookingStart = parseInt(slot.value);
        const bookingEnd = bookingStart + 1;

        const isDisabled = bookings.some((booking) => {
            const start = parseInt(booking.start);
            const end = start + parseInt(booking.length);

            return (
                (bookingStart >= start && bookingStart < end) ||
                (bookingEnd > start && bookingEnd <= end) ||
                (bookingStart <= start && bookingEnd >= end)
            );
        });

        return {
            ...slot,
            disabled: isDisabled,
        };
    });
    const [availableBookingLengths, setAvailableBookingLengths] = useState(bookinglengths);
    const handleStartTimeChange = (value) => {
        setBookingStart(value);
        setBookingLength("1");
        if (value !== null) {
            const selectedStart = parseInt(value, 10);
            const bookedTimes = bookings.map((booking) => ({
                start: parseInt(booking.start, 10),
                end: parseInt(booking.start, 10) + parseInt(booking.length, 10),
            }));
            const remainingLengths = bookinglengths.filter(({ value }) => {
                const bookingEnd = selectedStart + parseInt(value, 10);
                return !bookedTimes.some(
                    (booking) => selectedStart < booking.end && bookingEnd > booking.start
                );
            });
            setAvailableBookingLengths(remainingLengths);
        } else {
            setAvailableBookingLengths(bookinglengths);
        }
    };
    // !!END OF CHATGPT CODE!!

    const handleSubmit = async (event) => {
        event.preventDefault();

        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (bookingStart === "" || bookingLength === "") {
            toast.error("Udfyld venligst begge felter");
            return;
        }
        const bookingData = {
            room: room.id,
            date: `${bookingDate.getDate()}-${
                bookingDate.getMonth() + 1
            }-${bookingDate.getFullYear()}`,
            start: bookingStart,
            length: bookingLength,
            user_id: user.id,
        };
        try {
            const { data, error } = await supabase.from("bookings").insert([bookingData]).select();

            if (error) {
                throw error;
            }
            router.push("/confirmation");
            toast.success("Lokale " + room.id + " er nu booket");
        } catch (error) {
            toast.error("Fejl i booking");
            console.error("Error during booking:", error.message);
        }
    };

    return (
        <main>
            <Container>
                <Center mt="lg">
                    <Title order={2}>Vælg tidspunkt</Title>
                </Center>
                <Grid p="lg">
                    <Grid.Col span="6">
                        <Image src="room.jpg" pr="lg" pl="lg" />
                    </Grid.Col>
                    <Grid.Col span="6">
                        <Flex gap="md" direction="column">
                            <div>
                                <Title order={3}>Lokale: {room.id}</Title>
                                <Text>
                                    Dato:{" "}
                                    {`${bookingDate.getDate()}-${
                                        bookingDate.getMonth() + 1
                                    }-${bookingDate.getFullYear()}`}
                                </Text>
                            </div>
                            <div>
                                <Title order={4} size="md">
                                    Lokalets faciliteter
                                </Title>
                                <Group gap="xs">
                                    <IconUser stroke={1.5} />
                                    {room.kapacitet == 1
                                        ? "1 person"
                                        : `${room.kapacitet} personer`}
                                </Group>
                                <Group gap="xs">
                                    <IconChalkboard stroke={1.5} />
                                    {room.whiteboard ? "Whiteboard" : "Skærm"}
                                </Group>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <Flex gap="md" direction="column">
                                    <Select
                                        label="Book fra:"
                                        withAsterisk
                                        allowDeselect={false}
                                        description="Tidspunktet din reservation start fra"
                                        placeholder="Vælg tid"
                                        data={updatedTimeslots}
                                        onChange={(value) => handleStartTimeChange(value)}
                                        value={bookingStart}
                                        leftSection={
                                            <IconClock
                                                style={{ width: rem(16), height: rem(16) }}
                                                stroke={1.5}
                                            />
                                        }
                                    />
                                    <Select
                                        label="Længde af booking:"
                                        withAsterisk
                                        allowDeselect={false}
                                        description="Længden af din reservation"
                                        placeholder="Vælg længde"
                                        data={availableBookingLengths}
                                        onChange={(value) => setBookingLength(value)}
                                        value={bookingLength}
                                        leftSection={
                                            <IconClock
                                                style={{ width: rem(16), height: rem(16) }}
                                                stroke={1.5}
                                            />
                                        }
                                    />
                                    <Center>
                                        <Button type="submit">Bekræft tid</Button>
                                    </Center>
                                </Flex>
                            </form>
                        </Flex>
                    </Grid.Col>
                </Grid>
            </Container>
        </main>
    );
}

export async function getStaticPaths() {
    const paths = lokaler.map((room) => ({
        params: { slug: room.id },
    }));

    return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
    const room = lokaler.find((r) => r.id === params.slug);

    if (!room) {
        return {
            notFound: true,
        };
    }

    const serializableRoom = JSON.parse(JSON.stringify(room));

    return {
        props: {
            room: serializableRoom,
        },
    };
}
