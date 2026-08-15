import { Module } from '@nestjs/common';
import { ProductModule } from '../../product/infrastructure/product.module';
import { CreateOrderUseCase } from '../application/use-cases/create-order.use-case';
import { GetOrderUseCase } from '../application/use-cases/get-order.use-case';
import { ListOrdersUseCase } from '../application/use-cases/list-orders.use-case';
import { ORDER_REPOSITORY } from '../domain/repositories/order.repository.interface';
import { OrderController } from '../presentation/order.controller';
import { PrismaOrderRepository } from './persistence/prisma-order.repository';

const useCases = [CreateOrderUseCase, GetOrderUseCase, ListOrdersUseCase];

@Module({
  imports: [ProductModule],
  controllers: [OrderController],
  providers: [
    { provide: ORDER_REPOSITORY, useClass: PrismaOrderRepository },
    ...useCases,
  ],
})
export class OrderModule {}
