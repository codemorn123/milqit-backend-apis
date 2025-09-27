import { Container, decorate, injectable } from 'inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import { Controller } from 'tsoa';

const container = new Container();
decorate(injectable(), Controller);

container.load(buildProviderModule());

export { container };