import { logout as libGoogleLogout } from "@/lib/googleAuth";
import { logout as libMicrosoftLogout } from "@/lib/msalAuth";
import { useApiService } from "@/services/api.service";
import type { User } from "@/types/user";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);
  const loading = ref(false);
  const router = useRouter();
  const apiService = useApiService();
  const providerToken = ref<string | null>(null);

  const init = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user.value = JSON.parse(storedUser) as User;
      router.push({
        name: "Dashboard",
      });
    }
  };

  const saveUser = async (userData: {
    email: string;
    uuid: string;
    token: string;
    expireAt: Date;
    provider: "microsoft" | "google";
  }) => {
    const response = await apiService.post<{
      user: User;
      token: string;
    }>("/users", {
      email: userData.email,
      uuid: userData.uuid,
      name: userData.provider,
      token: userData.token,
      expireAt: userData.expireAt,
    });
    providerToken.value = userData.token;
    user.value = {
      id: response.data.user.id,
      email: response.data.user.email,
      token: response.data.token,
      uuid: response.data.user.uuid,
      provider: userData.provider,
    };
    localStorage.setItem("user", JSON.stringify(user.value));
    router.push({
      name: "Dashboard",
    });
  };

  const logout = async () => {
    if (user.value?.provider === "microsoft") {
      await microsoftLogout();
    } else if (user.value?.provider === "google") {
      await googleLogout();
    }
    localStorage.removeItem("user");
    user.value = null;
    router.push({
      name: "Login",
    });
  };

  const microsoftLogin = async (loggedUser: {
    email: string;
    uuid: string;
    token: string;
    expireAt: Date;
    provider: "microsoft";
  }) => {
    loading.value = true;
    try {
      await saveUser(loggedUser);
    } catch (error) {
      console.error("Microsoft login failed:", error);
    } finally {
      loading.value = false;
    }
  };

  const microsoftLogout = async () => {
    loading.value = true;
    try {
      await libMicrosoftLogout();
    } catch (error) {
      console.error("Microsoft login failed:", error);
    } finally {
      loading.value = false;
    }
  };

  const googleLogin = async (loggedUser: {
    email: string;
    uuid: string;
    token: string;
    expireAt: Date;
    provider: "google";
  }) => {
    loading.value = true;
    try {
      await saveUser(loggedUser);
    } catch (error) {
      console.error("Google login failed:", error);
    } finally {
      loading.value = false;
    }
  };

  const googleLogout = async () => {
    loading.value = true;
    try {
      await libGoogleLogout({ token: providerToken.value! });
    } catch (error) {
      console.error("Google logout failed:", error);
    } finally {
      loading.value = false;
    }
  };

  return {
    init,
    loading,
    user,
    logout,
    googleLogin,
    microsoftLogin,
  };
});
