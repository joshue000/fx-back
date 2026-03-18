import { OpenAPIV3 } from 'openapi-types';

export const swaggerSpec: OpenAPIV3.Document = {
  openapi: '3.0.3',
  info: {
    title: 'FXReplayChallenge API',
    description: 'REST API for managing FX trade orders.',
    version: '0.0.1',
  },
  servers: [{ url: '/api/v1', description: 'API v1' }],

  tags: [
    { name: 'Health', description: 'Service health check' },
    { name: 'Trade Orders', description: 'CRUD operations for trade orders' },
  ],

  components: {
    schemas: {
      OrderSide: {
        type: 'string',
        enum: ['buy', 'sell'],
      },
      OrderType: {
        type: 'string',
        enum: ['limit', 'market', 'stop'],
      },
      OrderStatus: {
        type: 'string',
        enum: ['open', 'cancelled', 'executed'],
      },
      SupportedPair: {
        type: 'string',
        enum: ['BTCUSD', 'EURUSD', 'ETHUSD'],
      },

      TradeOrder: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid', example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' },
          side: { $ref: '#/components/schemas/OrderSide' },
          type: { $ref: '#/components/schemas/OrderType' },
          amount: { type: 'string', example: '1.50' },
          price: { type: 'string', example: '99000.00000' },
          status: { $ref: '#/components/schemas/OrderStatus' },
          pair: { $ref: '#/components/schemas/SupportedPair' },
          deleted: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },

      CreateTradeOrderBody: {
        type: 'object',
        required: ['side', 'type', 'amount', 'price', 'pair'],
        properties: {
          side: { $ref: '#/components/schemas/OrderSide' },
          type: { $ref: '#/components/schemas/OrderType' },
          amount: {
            type: 'number',
            example: 1.5,
            description: 'Max 2 decimal places. Must be greater than 0.',
          },
          price: {
            type: 'number',
            example: 99000.0,
            description: [
              'Max 5 decimal places.',
              'Limit buy: price must be below market price.',
              'Limit sell: price must be above market price.',
              'Stop buy: price must be above market price.',
              'Stop sell: price must be below market price.',
              'Market orders: no price restriction.',
            ].join(' '),
          },
          status: { $ref: '#/components/schemas/OrderStatus' },
          pair: { $ref: '#/components/schemas/SupportedPair' },
        },
      },

      UpdateTradeOrderBody: {
        type: 'object',
        description: 'At least one field is required. Price policy is re-evaluated on the effective state after the update.',
        properties: {
          side: { $ref: '#/components/schemas/OrderSide' },
          type: { $ref: '#/components/schemas/OrderType' },
          amount: { type: 'number', example: 2.0, description: 'Max 2 decimal places.' },
          price: { type: 'number', example: 98000.0, description: 'Max 5 decimal places.' },
          status: { $ref: '#/components/schemas/OrderStatus' },
          pair: { $ref: '#/components/schemas/SupportedPair' },
        },
      },

      PaginationMetadata: {
        type: 'object',
        properties: {
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 10 },
          total: { type: 'integer', example: 25 },
          totalPages: { type: 'integer', example: 3 },
        },
      },

      PaginatedTradeOrders: {
        type: 'object',
        properties: {
          data: {
            type: 'array',
            items: { $ref: '#/components/schemas/TradeOrder' },
          },
          metadata: { $ref: '#/components/schemas/PaginationMetadata' },
        },
      },

      ErrorResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'error' },
          message: { type: 'string', example: 'Something went wrong' },
        },
      },

      ValidationErrorResponse: {
        type: 'object',
        properties: {
          status: { type: 'string', example: 'error' },
          message: { type: 'string', example: 'Validation failed' },
          errors: {
            type: 'object',
            additionalProperties: {
              type: 'array',
              items: { type: 'string' },
            },
            example: { price: ['Maximum 5 decimal places allowed'] },
          },
        },
      },
    },

    responses: {
      NotFound: {
        description: 'Order not found or has been deleted',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: { status: 'error', message: 'Trade order with id <id> not found' },
          },
        },
      },
      UnprocessableEntity: {
        description: 'Input validation failed',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ValidationErrorResponse' },
          },
        },
      },
      BadRequest: {
        description: 'Business rule violation (e.g. price policy)',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: {
              status: 'error',
              message: 'Buy limit order price must be lower than the current market price (100150.4)',
            },
          },
        },
      },
    },
  },

  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        description: 'Returns the current service status and database connectivity.',
        responses: {
          '200': {
            description: 'Service is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                    database: { type: 'string', example: 'connected' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          '503': {
            description: 'Service unavailable — database unreachable',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'error' },
                    database: { type: 'string', example: 'disconnected' },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },

    '/trade_orders': {
      get: {
        tags: ['Trade Orders'],
        summary: 'List all orders',
        description: 'Returns a paginated list of non-deleted trade orders sorted by creation date descending.',
        parameters: [
          {
            in: 'query',
            name: 'page',
            schema: { type: 'integer', default: 1, minimum: 1 },
            description: 'Page number (default: 1)',
          },
          {
            in: 'query',
            name: 'limit',
            schema: { type: 'integer', default: 10, minimum: 1 },
            description: 'Number of records per page (default: 10)',
          },
        ],
        responses: {
          '200': {
            description: 'Paginated list of orders',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PaginatedTradeOrders' },
              },
            },
          },
        },
      },

      post: {
        tags: ['Trade Orders'],
        summary: 'Create an order',
        description: [
          'Creates a new trade order. Price validation rules:',
          '- **Limit buy**: price must be **below** the current market price.',
          '- **Limit sell**: price must be **above** the current market price.',
          '- **Stop buy**: price must be **above** the current market price.',
          '- **Stop sell**: price must be **below** the current market price.',
          '- **Market orders**: no price restriction.',
          '',
          'Current market prices — BTCUSD: 100150.4 | EURUSD: 1.035 | ETHUSD: 3310',
        ].join('\n'),
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateTradeOrderBody' },
              examples: {
                limitBuy: {
                  summary: 'Limit buy — BTCUSD below market',
                  value: { side: 'buy', type: 'limit', amount: 1.5, price: 99000.0, pair: 'BTCUSD' },
                },
                stopSell: {
                  summary: 'Stop sell — ETHUSD below market',
                  value: { side: 'sell', type: 'stop', amount: 3.0, price: 3200.0, pair: 'ETHUSD' },
                },
                marketBuy: {
                  summary: 'Market buy — no price restriction',
                  value: { side: 'buy', type: 'market', amount: 0.5, price: 100150.4, pair: 'BTCUSD' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Order created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TradeOrder' },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '422': { $ref: '#/components/responses/UnprocessableEntity' },
        },
      },
    },

    '/trade_orders/{id}': {
      parameters: [
        {
          in: 'path',
          name: 'id',
          required: true,
          schema: { type: 'string', format: 'uuid' },
          description: 'Trade order UUID',
        },
      ],

      get: {
        tags: ['Trade Orders'],
        summary: 'Get an order by ID',
        description: 'Returns a single non-deleted order. Returns 404 if not found or soft-deleted.',
        responses: {
          '200': {
            description: 'Order found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TradeOrder' },
              },
            },
          },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },

      put: {
        tags: ['Trade Orders'],
        summary: 'Update an order',
        description: [
          'Partially updates an order. All fields are optional but at least one must be provided.',
          'Price policy is re-evaluated against the effective state (current values merged with the update).',
          'Returns 404 if the order does not exist or has been soft-deleted.',
        ].join(' '),
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateTradeOrderBody' },
              examples: {
                statusOnly: {
                  summary: 'Update status only',
                  value: { status: 'cancelled' },
                },
                priceAndStatus: {
                  summary: 'Update price and status',
                  value: { price: 98000.0, status: 'open' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Order updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/TradeOrder' },
              },
            },
          },
          '400': { $ref: '#/components/responses/BadRequest' },
          '404': { $ref: '#/components/responses/NotFound' },
          '422': { $ref: '#/components/responses/UnprocessableEntity' },
        },
      },

      delete: {
        tags: ['Trade Orders'],
        summary: 'Delete an order',
        description: 'Soft-deletes an order by setting its `deleted` flag to `true`. The record is retained in the database but excluded from all subsequent reads. Returns 404 if already deleted.',
        responses: {
          '204': { description: 'Order deleted' },
          '404': { $ref: '#/components/responses/NotFound' },
        },
      },
    },
  },
};
