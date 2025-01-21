"use client";

import { useState } from "react";
import { loginUser } from "@/lib/api/user";
import { Button, TextInput, PasswordInput, Notification } from "@mantine/core";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await loginUser(email, password);
      document.cookie = `token=${data.token}; path=/`; // Armazena o token em um cookie
      router.push("/"); // Redireciona para o dashboard
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <Notification color="red">{error}</Notification>}
      <TextInput
        label="E-mail"
        placeholder="Digite seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <PasswordInput
        label="Senha"
        placeholder="Digite sua senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        mt="md"
      />
      <Button type="submit" fullWidth mt="xl">
        Entrar
      </Button>
    </form>
  );
}
