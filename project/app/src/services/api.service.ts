import { useUserStore } from "@/stores/user.store";

export const useApiService = () => {
  const baseUrl = "/api";

  const get = async <T>(url: string): Promise<{ data: T }> => {
    const response = await fetch(`${baseUrl}${url}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${useUserStore().user?.token || ""}`,
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  };

  const post = async <T>(url: string, body: any): Promise<{ data: T }> => {
    const response = await fetch(`${baseUrl}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${useUserStore().user?.token || ""}`,
      },
      body: JSON.stringify(body),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  };

  const put = async <T>(url: string, body: any): Promise<{ data: T }> => {
    const response = await fetch(`${baseUrl}${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${useUserStore().user?.token || ""}`,
      },
      body: JSON.stringify(body),
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  };

  const del = async <T>(url: string): Promise<{ data: T }> => {
    const response = await fetch(`${baseUrl}${url}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${useUserStore().user?.token || ""}`,
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  };

  return { get, post, put, delete: del };
};
