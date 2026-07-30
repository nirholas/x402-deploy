/**
 * Templates module - Export all template generators
 */

// Dockerfile templates
export {
  generateDockerfile,
  generateNodeDockerfile,
  generatePythonDockerfile,
  generateNextjsDockerfile,
  generateDockerignore,
} from "./dockerfile.js";

// Railway templates
export {
  generateRailwayJson,
  generateRailwayToml,
  generateRailwayEnvVars,
  generateRailwayNixpacksConfig,
  generateProcfile,
  type RailwayConfig,
  type RailwayServiceConfig,
} from "./railway.js";

// Fly.io templates
export {
  generateFlyToml,
  generateFlySecrets,
  generateFlySecretCommands,
  generateFlyMachinesConfig,
  generateFlyMultiRegion,
  FLY_REGIONS,
  type FlyConfig,
  type FlyRegion,
} from "./fly.js";

// Vercel templates
export {
  generateVercelJson,
  generateNextMiddleware,
  generateNextApiWrapper,
  generateVercelEnvs,
  toVercelApiEnvs,
  VERCEL_REGIONS,
  type VercelConfig,
  type VercelRegion,
} from "./vercel.js";

// Docker Compose templates
export {
  generateDockerCompose,
  generateFullStackCompose,
  generateEnvExample,
  generatePrometheusConfig,
} from "./docker-compose.js";

// Wrapper code templates
export {
  generateNodeWrapper,
  generatePythonWrapper,
  generateMcpWrapper,
  generateWrapperPackageAdditions,
} from "./wrapper-code.js";
