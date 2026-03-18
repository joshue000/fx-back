import { Router } from 'express';
import { PrismaTradeOrderRepository } from '../../infrastructure/repositories/trade-order.repository';
import { TradeOrderService } from '../../application/trade-order/trade-order.service';
import { TradeOrderController } from './trade-order.controller';
import { validate } from '../../middleware/validate.middleware';
import { createTradeOrderSchema, updateTradeOrderSchema } from '../../domain/trade-order';

const repository = new PrismaTradeOrderRepository();
const service = new TradeOrderService(repository);
const controller = new TradeOrderController(service);

export const tradeOrderRouter = Router();

tradeOrderRouter.get('/', controller.findAll);
tradeOrderRouter.post('/', validate(createTradeOrderSchema), controller.create);
tradeOrderRouter.get('/:id', controller.findById);
tradeOrderRouter.put('/:id', validate(updateTradeOrderSchema), controller.update);
tradeOrderRouter.delete('/:id', controller.delete);
