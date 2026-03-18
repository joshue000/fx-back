import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TradeOrderService } from '../../application/trade-order/trade-order.service';
import {
  CreateTradeOrderInput,
  UpdateTradeOrderInput,
  findAllTradeOrdersSchema,
} from '../../domain/trade-order';

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

  findById = async (req: Request, res: Response): Promise<void> => {
    const order = await this.service.findById(req.params['id'] as string);
    res.status(StatusCodes.OK).json(order);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const order = await this.service.update(req.params['id'] as string, req.body as UpdateTradeOrderInput);
    res.status(StatusCodes.OK).json(order);
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    await this.service.delete(req.params['id'] as string);
    res.status(StatusCodes.NO_CONTENT).send();
  };
}
