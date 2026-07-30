/**
 * Main deployer module - Orchestrates deployments to various providers
 */

import { X402Config, DeployProvider } from "../types/config.js";
import { RailwayDeployer, RailwayDeployResult, createRailwayDeployer, deployToRailway } from "./railway.js";
import { FlyDeployer, FlyDeployResult, createFlyDeployer, deployToFly } from "./fly.js";
import { VercelDeployer, VercelDeployResult, createVercelDeployer, deployToVercel } from "./vercel.js";
import { DockerDeployer, DockerDeployResult, createDockerDeployer, deployWithDocker } from "./docker.js";

/**
 * Generic deploy result
 */
export interface DeployResult {
  url: string;
  provider: DeployProvider;
  deploymentId: string;
  projectId?: string;
  projectName?: string;
  status: string;
  metadata?: Record<string, unknown>;
}

/**
 * Deploy options
 */
export interface DeployOptions {
  /** Override provider from config */
  provider?: DeployProvider;
  /** API token for the provider */
  apiToken?: string;
  /** Wait for deployment to complete */
  wait?: boolean;
  /** Verbose logging */
  verbose?: boolean;
  /** Environment (production, preview) */
  environment?: "production" | "preview";
  /** Report the plan without calling any provider API */
  dryRun?: boolean;
}

/**
 * Main deploy function - routes to appropriate deployer
 */
export async function deployToProvider(
  config: X402Config,
  projectDir: string,
  options: DeployOptions = {}
): Promise<DeployResult> {
  const provider = options.provider || config.deploy?.provider || "railway";

  if (options.verbose) {
    console.log(`[deploy] Deploying to ${provider}...`);
  }

  switch (provider) {
    case "railway":
      return toDeployResult("railway", await deployToRailway(config, projectDir, options));

    case "fly":
      return toDeployResult("fly", await deployToFly(config, projectDir, options));

    case "vercel":
      return toDeployResult("vercel", await deployToVercel(config, projectDir, options));

    case "docker":
    case "self-hosted":
      return deploySelfHosted(config, projectDir, options);

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

/**
 * Normalize a provider-specific deploy summary into the generic DeployResult.
 */
function toDeployResult(
  provider: DeployProvider,
  result: {
    success: boolean;
    url: string;
    status: string;
    dryRun: boolean;
    deploymentId?: string;
    projectId?: string;
    projectName?: string;
    appName?: string;
    appUrl?: string;
    productionUrl?: string;
    aliases?: string[];
    machines?: unknown;
    regions?: string[];
    serviceId?: string;
  }
): DeployResult {
  return {
    url: result.productionUrl || result.appUrl || result.url,
    provider,
    deploymentId: result.deploymentId || result.appName || "dry-run",
    projectId: result.projectId,
    projectName: result.projectName || result.appName,
    status: result.status,
    metadata: {
      dryRun: result.dryRun,
      ...(result.serviceId ? { serviceId: result.serviceId } : {}),
      ...(result.machines ? { machines: result.machines } : {}),
      ...(result.regions ? { regions: result.regions } : {}),
      ...(result.aliases ? { aliases: result.aliases } : {}),
      ...(result.productionUrl ? { deploymentUrl: result.url } : {}),
    },
  };
}

/**
 * Generate self-hosted deployment instructions
 */
async function deploySelfHosted(
  config: X402Config,
  projectDir: string,
  options: DeployOptions
): Promise<DeployResult> {
  // Use Docker deployer for actual deployment
  const deployer = createDockerDeployer({ verbose: options.verbose });
  
  // Check if Docker is available
  const dockerAvailable = await deployer.checkDocker();
  
  if (dockerAvailable) {
    // Actually deploy with Docker
    const result = await deployer.deploy(config, projectDir, {
      compose: true,
      verbose: options.verbose,
    });
    
    return {
      url: result.url,
      provider: "docker",
      deploymentId: result.containerId || "local",
      projectName: config.name,
      status: result.status,
      metadata: {
        imageName: result.imageName,
        containerId: result.containerId,
        containerName: result.containerName,
        ports: result.ports,
      },
    };
  }
  
  // Fallback to instructions if Docker not available
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║           Self-Hosted Deployment Instructions                  ║
╠════════════════════════════════════════════════════════════════╣
║                                                                ║
║  Docker is not installed or not running.                       ║
║  Install from: https://www.docker.com/get-started              ║
║                                                                ║
║  Once installed, run:                                          ║
║                                                                ║
║  1. Build the Docker image:                                    ║
║     docker build -t ${config.name} .                           ║
║                                                                ║
║  2. Run with Docker Compose:                                   ║
║     docker-compose up -d                                       ║
║                                                                ║
║  3. Or run directly:                                           ║
║     docker run -p 3000:3000 --env-file .env ${config.name}     ║
║                                                                ║
║  4. Configure your reverse proxy (nginx/traefik) for HTTPS     ║
║                                                                ║
║  Generated files:                                              ║
║    - Dockerfile                                                ║
║    - docker-compose.yml                                        ║
║    - .env.example                                              ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`);

  return {
    url: "http://localhost:3000",
    provider: "self-hosted",
    deploymentId: "local",
    projectName: config.name,
    status: "ready",
    metadata: {
      instructions: "Use docker-compose up -d to start",
    },
  };
}

/**
 * Check deployment status
 */
export async function checkDeploymentStatus(
  provider: DeployProvider,
  deploymentId: string,
  options: { apiToken?: string } = {}
): Promise<{ status: string; url?: string }> {
  switch (provider) {
    case "railway": {
      const deployer = createRailwayDeployer(options.apiToken);
      // Would need to implement getDeploymentStatus method
      return { status: "unknown" };
    }

    case "fly": {
      const deployer = createFlyDeployer(options.apiToken);
      const status = await deployer.getStatus(deploymentId);
      return { status, url: `https://${deploymentId}.fly.dev` };
    }

    case "vercel": {
      const deployer = createVercelDeployer(options.apiToken);
      const deployment = await deployer.getDeployment(deploymentId);
      return { status: deployment.state, url: `https://${deployment.url}` };
    }

    default:
      return { status: "unknown" };
  }
}

/**
 * Get deployment logs
 */
export async function getDeploymentLogs(
  provider: DeployProvider,
  deploymentId: string,
  options: { apiToken?: string; lines?: number } = {}
): Promise<string[]> {
  switch (provider) {
    case "railway": {
      const deployer = createRailwayDeployer(options.apiToken);
      return deployer.getLogs(deploymentId);
    }

    case "fly": {
      const deployer = createFlyDeployer(options.apiToken);
      const logs = await deployer.getLogs(deploymentId, options.lines || 100);
      return logs.split("\n");
    }

    case "vercel": {
      const deployer = createVercelDeployer(options.apiToken);
      return deployer.getLogs(deploymentId);
    }

    default:
      return [];
  }
}

/**
 * Delete a deployment/project
 */
export async function deleteDeployment(
  provider: DeployProvider,
  projectId: string,
  options: { apiToken?: string } = {}
): Promise<void> {
  switch (provider) {
    case "railway": {
      const deployer = createRailwayDeployer(options.apiToken);
      await deployer.deleteProject(projectId);
      break;
    }

    case "fly": {
      const deployer = createFlyDeployer(options.apiToken);
      await deployer.deleteApp(projectId);
      break;
    }

    case "vercel": {
      const deployer = createVercelDeployer(options.apiToken);
      await deployer.deleteProject(projectId);
      break;
    }
  }
}

// Re-export deployers
export { RailwayDeployer, RailwayDeployResult, createRailwayDeployer, deployToRailway } from "./railway.js";
export { FlyDeployer, FlyDeployResult, createFlyDeployer, deployToFly } from "./fly.js";
export { VercelDeployer, VercelDeployResult, createVercelDeployer, deployToVercel } from "./vercel.js";
export { DockerDeployer, DockerDeployResult, createDockerDeployer, deployWithDocker } from "./docker.js";
