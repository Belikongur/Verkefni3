const isCodeSandbox = !!process.env.SANDBOX_URL

export default {
    root: "src/",
    publicDir: "../resources/",
    base: "/Verkefni3/",
    server:
    {
        host: true,
        open: !isCodeSandbox // Open if it's not a CodeSandbox
    },
    build:
    {
        outDir: "../dist",
        emptyOutDir: true,
        sourcemap: true
    }
}