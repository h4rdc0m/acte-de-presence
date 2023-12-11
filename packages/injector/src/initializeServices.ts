import { constrainedMemory } from "process";
import { Token } from "./Token";
import { Injector, Scope } from ".";

interface ServiceConfig {
    services: [{
        token: string;
        implementation: string;
        scope: string;
        params?: any[];
    }]
}
export const injector = new Injector();
async function initializeServices(configPath: string = './config') {
    try {
        const servicesConfig: ServiceConfig = await import(`${configPath}/services.json`);
        for (const service of servicesConfig.services) {
            const token = Token.for(service.token);

            // Extract potential named export from the implementation string
            const parts = service.implementation.split('#');
            const modulePath = parts[0];
            const namedExport = parts[1];

            try {
                const module = await import(modulePath);

                let implementation;
                if (namedExport && module[namedExport]) {
                    implementation = module[namedExport];
                } else if (module.default) {
                    implementation = module.default;
                } else {
                    throw new Error(`Could not find implementation for service '${service.token}' in module '${modulePath}'.`);
                }

                const scope = Scope[service.scope as keyof typeof Scope]; // fix
                injector.register(token, implementation, scope);
            } 
            catch (error) {
                throw new Error(`Could not load implementation for service '${service.token}' from module '${modulePath}'. With: ${error}`);
            }
        }
    } catch (error) {
        console.error(error);
        throw new Error(`Could not load services config from '${configPath}/services.json'. With: ${error}`);
    }
}