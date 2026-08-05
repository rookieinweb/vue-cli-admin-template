import { createPinia, type StoreGeneric } from "pinia";

const PERSIST_STORE_IDS = new Set(["user", "permission"]);

function createStrongPersistPlugin() {
  return ({ store }: { store: StoreGeneric }) => {
    if (!PERSIST_STORE_IDS.has(store.$id)) {
      return;
    }

    const storageKey = `pinia:${store.$id}`;

    try {
      const cached = localStorage.getItem(storageKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed === "object") {
          store.$state = {
            ...store.$state,
            ...parsed,
          };
        }
      }
    } catch {
      // ignore localStorage parse errors and keep default store state
    }

    store.$subscribe(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(store.$state));
      } catch {
        // ignore storage write errors in private mode or restricted environments
      }
    });
  };
}

export const pinia = createPinia();
pinia.use(createStrongPersistPlugin());
