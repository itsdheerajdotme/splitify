import { useState, useEffect, useCallback } from "react";

export function useServiceWorkerUpdate() {
  const [hasUpdate, setHasUpdate] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [lastCheckMessage, setLastCheckMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    // Register service worker
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        setSwRegistration(registration);

        // Check if there is already a waiting service worker
        if (registration.waiting) {
          setHasUpdate(true);
        }

        // Listen for new service worker installation
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              setHasUpdate(true);
            }
          });
        });
      })
      .catch((err) => {
        console.error("SW Registration failed:", err);
      });

    // Handle controllerchange (reload after skipWaiting)
    let refreshing = false;
    const handleControllerChange = () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    };

    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
    };
  }, []);

  // Function to perform a registration.update() check
  const checkForUpdates = useCallback(async (): Promise<boolean> => {
    if (!("serviceWorker" in navigator) || !navigator.onLine) {
      setLastCheckMessage("Offline - Cannot check for updates");
      return false;
    }

    setIsChecking(true);
    setLastCheckMessage(null);

    try {
      const reg = swRegistration || (await navigator.serviceWorker.getRegistration());
      if (reg) {
        await reg.update();
        localStorage.setItem("splitify_sw_last_check", Date.now().toString());

        if (reg.waiting) {
          setHasUpdate(true);
          setIsChecking(false);
          return true;
        } else {
          setLastCheckMessage("You are on the latest version!");
        }
      }
    } catch (err) {
      console.warn("Update check failed:", err);
      setLastCheckMessage("Update check failed");
    } finally {
      setIsChecking(false);
    }

    return false;
  }, [swRegistration]);

  // Periodic daily check & network reconnect check
  useEffect(() => {
    const handleOnline = () => {
      checkForUpdates();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        const lastCheck = localStorage.getItem("splitify_sw_last_check");
        const oneDayMs = 24 * 60 * 60 * 1000;
        if (!lastCheck || Date.now() - parseInt(lastCheck, 10) > oneDayMs) {
          checkForUpdates();
        }
      }
    };

    window.addEventListener("online", handleOnline);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Initial check after 5s if online
    const timer = setTimeout(() => {
      if (navigator.onLine) {
        checkForUpdates();
      }
    }, 5000);

    return () => {
      window.removeEventListener("online", handleOnline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearTimeout(timer);
    };
  }, [checkForUpdates]);

  const applyUpdate = () => {
    if (swRegistration && swRegistration.waiting) {
      swRegistration.waiting.postMessage({ type: "SKIP_WAITING" });
    } else {
      window.location.reload();
    }
  };

  return {
    hasUpdate,
    isChecking,
    lastCheckMessage,
    checkForUpdates,
    applyUpdate,
  };
}
