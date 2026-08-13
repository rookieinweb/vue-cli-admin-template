import { createPinia, type StoreGeneric } from "pinia";

const PERSIST_STORE_IDS = new Set(["user", "permission"]);

// 每个store需要忽略缓存的字段
const PERSIST_IGNORE_FIELDS: Record<string, string[]> = {
  permission: [
    "permissionMenu",
    "permissionTree"
  ],
};

function createStrongPersistPlugin() {
  return ({ store }: { store: StoreGeneric }) => {
    if (!PERSIST_STORE_IDS.has(store.$id)) {
      return;
    }

    const storageKey = `pinia:${store.$id}`;

    const ignoreFields = PERSIST_IGNORE_FIELDS[store.$id] || [];

    try {
      const cached = localStorage.getItem(storageKey);

      if (cached) {
        const parsed = JSON.parse(cached);

        if (parsed && typeof parsed === "object") {

          // 去掉不需要恢复的字段
          ignoreFields.forEach((key)=>{
            delete parsed[key];
          });

          store.$state = {
            ...store.$state,
            ...parsed,
          };
        }
      }
    } catch {
      // ignore
    }


    store.$subscribe(() => {
      try {

        const state = {
          ...store.$state,
        };

        // 去掉不需要保存的字段
        ignoreFields.forEach((key)=>{
          delete state[key];
        });


        localStorage.setItem(
          storageKey,
          JSON.stringify(state)
        );

      } catch {
        // ignore
      }
    });
  };
}


export const pinia = createPinia();

pinia.use(createStrongPersistPlugin());