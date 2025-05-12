import axios from "axios";

export const getMenuData = async (token) => {
  try {
    const response = await axios.get("/api/menu", {
      headers: {
        Authorization: `Bearer ${token}` // Gunakan Authorization header
      }
    });
    return response.data.map(item => ({
      id: item.id,
      title: item.name,
      packaging: `Kemasan: ${item.kemasan || "Standard"}`,
      description: item.description || "",
      price: `Rp${item.price.toLocaleString("id-ID")},-`,
      image: item.imageUrl || ""
    }));
  } catch (error) {
    console.error("Error fetching menu:", error);
    throw error;
  }
};