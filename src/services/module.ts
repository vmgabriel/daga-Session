// Develop vmgabriel

// Abstract Service
import { AbstractService } from './abstract';

// Model Service
import { ModuleModel } from '../models/menu';

/** Module Service  */
export class ModuleService extends AbstractService {
  constructor() {
    super('module', new ModuleModel(), 'moduleIsValidSchema');
  }

  // End Class
}
