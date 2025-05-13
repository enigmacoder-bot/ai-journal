const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

const getAuthToken = () => {
  return localStorage.getItem("auth_token");
};

const request = async (
  endpoint,
  method = "GET",
  body = null,
  includeAuth = true
) => {
  const headers = {
    "Content-Type": "application/json",
  };

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      // Log more detailed error from backend if available
      console.error("API Error Response:", data);
      throw new Error(
        data.message || `Error: ${response.status} ${response.statusText}`
      );
    }
    return data;
  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error);
    throw error; // Re-throw to be caught by calling function
  }
};

export const apiService = {
  get: (endpoint, includeAuth = true) =>
    request(endpoint, "GET", null, includeAuth),
  post: (endpoint, body, includeAuth = true) =>
    request(endpoint, "POST", body, includeAuth),
  put: (endpoint, body, includeAuth = true) =>
    request(endpoint, "PUT", body, includeAuth),
  delete: (endpoint, includeAuth = true) =>
    request(endpoint, "DELETE", null, includeAuth),
  // Special methods for auth that don't require auth header for the request itself
  login: (credentials) => request("/auth/login", "POST", credentials, false),
  signup: (userData) => request("/auth/signup", "POST", userData, false),
};
