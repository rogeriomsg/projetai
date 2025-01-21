import { LoginForm } from "@/components/Forms/LoginForm";
import { Paper, Text, Container } from "@mantine/core";

export default function LoginPage() {
  return (
    <Container size={420} my={40}>
      <Text ta="center" size="lg" fw={700}>
        Bem-vindo de volta!
      </Text>
      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <LoginForm />
      </Paper>
    </Container>
  );
}
