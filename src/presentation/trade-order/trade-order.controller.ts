import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TradeOrderService } from '../../application/trade-order/trade-order.service';
import { CreateTradeOrderInput, findAllTradeOrdersSchema } from '../../domain/trade-order';

export class TradeOrderController {
  constructor(private readonly service: TradeOrderService) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const order = await this.service.create(req.body as CreateTradeOrderInput);
    res.status(StatusCodes.CREATED).json(order);
  };

  findAll = async (req: Request, res: Response): Promise<void> => {
    const query = findAllTradeOrdersSchema.parse(req.query);
    const result = await this.service.findAll(query);
    res.status(StatusCodes.OK).json(result);
  };
}
