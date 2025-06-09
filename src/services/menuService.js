import axios from "axios";

export const getMenuData = async (token) => {
  try {
    // Instead of setting as Authorization header,
    // we need to set the cookie in the request
    const response = await axios.get("/api/menu", {
      withCredentials: true, // Important for sending cookies
      headers: {
        Cookie: `firebaseToken=${token}`, // This matches what the API expects
      },
    });

    return response.data.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      kemasan: item.kemasan || "-",
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      amount: item.amount || "-",
    }));
  } catch (error) {
    console.error("Error fetching menu:", error);
    if (error.response?.status === 401) {
      console.error(
        "Authentication failed - token might be invalid or expired",
      );
    }
    throw error;
  }
};
