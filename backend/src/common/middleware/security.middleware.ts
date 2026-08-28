import helmet from 'helmet';
import { helmetConfig } from '../../config/security.config';

export const securityMiddleware = helmet(helmetConfig);
