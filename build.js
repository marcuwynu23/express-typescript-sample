const esbuild = require('esbuild');
const fs = require('fs').promises;
const path = require('path');

const isWatch = process.argv.includes('--watch');

const buildOptions = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  outdir: 'dist',
  platform: 'node',
  target: 'node18',
  format: 'cjs',
  sourcemap: false,
  external: ['pino', 'pino-worker', 'thread-stream'],
};

async function copyOpenAPISpec() {
  const openAPISpecPath = path.join(__dirname, 'openapi');
  const distOpenAPISpecPath = path.join(__dirname, 'dist', 'openapi');

  try {
    await fs.stat(openAPISpecPath);
    console.log('Copying openapi directory...');
    await fs.cp(openAPISpecPath, distOpenAPISpecPath, { recursive: true });
    console.log('openapi directory copied to dist!');
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
    console.log('openapi directory not found, skipping...');
  }
}

async function copyNodeModules() {
  const modulesToCopy = ['pino', 'pino-worker', 'thread-stream'];
  const nodeModulesPath = path.join(__dirname, 'node_modules');
  const distNodeModulesPath = path.join(__dirname, 'dist', 'node_modules');

  for (const module of modulesToCopy) {
    const srcPath = path.join(nodeModulesPath, module);
    const destPath = path.join(distNodeModulesPath, module);

    try {
      await fs.stat(srcPath);
      console.log(`Copying ${module}...`);
      await fs.cp(srcPath, destPath, { recursive: true });
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
      console.log(`Module ${module} not found, skipping...`);
    }
  }
}

async function copyEnvExample() {
  const envExamplePath = path.join(__dirname, '.env.example');
  const distEnvExamplePath = path.join(__dirname, 'dist', '.env.example');

  try {
    await fs.stat(envExamplePath);
    console.log('Copying .env.example...');
    await fs.copyFile(envExamplePath, distEnvExamplePath);
    console.log('.env.example copied to dist!');
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
    console.log('.env.example not found, skipping...');
  }
}

async function build() {
  if (isWatch) {
    const ctx = await esbuild.context(buildOptions);
    await ctx.watch();
    console.log('Watching for changes...');
  } else {
    await esbuild.build(buildOptions);
    await copyOpenAPISpec();
    await copyNodeModules();
    await copyEnvExample();
    console.log('Build complete!');
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
