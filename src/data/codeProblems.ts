import { CodeProblem } from '@/interfaces';

export const codeProblems: CodeProblem[] = [
  {
    id: 'memory-leak-react',
    title: 'Memory Leak en useEffect',
    description: 'Identificar y solucionar fugas de memoria en componentes React con efectos asíncronos.',
    problem: `// ❌ Problema: Memory leak cuando el componente se desmonta
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId).then(data => {
      setUser(data);      // ⚠️ Puede ejecutarse después del unmount
      setLoading(false);  // ⚠️ Causa memory leak
    });
  }, [userId]);

  if (loading) return <Spinner />;
  return <div>{user.name}</div>;
}`,
    solution: `// ✅ Solución: Cleanup function con AbortController
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    
    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await fetchUser(userId, {
          signal: abortController.signal
        });
        
        // Solo actualiza si no fue abortado
        if (!abortController.signal.aborted) {
          setUser(data);
          setLoading(false);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    loadUser();

    // Cleanup: cancela la petición si el componente se desmonta
    return () => abortController.abort();
  }, [userId]);

  if (error) return <ErrorMessage message={error} />;
  if (loading) return <Spinner />;
  return <div>{user.name}</div>;
}`,
    explanation: 'El problema original no maneja el caso donde el componente se desmonta antes de que la petición termine. La solución usa AbortController para cancelar peticiones pendientes y evitar actualizaciones de estado en componentes desmontados.',
    language: 'typescript',
    difficulty: 'medium',
    tags: ['react', 'hooks', 'memory-leak', 'async'],
  },
  {
    id: 'n-plus-one',
    title: 'Problema N+1 en Queries',
    description: 'Optimizar consultas a base de datos evitando el clásico problema N+1.',
    problem: `// ❌ Problema: N+1 queries - muy ineficiente
async function getOrdersWithProducts(userId: string) {
  // 1 query para obtener órdenes
  const orders = await db.query(
    'SELECT * FROM orders WHERE user_id = $1',
    [userId]
  );

  // N queries adicionales (una por cada orden)
  for (const order of orders) {
    order.products = await db.query(
      'SELECT p.* FROM products p 
       JOIN order_items oi ON p.id = oi.product_id 
       WHERE oi.order_id = $1',
      [order.id]
    );
  }

  return orders;
}
// Si hay 100 órdenes = 101 queries 😱`,
    solution: `// ✅ Solución: Una sola query con JOIN
async function getOrdersWithProducts(userId: string) {
  const result = await db.query(\`
    SELECT 
      o.id as order_id,
      o.total,
      o.created_at,
      json_agg(
        json_build_object(
          'id', p.id,
          'name', p.name,
          'price', p.price,
          'quantity', oi.quantity
        )
      ) as products
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = $1
    GROUP BY o.id
    ORDER BY o.created_at DESC
  \`, [userId]);

  return result.rows;
}
// Solo 1 query sin importar cuántas órdenes 🚀

// Alternativa con DataLoader para GraphQL
const productLoader = new DataLoader(async (orderIds) => {
  const products = await db.query(\`
    SELECT oi.order_id, p.*
    FROM order_items oi
    JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ANY($1)
  \`, [orderIds]);

  // Agrupar por order_id
  return orderIds.map(id => 
    products.filter(p => p.order_id === id)
  );
});`,
    explanation: 'El problema N+1 ocurre cuando hacemos una query inicial y luego N queries adicionales en un loop. La solución es usar JOINs para obtener todos los datos en una sola query, o usar DataLoader para batching automático en GraphQL.',
    language: 'typescript',
    difficulty: 'medium',
    tags: ['sql', 'performance', 'database', 'optimization'],
  },
  {
    id: 'race-condition',
    title: 'Race Condition en Actualizaciones',
    description: 'Prevenir condiciones de carrera en operaciones concurrentes de base de datos.',
    problem: `// ❌ Problema: Race condition en transferencia de dinero
async function transferMoney(fromId, toId, amount) {
  // Dos usuarios pueden leer el mismo balance simultáneamente
  const fromAccount = await db.query(
    'SELECT balance FROM accounts WHERE id = $1',
    [fromId]
  );
  
  const toAccount = await db.query(
    'SELECT balance FROM accounts WHERE id = $1',
    [toId]
  );

  if (fromAccount.balance < amount) {
    throw new Error('Fondos insuficientes');
  }

  // Entre la lectura y escritura, otro proceso puede modificar
  await db.query(
    'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
    [amount, fromId]
  );
  
  await db.query(
    'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
    [amount, toId]
  );
}`,
    solution: `// ✅ Solución: Transacción con bloqueo pesimista
async function transferMoney(fromId, toId, amount) {
  const client = await db.pool.connect();
  
  try {
    await client.query('BEGIN');
    
    // SELECT FOR UPDATE bloquea las filas hasta el COMMIT
    const fromAccount = await client.query(
      'SELECT balance FROM accounts WHERE id = $1 FOR UPDATE',
      [fromId]
    );
    
    const toAccount = await client.query(
      'SELECT balance FROM accounts WHERE id = $1 FOR UPDATE',
      [toId]
    );

    if (fromAccount.rows[0].balance < amount) {
      throw new Error('Fondos insuficientes');
    }

    await client.query(
      'UPDATE accounts SET balance = balance - $1 WHERE id = $2',
      [amount, fromId]
    );
    
    await client.query(
      'UPDATE accounts SET balance = balance + $1 WHERE id = $2',
      [amount, toId]
    );

    await client.query('COMMIT');
    
    return { success: true };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Alternativa: Bloqueo optimista con versioning
async function updateWithOptimisticLock(id, data, expectedVersion) {
  const result = await db.query(\`
    UPDATE accounts 
    SET balance = $1, version = version + 1
    WHERE id = $2 AND version = $3
    RETURNING *
  \`, [data.balance, id, expectedVersion]);

  if (result.rowCount === 0) {
    throw new ConflictError('El registro fue modificado por otro proceso');
  }
  
  return result.rows[0];
}`,
    explanation: 'Las race conditions ocurren cuando múltiples procesos leen y escriben datos simultáneamente. La solución usa transacciones con SELECT FOR UPDATE (bloqueo pesimista) o versioning (bloqueo optimista) para garantizar consistencia.',
    language: 'typescript',
    difficulty: 'hard',
    tags: ['database', 'concurrency', 'transactions', 'locking'],
  },
  {
    id: 'debounce-throttle',
    title: 'Debounce vs Throttle',
    description: 'Implementación correcta de debounce y throttle para optimizar eventos frecuentes.',
    problem: `// ❌ Problema: Búsqueda que hace request en cada keystroke
function SearchInput() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Hace una petición por cada letra escrita 😰
    const data = await searchAPI(value);
    setResults(data);
  };

  return (
    <input 
      value={query} 
      onChange={handleChange}
      placeholder="Buscar..."
    />
  );
}`,
    solution: `// ✅ Solución: Hook personalizado con debounce
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

function SearchInput() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Solo cambia después de 300ms sin escribir
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      return;
    }

    const search = async () => {
      setLoading(true);
      const data = await searchAPI(debouncedQuery);
      setResults(data);
      setLoading(false);
    };

    search();
  }, [debouncedQuery]);

  return (
    <div>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar..."
      />
      {loading && <Spinner />}
      <ResultsList results={results} />
    </div>
  );
}

// Throttle para eventos de scroll/resize
function useThrottle<T>(value: T, interval: number): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastExecuted = useRef(Date.now());

  useEffect(() => {
    const now = Date.now();
    const timeSinceLastExecution = now - lastExecuted.current;

    if (timeSinceLastExecution >= interval) {
      lastExecuted.current = now;
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, interval - timeSinceLastExecution);

      return () => clearTimeout(timer);
    }
  }, [value, interval]);

  return throttledValue;
}`,
    explanation: 'Debounce espera a que el usuario deje de escribir por X ms antes de ejecutar. Throttle limita la ejecución a máximo una vez cada X ms. Debounce es mejor para búsquedas, throttle para scroll/resize.',
    language: 'typescript',
    difficulty: 'easy',
    tags: ['react', 'performance', 'hooks', 'optimization'],
  },
];

