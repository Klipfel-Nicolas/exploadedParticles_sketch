import glsl from 'vite-plugin-glsl';

export default {
    build:
    {
        outDir: '../dist',
        emptyOutDir: true,
        sourcemap: true
    },
    assetsInclude: ['**/*.glb'],
    plugins:
    [
        glsl()
    ]
}