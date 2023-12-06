import useMyContext from "@/context/my-context";
import { Button, Center, Group, Modal, SimpleGrid, Stepper, Text, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconArrowLeft, IconChalkboard, IconCheck, IconUser } from "@tabler/icons-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import lokaler from "/public/lokaler";
import bookinglengths from "../../../public/bookinglengths";
import timeslots from "../../../public/timeslots";
import { toast } from "react-toastify";

export default function Menu() {
    const router = useRouter();
    const [isFrontPage, setIsFrontPage] = useState(false);
    const [isLoginPage, setIsLoginPage] = useState(false);
    useEffect(() => {
        if (typeof window !== "undefined") {
            const { pathname } = router;
            setIsFrontPage(pathname === "/");
            setIsLoginPage(pathname === "/login");
        }
    }, [router]);

    const { stepperValue, UserEmail, supabase } = useMyContext();

    const [opened, { open, close }] = useDisclosure(false);

    const [bookings, setBookings] = useState([]);
    const fetchData = async () => {
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            const { data, error } = await supabase.from("bookings").select("*");
            if (error) {
                throw error;
            }
            const filteredData = data.filter((data) => data.user_id === user?.id);
            setBookings(filteredData);
            open();
        } catch (error) {
            toast.error("Kunne ikke indlæse bookings");
        }
    };

    const findLabel = (value, arr) => {
        const label = arr.find((slot) => slot.value === value);
        return label ? label.label : "";
    };

    const delBooking = async (id) => {
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            const { data, error } = await supabase
                .from("bookings")
                .delete()
                .eq("id", id)
                .eq("user_id", user?.id);
            if (error) {
                throw Error(error);
            } else {
                document.querySelector("#booking-" + id).style.display = "none";
                toast.info("Du har fjernet din booking");
            }
        } catch (err) {
            console.error(err);
            toast.error("Kunne ikke annullere booking");
        }
    };

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
        <>
            {!isLoginPage && (
                <Group justify="center">
                    {!isFrontPage && (
                        <Button variant="subtle" color="black" onClick={() => router.back()}>
                            <IconArrowLeft style={{ width: rem(30), height: rem(30) }} />
                        </Button>
                    )}
                    <Stepper active={stepperValue}>
                        <Stepper.Step
                            label="Find lokale"
                            icon={
                                <IconCheck style={{ width: rem(18), height: rem(18) }} />
                            }></Stepper.Step>
                        <Stepper.Step
                            label="Vælg tid"
                            icon={
                                <IconCheck style={{ width: rem(18), height: rem(18) }} />
                            }></Stepper.Step>
                        <Stepper.Step
                            label="Bekræftelse"
                            icon={
                                <IconCheck style={{ width: rem(18), height: rem(18) }} />
                            }></Stepper.Step>
                    </Stepper>
                    <Button variant="outline" color="black" onClick={fetchData}>
                        Mine Bookinger
                    </Button>
                </Group>
            )}
            <Modal opened={opened} onClose={close} title="Mine bookinger">
                {bookings.map((booking) => {
                    return (
                        <div key={booking.id} id={`booking-${booking.id}`}>
                            <Text fw="700">Lokale {booking.room}</Text>
                            <SimpleGrid cols={2}>
                                <Text>Dato: {booking.date}</Text>
                                <Text>Start: {findLabel(booking.start, timeslots)}</Text>
                                <div>
                                    Faciliteter:
                                    <Group gap="xs">
                                        <IconUser />
                                        {getRoomCapacity(booking.room)}
                                    </Group>
                                    <Group gap="xs">
                                        <IconChalkboard />
                                        {getRoomScreen(booking.room)}
                                    </Group>
                                </div>
                                <Text>Længde: {findLabel(booking.length, bookinglengths)}</Text>
                            </SimpleGrid>
                            <Center mb="lg">
                                <Button
                                    onClick={() => {
                                        delBooking(booking.id);
                                    }}>
                                    Annuller booking
                                </Button>
                            </Center>
                        </div>
                    );
                })}
            </Modal>
        </>
    );
}
