const Login = async (email: string, password: string) => {
  try {
    const response = await fetch("http://localhost:8000/v1/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

const SignUp = async (name: string, email: string, password: string) => {
  try {
    const response = await fetch("http://localhost:8000/v1/auth/signup", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Signup failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Signup error:", error);
    throw error;
  }
};

const getChatHistory = async () => {
  try {
    const response = await fetch("http://localhost:8000/v1/ai/chat/history", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch chat history");
    }

    return response.json();
  } catch (err) {
    console.error("getChatHistory error:", err);
    throw err;
  }
};

export { SignUp, Login, getChatHistory };
