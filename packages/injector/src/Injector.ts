import { Binding } from "./Binding";
import { Scope } from "./Scope";
import { Token } from "./Token";
import { getDefaultTokenForClass } from "./getDefaultTokenForClass";

export class Injector {
    private readonly bindings: Map<string, Binding<any>> = new Map();

    public constructor() { }

    public register<T>(token: Token<T>, clazz: new (...args: any[]) => T, scope: Scope = Scope.Transient): void {
        token = token || getDefaultTokenForClass(clazz);
        if (this.bindings.has(token.toString())) {
            throw new Error(`Token '${token.name}' is already registered.`);
        }
        this.bindings.set(token.toString(), new Binding(token, clazz, scope));
    }

    public resolve<T>(token: Token<T>): T {
        const binding = this.bindings.get(token.toString());

        if (!binding) {
            throw new Error(`No binding found for token: '${token.toString()}'.`);
        }

        if (binding.scope === Scope.Singleton && binding.instance) {
            return binding.instance;
        }

        // Resolve constructor dependencies
        const dependencies = Reflect.getMetadata('custom:inject', binding.cls) || [];
        const args = dependencies.map(dep => {
            const depBinding = this.bindings.get(dep.token.toString());
            if (!depBinding) {
                if (dep.isOptional) return undefined;
                throw new Error(`Dependency token '${dep.token.toString()}' not registered.`);
            }
            return this.resolve(dep.token);
        });

        const instance = new binding.cls(...args);
        if (binding.scope === Scope.Singleton) {
            binding.instance = instance;
        }

        return instance;
    }

    public clear(): void {
        this.bindings.clear();
    }
}
