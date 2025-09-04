import { Container, decorate, injectable } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import { Controller } from 'tsoa';

// Create IoC container
const container = new Container();

// Make controllers injectable
decorate(injectable(), Controller);

// Create module from providers
container.load(buildProviderModule());

// Export container for TSOA
export { container };