import "@/styles/globals.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { MantineProvider } from "@mantine/core";
import { MyContext } from "@/context/my-context";
import DefaultLayout from "@/components/layouts/DefaultLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    "https://tytukeevrjivlptwlunf.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5dHVrZWV2cmppdmxwdHdsdW5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5OTM5NjcsImV4cCI6MjAxNTU2OTk2N30.W5cN_a05Nhs34WhIStNP8hv9H4_BjLxHdfJS4azZJ9Y"
);

export default function App({ Component, pageProps }) {
    const [stepperValue, setStepperValue] = useState(0);
    const [UserEmail, setUserEmail] = useState("");

    const [bookingRoom, setBookingRoom] = useState();
    const [bookingDate, setBookingDate] = useState(new Date());
    const [bookingStart, setBookingStart] = useState("0");
    const [bookingLength, setBookingLength] = useState("1");
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();

                if (user) {
                    setUserEmail(user.email);
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, []); // Run this effect only once when the component mounts

    const contextValue = {
        supabase,
        stepperValue,
        setStepperValue,
        UserEmail,
        setUserEmail,
        bookingRoom,
        setBookingRoom,
        bookingDate,
        setBookingDate,
        bookingStart,
        setBookingStart,
        bookingLength,
        setBookingLength,
    };

    //Fake login
    /*
  const router = useRouter();
  const currentURL = router.asPath;
  useEffect(() => {
    if (UserEmail !== "") return;
    if (currentURL === "/login") return;
    router.push("/login");
  }, [currentURL]);
  */
    const router = useRouter();
    useEffect(() => {
        supabase.auth.onAuthStateChange((_event, session) => {
            if (session === null) {
                router.push("/login");
            } else {
                router.push("/");
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <MyContext.Provider value={contextValue}>
            <MantineProvider>
                <DefaultLayout>
                    <Component {...pageProps} />
                </DefaultLayout>
            </MantineProvider>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </MyContext.Provider>
    );
}
