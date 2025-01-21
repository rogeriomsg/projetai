import { RegisterForm } from "@/components/Forms/RegisterForm";
import { Paper, Text, Container } from "@mantine/core";

export default function RegisterPage() {
  return (
    <Container size={420} my={40}>
      <Text ta="center" size="lg" fw={700}>
        Crie sua conta
      </Text>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <RegisterForm />
      </Paper>
    </Container>
  );
}
