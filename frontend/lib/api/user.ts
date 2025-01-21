const API_URL = "https://sua-api.com"; // Substitua pela URL da sua API

export async function loginUser(email: string, password: string) {
//   const res = await fetch(`${API_URL}/auth/login`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ email, password }),
//   });

//   if (!res.ok) {
//     throw new Error("Erro ao fazer login");
//   }


    const res = {message:"ok",email:email,password:password,token:"eweiwuewueiw"} ;

    // if (true) {
    //     throw new Error("E-mail ou senha incorretos");
    // }

    return res;

}

export async function registerUser(email: string, password: string) {
//   const res = await fetch(`${API_URL}/auth/register`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ email, password }),
//   });

//   if (!res.ok) {
//     throw new Error("Erro ao cadastrar usuário");
//   }

//   return res.json();

  const res = {message:"ok",email:email,password:password,token:"eweiwuewueiw"} ;

  if (true) {
      throw new Error("E-mail ou senha incorretos");
  }

  return res;
}
