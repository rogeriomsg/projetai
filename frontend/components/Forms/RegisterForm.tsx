"use client";

import { useState } from "react";
import { registerUser } from "@/lib/api/user";
import { Button, TextInput, PasswordInput, Notification } from "@mantine/core";
import { useRouter } from "next/navigation";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await registerUser(email, password);
      router.push("/login"); // Redireciona para o login ap�s o cadastro
    } catch (err: any) {
      setError(err.message || "Erro ao cadastrar usuário");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <Notification color="red">{error}</Notification>}
      <TextInput
        label="Nome completo"
        placeholder="Digite seu nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TextInput
        label="E-mail"
        placeholder="Digite seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        mt="md" //margem top
      />
      <PasswordInput
        label="Senha"
        placeholder="Digite sua senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        mt="md" //margem top
      />
      <Button type="submit" fullWidth mt="xl">
        Cadastrar
      </Button>
    </form>
  );
}
