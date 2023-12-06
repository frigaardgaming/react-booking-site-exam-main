import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
    Button,
    Card,
    Flex,
    Grid,
    PasswordInput,
    Text,
    TextInput,
    Title,
    rem,
} from "@mantine/core";
import { IconAt } from "@tabler/icons-react";
import useMyContext from "@/context/my-context";
import { toast } from "react-toastify";

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    const { supabase, setUserEmail, setStepperValue } = useMyContext();
    useEffect(() => {
        setStepperValue(0);
    });
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);

        try {
            if (isSignUp) {
                await signUpNewUser();
            } else {
                await loginNewUser();
            }
        } catch (error) {
            toast.error("Fejl med autentificering");
        }

        setIsLoading(false);
    };

    const signUpNewUser = async () => {
        const { user, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                RedirectTo: "/",
            },
        });

        if (user) {
            toast.success("Bruger oprettet med " + user.email);
        } else if (error) {
            toast.error("Fejl i oprettelse, prøv igen med en kodelængde på mindst 6.");
        }
    };

    const loginNewUser = async () => {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        if (data) {
            setUserEmail(data.user.email);
            router.push("/");
            toast.success("Velkommen tilbage " + data.user.email);
        } else if (error) {
            toast.error("Kunne ikke logge ind, prøv igen");
        }
    };
    return (
        <main>
            <Grid p="lg">
                <Grid.Col span={3} />
                <Grid.Col span={6}>
                    <Card p="xl" shadow="xl">
                        <form onSubmit={handleSubmit}>
                            <Flex direction="column" gap="md" mb="md">
                                <Title order={1}>{isSignUp ? "Sign Up" : "Login"}</Title>
                                {isLoading && <Title order={2}>Loading...</Title>}
                                <TextInput
                                    label="E-mailadresse"
                                    value={email}
                                    onChange={handleEmailChange}
                                    rightSectionPointerEvents="none"
                                    rightSection={
                                        <IconAt style={{ width: rem(16), height: rem(16) }} />
                                    }
                                />
                                <PasswordInput
                                    label="Adgangskode"
                                    value={password}
                                    onChange={handlePasswordChange}
                                />
                                <Button disabled={isLoading} type="submit">
                                    {isSignUp ? "Opret bruger" : "Login"}
                                </Button>
                            </Flex>
                        </form>
                        <Text>
                            {isSignUp ? "Har du allerede en bruger? " : "Har du ikke en bruger? "}
                            <Button variant="light" onClick={() => setIsSignUp(!isSignUp)}>
                                {isSignUp ? "Login" : "Opret burger"}
                            </Button>
                        </Text>
                    </Card>
                </Grid.Col>
                <Grid.Col span={3} />
            </Grid>
        </main>
    );
};

export default Login;
