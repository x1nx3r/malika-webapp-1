import axios from "axios";

export const getMenuData = async (token = null) => {
  try {
    const config = {
      withCredentials: true,
    };

    // Hanya tambahkan header Cookie jika token tersedia (untuk user yang login)
    if (token) {
      config.headers = {
        Cookie: `firebaseToken=${token}`,
      };
    }

    const response = await axios.get("/api/menu", config);

    return response.data.map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      kemasan: item.kemasan || "-",
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      amount: item.amount || "-",
      isArchived: item.isArchived || false,
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