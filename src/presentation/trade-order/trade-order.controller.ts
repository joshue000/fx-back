import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TradeOrderService } from '../../application/trade-order/trade-order.service';
import { CreateTradeOrderInput } from '../../domain/trade-order';

export class TradeOrderController {
  constructor(private readonly service: TradeOrderService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const order = await this.service.create(req.body as CreateTradeOrderInput);
    res.status(StatusCodes.CREATED).json(order);
  };

  findAll = async (_req: Request, res: Response): Promise<void> => {
    const orders = await this.service.findAll();
    res.status(StatusCodes.OK).json(orders);
  };
}
