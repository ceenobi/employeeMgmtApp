import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const useSaveToken = create(
  persist(
    (set) => ({
      token: null,
      setToken: (state: string) => set({ token: state }),
    }),
    {
      name: "emplytoken",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useToggleSidebar = create(
  persist(
    (set) => ({
      isOpenSideBar: true,
      hideSideBar: false,
      setIsOpenSideBar: (state: boolean) => set({ isOpenSideBar: state }),
      setHideSideBar: (state: boolean) => set({ hideSideBar: state }),
    }),
    {
      name: "sidebar-toggle",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export const useSaveForm = create(
  persist(
    (set) => ({
      form: null,
      setForm: (state: string) => set({ form: state }),
    }),
    {
      name: "emplyform",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
