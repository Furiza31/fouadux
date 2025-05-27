import { logout as libGoogleLogout } from "@/lib/googleAuth";
import { logout as libMicrosoftLogout } from "@/lib/msalAuth";
import { googleMailService } from "@/services/googleMail.service";
import { microsoftMailService } from "@/services/microsoftMail.service";
import type { MailService } from "@/types/mail";
import type { User } from "@/types/user";
import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);
  const loading = ref(false);
  const router = useRouter();

  const init = () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      user.value = JSON.parse(storedUser) as User;
      router.push({
        name: "Dashboard",
      });
    }
  };

  const saveUser = (userData: User) => {
    user.value = userData;
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = async () => {
    if (user.value?.provider === "microsoft") {
      await microsoftLogout();
    } else if (user.value?.provider === "google") {
      await googleLogout();
    }
    localStorage.removeItem("user");
  };

  const microsoftLogin = async (loggedUser: User) => {
    loading.value = true;
    try {
      saveUser(loggedUser);
      router.push({
        name: "Dashboard",
      });
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
      router.push({
        name: "Login",
      });
    } catch (error) {
      console.error("Microsoft login failed:", error);
    } finally {
      loading.value = false;
    }
  };

  const googleLogin = async (loggedUser: User) => {
    loading.value = true;
    try {
      saveUser(loggedUser);
      router.push({
        name: "Dashboard",
      });
    } catch (error) {
      console.error("Google login failed:", error);
    } finally {
      loading.value = false;
    }
  };

  const googleLogout = async () => {
    loading.value = true;
    try {
      await libGoogleLogout({ token: user.value?.token! });
      router.push({
        name: "Login",
      });
    } catch (error) {
      console.error("Google logout failed:", error);
    } finally {
      loading.value = false;
    }
  };

  const getMailService = (): MailService => {
    return user.value?.provider === "google"
      ? googleMailService
      : microsoftMailService;
  };

  return {
    init,
    loading,
    user,
    logout,
    googleLogin,
    microsoftLogin,
    getMailService,
  };
});
