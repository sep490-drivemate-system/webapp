import type { Config } from "tailwindcss";

const config: Config = {
    theme: {
        extend: {
            colors: {
                primary: "var(--color-primary)",
                secondary: "var(--color-secondary)",
            },
        },
    },
    plugins: [],
};

export default config;
