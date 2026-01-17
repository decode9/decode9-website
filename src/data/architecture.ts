import { ArchitectureExample } from '@/interfaces';

export const architectureExamples: ArchitectureExample[] = [
  {
    id: 'microservices',
    title: 'Arquitectura de Microservicios',
    description: 'Diseño de sistemas distribuidos con servicios independientes, comunicación asíncrona y alta disponibilidad.',
    code: `// API Gateway - Punto de entrada único
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

// Routing a microservicios
app.use('/api/users', createProxyMiddleware({
  target: process.env.USER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/users': '' }
}));

app.use('/api/orders', createProxyMiddleware({
  target: process.env.ORDER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: { '^/api/orders': '' }
}));

// Health check para load balancer
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

// Circuit breaker pattern
import CircuitBreaker from 'opossum';

const breaker = new CircuitBreaker(asyncServiceCall, {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 30000
});

breaker.fallback(() => ({ cached: true, data: cachedData }));`,
    language: 'typescript',
    tags: ['microservices', 'api-gateway', 'circuit-breaker', 'docker'],
  },
  {
    id: 'clean-architecture',
    title: 'Clean Architecture',
    description: 'Separación de responsabilidades con capas independientes: dominio, aplicación, infraestructura.',
    code: `// Domain Layer - Entidades y reglas de negocio
interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<void>;
  delete(id: string): Promise<void>;
}

// Application Layer - Casos de uso
class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService
  ) {}

  async execute(data: CreateUserDTO): Promise<User> {
    // Validación de reglas de negocio
    if (!this.isValidEmail(data.email)) {
      throw new DomainError('Email inválido');
    }

    const user: User = {
      id: generateUUID(),
      email: data.email,
      name: data.name,
      createdAt: new Date()
    };

    await this.userRepository.save(user);
    await this.emailService.sendWelcome(user);

    return user;
  }
}

// Infrastructure Layer - Implementaciones
class PostgresUserRepository implements UserRepository {
  async findById(id: string): Promise<User | null> {
    const result = await db.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }
}`,
    language: 'typescript',
    tags: ['clean-architecture', 'solid', 'dependency-injection'],
  },
  {
    id: 'event-driven',
    title: 'Event-Driven Architecture',
    description: 'Comunicación asíncrona mediante eventos, desacoplamiento de servicios y escalabilidad.',
    code: `// Event Bus con Redis Pub/Sub
import Redis from 'ioredis';

class EventBus {
  private publisher: Redis;
  private subscriber: Redis;
  private handlers: Map<string, Function[]> = new Map();

  constructor() {
    this.publisher = new Redis(process.env.REDIS_URL);
    this.subscriber = new Redis(process.env.REDIS_URL);
    this.setupSubscriber();
  }

  private setupSubscriber() {
    this.subscriber.on('message', (channel, message) => {
      const handlers = this.handlers.get(channel) || [];
      const event = JSON.parse(message);
      handlers.forEach(handler => handler(event));
    });
  }

  async publish<T>(eventName: string, payload: T): Promise<void> {
    const event = {
      id: generateUUID(),
      name: eventName,
      payload,
      timestamp: new Date().toISOString()
    };
    await this.publisher.publish(eventName, JSON.stringify(event));
  }

  subscribe(eventName: string, handler: Function): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
      this.subscriber.subscribe(eventName);
    }
    this.handlers.get(eventName)!.push(handler);
  }
}

// Uso en servicios
eventBus.subscribe('user.created', async (event) => {
  await sendWelcomeEmail(event.payload);
  await createUserAnalytics(event.payload);
});`,
    language: 'typescript',
    tags: ['event-driven', 'redis', 'pub-sub', 'async'],
  },
  {
    id: 'cqrs',
    title: 'CQRS Pattern',
    description: 'Separación de operaciones de lectura y escritura para optimizar rendimiento y escalabilidad.',
    code: `// Command - Operaciones de escritura
interface Command {
  execute(): Promise<void>;
}

class CreateOrderCommand implements Command {
  constructor(
    private orderRepository: OrderRepository,
    private eventBus: EventBus,
    private data: CreateOrderDTO
  ) {}

  async execute(): Promise<void> {
    const order = Order.create(this.data);
    await this.orderRepository.save(order);
    
    // Emitir evento para actualizar read model
    await this.eventBus.publish('order.created', {
      orderId: order.id,
      userId: order.userId,
      total: order.total
    });
  }
}

// Query - Operaciones de lectura optimizadas
class OrderQueryService {
  constructor(private readDb: ReadDatabase) {}

  async getOrdersByUser(userId: string): Promise<OrderView[]> {
    // Read model desnormalizado para consultas rápidas
    return this.readDb.query(\`
      SELECT o.*, u.name as user_name, 
             array_agg(p.name) as product_names
      FROM order_views o
      JOIN users u ON o.user_id = u.id
      JOIN order_products op ON o.id = op.order_id
      JOIN products p ON op.product_id = p.id
      WHERE o.user_id = $1
      GROUP BY o.id, u.name
    \`, [userId]);
  }
}

// Event Handler - Sincroniza read model
eventBus.subscribe('order.created', async (event) => {
  await readDb.upsert('order_views', {
    id: event.payload.orderId,
    user_id: event.payload.userId,
    total: event.payload.total,
    status: 'pending'
  });
});`,
    language: 'typescript',
    tags: ['cqrs', 'event-sourcing', 'read-model', 'write-model'],
  },
];

